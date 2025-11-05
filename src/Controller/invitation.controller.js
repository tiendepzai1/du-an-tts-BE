import Invitation from "../Model/invitation.model.js";
import User from "../Model/user.model.js";
import Broad from "../Model/broad.model.js";

// Gửi lời mời
export const sendInvitation = async (req, res) => {
    try {
        const { boardId, email, message } = req.body;
        const senderId = req.user.id; // Từ auth middleware

        // Validate input
        if (!boardId || !email) {
            return res.status(400).json({
                message: "Board ID và email là bắt buộc"
            });
        }

        // 1. Kiểm tra board có tồn tại và user có quyền invite không
        const board = await Broad.findById(boardId);
        if (!board) {
            return res.status(404).json({
                message: "Board không tồn tại"
            });
        }

        // Chỉ owner mới có thể invite
        if (board.owner.toString() !== senderId) {
            return res.status(403).json({
                message: "Bạn không có quyền mời người khác vào board này"
            });
        }

        // 2. Kiểm tra email có tồn tại trong hệ thống không
        const lowerCaseEmail = email.toLowerCase().trim();
        const recipientUser = await User.findOne({ email: lowerCaseEmail });

        // 3. Nếu user đã tồn tại, kiểm tra xem đã là thành viên (owner/member) chưa
        if (recipientUser) {
            const recipientId = recipientUser._id.toString();

            // Kiểm tra Owner
            if (board.owner.toString() === recipientId) {
                return res.status(400).json({
                    message: "Người này đã là chủ sở hữu của board"
                });
            }

            // ✅ LOGIC ĐÃ THÊM: Kiểm tra Member
            const isMember = board.members.some(memberId => memberId.toString() === recipientId);
            if (isMember) {
                return res.status(400).json({
                    message: "Người này đã là thành viên của board"
                });
            }
        }

        // 4. Kiểm tra xem đã có invitation pending chưa
        const existingInvitation = await Invitation.findOne({
            boardId,
            recipientEmail: lowerCaseEmail,
            status: 'pending'
        });

        if (existingInvitation) {
            return res.status(400).json({
                message: "Lời mời đã được gửi cho email này và đang chờ phản hồi"
            });
        }

        // 5. Tạo invitation mới
        const invitation = await Invitation.create({
            boardId,
            senderId,
            recipientEmail: lowerCaseEmail,
            recipientId: recipientUser ? recipientUser._id : null,
            message: message || `Bạn được mời tham gia board "${board.broadName}"`
        });

        // Populate thông tin để trả về
        await invitation.populate([
            { path: 'senderId', select: 'name email' },
            { path: 'boardId', select: 'broadName description' }
        ]);

        return res.status(201).json({
            message: recipientUser
                ? "Lời mời đã được gửi thành công"
                : "Lời mời đã được gửi. Người nhận sẽ cần đăng ký tài khoản để tham gia",
            data: invitation
        });

    } catch (error) {
        console.error('Send invitation error:', error);
        return res.status(500).json({
            message: "Lỗi server khi gửi lời mời",
            error: error.message
        });
    }
};

// Lấy danh sách lời mời đã nhận
export const getReceivedInvitations = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        // Kiểm tra nếu user không tồn tại hoặc không có email
        if (!user || !user.email) {
            console.warn(`User ID ${userId} not found or missing email for invitation lookup.`);
            return res.status(404).json({ message: "Thông tin người dùng không hợp lệ" });
        }

        // Chuẩn hóa email của người dùng đang đăng nhập
        const normalizedEmail = user.email.toLowerCase().trim();

        const invitations = await Invitation.find({
            $or: [
                { recipientId: userId },
                { recipientEmail: normalizedEmail } // Sử dụng email đã chuẩn hóa
            ],
            status: 'pending'
        })
            .populate('senderId', 'name email')
            .populate('boardId', 'broadName description')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Lấy danh sách lời mời thành công",
            data: invitations
        });

    } catch (error) {
        console.error('Get invitations error:', error);
        return res.status(500).json({
            message: "Lỗi server khi lấy danh sách lời mời",
            error: error.message
        });
    }
};

// Chấp nhận lời mời
export const acceptInvitation = async (req, res) => {
    try {
        const { invitationId } = req.params;
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        const invitation = await Invitation.findById(invitationId)
            .populate('boardId');

        if (!invitation) {
            return res.status(404).json({
                message: "Lời mời không tồn tại"
            });
        }

        // Chuẩn hóa email để kiểm tra quyền
        const userEmail = user.email.toLowerCase().trim();
        const invitationEmail = invitation.recipientEmail.toLowerCase().trim();

        // Kiểm tra quyền: ID người nhận phải khớp HOẶC email lời mời phải khớp với email người dùng
        if (invitation.recipientId?.toString() !== userId &&
            invitationEmail !== userEmail) {
            return res.status(403).json({
                message: "Bạn không có quyền với lời mời này"
            });
        }

        if (invitation.status !== 'pending') {
            return res.status(400).json({
                message: "Lời mời này đã được xử lý"
            });
        }

        // 1. Lấy Board để cập nhật members
        // Sử dụng invitation.boardId._id vì nó đã được populate
        const boardToUpdate = await Broad.findById(invitation.boardId._id);

        if (!boardToUpdate) {
            return res.status(404).json({ message: "Board liên quan không tồn tại" });
        }

        // 2. KIỂM TRA: Người dùng đã là thành viên hay chưa
        const isOwner = boardToUpdate.owner.toString() === userId;
        const isMember = boardToUpdate.members.some(memberId => memberId.toString() === userId);

        // 3. THÊM THÀNH VIÊN VÀO BOARD (chỉ khi họ chưa phải là Owner hoặc Member)
        if (!isOwner && !isMember) {
            // ✅ LOGIC CHÍNH: Thêm userId vào members array của board
            boardToUpdate.members.push(userId);
            await boardToUpdate.save();
        }
        // Nếu đã là owner/member, chỉ cập nhật trạng thái lời mời.

        // 4. Cập nhật trạng thái invitation
        invitation.status = 'accepted';
        invitation.recipientId = userId; // Đảm bảo ID người nhận được set nếu ban đầu là null
        await invitation.save();

        return res.status(200).json({
            message: "Chấp nhận lời mời và đã tham gia board thành công",
            data: invitation
        });

    } catch (error) {
        console.error('Accept invitation error:', error);
        return res.status(500).json({
            message: "Lỗi server khi chấp nhận lời mời",
            error: error.message
        });
    }
};

// Từ chối lời mời
export const rejectInvitation = async (req, res) => {
    try {
        const { invitationId } = req.params;
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        const invitation = await Invitation.findById(invitationId);

        if (!invitation) {
            return res.status(404).json({
                message: "Lời mời không tồn tại"
            });
        }

        // Chuẩn hóa email để kiểm tra
        const userEmail = user.email.toLowerCase().trim();
        const invitationEmail = invitation.recipientEmail.toLowerCase().trim();

        // Kiểm tra quyền
        if (invitation.recipientId?.toString() !== userId &&
            invitationEmail !== userEmail) {
            return res.status(403).json({
                message: "Bạn không có quyền với lời mời này"
            });
        }

        if (invitation.status !== 'pending') {
            return res.status(400).json({
                message: "Lời mời này đã được xử lý"
            });
        }

        // Cập nhật invitation
        invitation.status = 'rejected';
        await invitation.save();

        return res.status(200).json({
            message: "Từ chối lời mời thành công"
        });

    } catch (error) {
        console.error('Reject invitation error:', error);
        return res.status(500).json({
            message: "Lỗi server khi từ chối lời mời",
            error: error.message
        });
    }
};