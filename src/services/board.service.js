import Board from '../Model/board.model.js';
import User from '../Model/user.model.js';
import List from '../Model/list.model.js';
import Card from '../Model/card.model.js';
import mongoose from 'mongoose';

class BoardService {
    // Tạo board mới
    async createBoard(userId, data) {
        try {
            const board = await Board.create({
                ...data,
                owner: userId,
                members: [{ user: userId, role: 'admin' }],
                lists: [],
                labels: [
                    { name: 'Quan trọng', color: '#ef4444' },
                    { name: 'Cần làm ngay', color: '#f97316' },
                    { name: 'Có thể đợi', color: '#22c55e' },
                    { name: 'Idea', color: '#3b82f6' }
                ]
            });

            await board.populate('members.user', 'username email avatar');
            return board;
        } catch (error) {
            throw new Error('Không thể tạo board: ' + error.message);
        }
    }
    // Kiểm tra quyền member
    async _checkMemberPermission(boardId, userId, requiredRole = null) {
        const board = await Board.findById(boardId);
        if (!board) throw new Error('Board không tồn tại');

        const member = board.members.find(m => m.user.toString() === userId.toString());
        if (!member) throw new Error('Không có quyền truy cập board này');

        if (requiredRole && member.role !== requiredRole && member.role !== 'admin') {
            throw new Error(`Cần quyền ${requiredRole} để thực hiện thao tác này`);
        }

        return { board, member };
    }

    // Sắp xếp lại các list
    async reorderLists(boardId, userId, listOrders) {
        try {
            const { board } = await this._checkMemberPermission(boardId, userId);

            // Validate listOrders
            if (!Array.isArray(listOrders)) {
                throw new Error('listOrders phải là một mảng');
            }

            // Update positions
            const updateOps = listOrders.map(({ listId, position }) => ({
                updateOne: {
                    filter: { _id: listId, board: boardId },
                    update: { $set: { position } }
                }
            }));

            await List.bulkWrite(updateOps);

            return await this.getBoardById(boardId, userId);
        } catch (error) {
            throw new Error('Không thể sắp xếp lại các list: ' + error.message);
        }
    }

    // Lấy tất cả board của user
    async getBoardsByUser(userId) {
        try {
            const boards = await Board.find({
                'members.user': userId
            })
                .populate('members.user', 'username email avatar')
                .populate('labels')
                .select('-lists -activities');

            return boards;
        } catch (error) {
            throw new Error('Không thể lấy danh sách board: ' + error.message);
        }
    }

    // Tìm kiếm board
    async searchBoards(userId, searchTerm) {
        try {
            const boards = await Board.find({
                'members.user': userId,
                $or: [
                    { broadName: new RegExp(searchTerm, 'i') },
                    { description: new RegExp(searchTerm, 'i') }
                ]
            })
                .populate('members.user', 'username email avatar')
                .select('-lists -activities');

            return boards;
        } catch (error) {
            throw new Error('Không thể tìm kiếm board: ' + error.message);
        }
    }

    // Lấy chi tiết board
    async getBoardById(boardId, userId) {
        try {
            const board = await Board.findById(boardId)
                .populate('members.user', 'username email avatar')
                .populate('labels')
                .populate({
                    path: 'lists',
                    match: { archived: false },
                    populate: {
                        path: 'cards',
                        match: { archived: false },
                        populate: ['members.user', 'labels']
                    }
                });

            if (!board) {
                throw new Error('Board không tồn tại');
            }

            // Kiểm tra quyền truy cập
            const member = board.members.find(m => m.user._id.toString() === userId.toString());
            if (!member) {
                throw new Error('Không có quyền truy cập board này');
            }

            return board;
        } catch (error) {
            throw new Error('Không thể lấy thông tin board: ' + error.message);
        }
    }

    // Cập nhật board
    async updateBoard(boardId, userId, data) {
        try {
            const { board } = await this._checkMemberPermission(boardId, userId, 'admin');

            // Cập nhật các trường được phép
            const allowedFields = ['boardName', 'description', 'settings', 'labels', 'background'];
            Object.keys(data).forEach(key => {
                if (allowedFields.includes(key)) {
                    board[key] = data[key];
                }
            });

            await board.save();
            await board.populate('members.user', 'username email avatar');
            return board;
        } catch (error) {
            throw new Error('Không thể cập nhật board: ' + error.message);
        }
    }

