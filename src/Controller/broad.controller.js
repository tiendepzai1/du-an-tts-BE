import e from "express"; // (Có thể xóa nếu không dùng)
import Broad from "../Model/broad.model.js";


export const BroadCreate = async (req, res) => {
  try {
    const { broadName, description } = req.body
    // ✅ LẤY USER ID TỪ TOKEN ĐÃ ĐƯỢC XÁC THỰC
    const UserId = req.user.id // Dùng req.user.id thay vì req.user._id cho nhất quán

    if (!broadName || broadName.trim() === "") {
      return res.status(400).json({
        message: "broadName k được bỏ trống"
      })
    }

    // Tên Board có thể trùng giữa các user khác nhau, nhưng để theo logic cũ:
    const broadCheck = await Broad.findOne({ broadName: req.body.broadName, owner: UserId })
    if (broadCheck) {
      return res.status(400).json({
        message: "tên broad đã tồn tại"
      })
    }

    const broad = await Broad.create({
      broadName: broadName,
      description: description,
      owner: UserId, // ✅ Gán owner
    })
    return res.status(200).json({
      message: "thêm broad thanh công",
      data: broad // ✅ Trả về dữ liệu Broad vừa tạo
    })
  } catch (error) {
    console.error("Lỗi khi tạo broad:", error)
    return res.status(500).json({ message: "Lỗi server: " + error.message })
  }
}

export const ListBroad = async (req, res) => {
  try {
    // ✅ CHỈ TÌM BOARD CỦA NGƯỜI DÙNG HIỆN TẠI
    const userId = req.user.id;

    // ✅ TÌM BOARD MÀ USER LÀ OWNER HOẶC MEMBER
    const broadList = await Broad.find({
      $or: [
        { owner: userId },
        { members: userId }
      ]
    });

    if (broadList.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "Không có board nào của bạn"
      });
    }

    return res.status(200).json({
      success: true,
      data: broadList
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách board:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message
    });
  }
};

export const DeleteBroad = async (req, res) => {
  try {
    const { id } = req.params;
    const broad = await Broad.findById(id);

    if (!broad) {
      return res.status(404).json({
        message: "Không tìm thấy broad cần xóa",
      });
    }

    // ✅ CHECK AUTHORIZATION: Chỉ chủ sở hữu mới được xóa
    if (broad.owner.toString() !== req.user.id.toString()) { // Dùng req.user.id
      return res.status(403).json({
        message: "Bạn không có quyền xóa broad này"
      });
    }

    // 💡 Có thể thêm logic xóa tất cả List và Card thuộc về Board này trước khi xóa Board.
    await Broad.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Xóa thành công",
    });
  } catch (error) {
    console.error("Lỗi khi xóa broad:", error);
    return res.status(500).json({
      message: "Lỗi server: " + error.message,
    });
  }
};

// Hàm lấy chi tiết board theo ID (ĐÃ SỬA LỖI 403)
export const GetByIdBroad = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Lấy ID người dùng hiện tại

    const broad = await Broad.findById(id)
      .populate({
        path: "ownerList",
        populate: {
          path: "ownerCard",
          populate: {
            path: "memberUser",
            select: "name email"
          }
        }
      }); // Lấy chi tiết các list và cards với memberUser

    if (!broad) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy board",
      });
    }

    // ✅ LOGIC MỚI: Kiểm tra xem người dùng có phải là Owner HOẶC Member không
    const isOwner = broad.owner.toString() === userId.toString();
    const isMember = broad.members.some(memberId => memberId.toString() === userId.toString());

    if (!isOwner && !isMember) {
      return res.status(403).json({
        message: "Bạn không có quyền truy cập board này"
      });
    }

    return res.status(200).json({
      success: true,
      data: broad,
    });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết board:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

export const UpdateBroad = async (req, res) => {
  try {
    const { id } = req.params;
    const { broadName, description } = req.body;
    const userId = req.user.id;

    if (!id) {
      return res.status(400).json({
        message: "ID không được bỏ trống"
      });
    }

    const broad = await Broad.findById(id);
    if (!broad) {
      return res.status(404).json({
        message: "Không tìm thấy board với ID này"
      });
    }

    // ✅ CHECK AUTHORIZATION: Chỉ chủ sở hữu mới được cập nhật
    if (broad.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Bạn không có quyền cập nhật broad này"
      });
    }

    // Update fields
    if (broadName) broad.broadName = broadName;
    if (description !== undefined) broad.description = description;

    const updatedBroad = await broad.save();

    return res.status(200).json({
      message: "Cập nhật board thành công",
      data: updatedBroad
    });
  } catch (error) {
    console.log("Error updating broad:", error);
    return res.status(500).json({
      message: "Lỗi server: " + error.message
    });
  }
}