    // Thêm thành viên vào board
    async addMember(boardId, adminId, userEmail, role = 'member') {
        try {
            const { board } = await this._checkMemberPermission(boardId, adminId, 'admin');
            const user = await User.findOne({ email: userEmail });

            if (!board) throw new Error('Board không tồn tại');
            if (!user) throw new Error('Không tìm thấy người dùng với email này');


            // Kiểm tra người dùng đã là thành viên chưa
            if (board.members.some(m => m.user.toString() === user._id.toString())) {
                throw new Error('Người dùng đã là thành viên của board');
            }

            board.members.push({
                user: user._id,
                role
            });

            await board.save();
            await board.populate('members.user', 'username email avatar');

            // Thêm hoạt động
            await board.addActivity(adminId, 'added-member', 'member', user._id);

            return board;
        } catch (error) {
            throw new Error('Không thể thêm thành viên: ' + error.message);
        }
    }

    // Xóa thành viên khỏi board
    async removeMember(boardId, adminId, userId) {
        try {
            const board = await Board.findById(boardId);
            if (!board) throw new Error('Board không tồn tại');

            // Kiểm tra quyền admin
            const admin = board.members.find(m => m.user.toString() === adminId.toString());
            if (!admin || admin.role !== 'admin') {
                throw new Error('Không có quyền xóa thành viên');
            }

            // Không thể xóa owner
            if (board.owner.toString() === userId.toString()) {
                throw new Error('Không thể xóa chủ sở hữu board');
            }

            board.members = board.members.filter(m => m.user.toString() !== userId.toString());
            await board.save();

            // Xóa user khỏi tất cả các card trong board
            await Card.updateMany(
                { board: boardId },
                { $pull: { 'members.user': userId, watchers: userId } }
            );

            // Thêm hoạt động
            await board.addActivity(adminId, 'removed-member', 'member', userId);

            return board;
        } catch (error) {
            throw new Error('Không thể xóa thành viên: ' + error.message);
        }
    }

    // Thay đổi quyền thành viên
    async changeMemberRole(boardId, adminId, userId, newRole) {
        try {
            const board = await Board.findById(boardId);
            if (!board) throw new Error('Board không tồn tại');

            // Kiểm tra quyền admin
            const admin = board.members.find(m => m.user.toString() === adminId.toString());
            if (!admin || admin.role !== 'admin') {
                throw new Error('Không có quyền thay đổi quyền thành viên');
            }

            // Không thể thay đổi quyền owner
            if (board.owner.toString() === userId.toString()) {
                throw new Error('Không thể thay đổi quyền của chủ sở hữu board');
            }

            const member = board.members.find(m => m.user.toString() === userId.toString());
            if (!member) throw new Error('Người dùng không phải là thành viên của board');

            member.role = newRole;
            await board.save();

            // Thêm hoạt động
            await board.addActivity(adminId, 'changed-member-role', 'member', userId, { newRole });

            return board;
        } catch (error) {
            throw new Error('Không thể thay đổi quyền thành viên: ' + error.message);
        }
    }

    // Thêm/Cập nhật nhãn
    async updateLabels(boardId, userId, labels) {
        try {
            const board = await Board.findById(boardId);
            if (!board) throw new Error('Board không tồn tại');

            // Kiểm tra quyền
            const member = board.members.find(m => m.user.toString() === userId.toString());
            if (!member) throw new Error('Không có quyền chỉnh sửa nhãn');

            board.labels = labels;
            await board.save();

            return board;
        } catch (error) {
            throw new Error('Không thể cập nhật nhãn: ' + error.message);
        }
    }

    // Lưu trữ board
    async archiveBoard(boardId, userId) {
        try {
            const board = await Board.findById(boardId);
            if (!board) throw new Error('Board không tồn tại');

            // Kiểm tra quyền admin
            const member = board.members.find(m => m.user.toString() === userId.toString());
            if (!member || member.role !== 'admin') {
                throw new Error('Không có quyền lưu trữ board');
            }

            await board.archive();

            // Thêm hoạt động
            await board.addActivity(userId, 'archived-board', 'board', boardId);

            return board;
        } catch (error) {
            throw new Error('Không thể lưu trữ board: ' + error.message);
        }
    }
}

export default new BoardService();