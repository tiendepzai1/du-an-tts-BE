import e from "express";
import Broad from "../Model/broad.model.js";



export const BroadCreate = async (req, res) => {
  try {
    const { broadName } = req.body
    const UserId = req.body.id

    if (!broadName || broadName.trim() === "") {
      return res.status(400).json({
        message: "broadName k được bỏ trống"
      })
    }

    const broadCheck = await Broad.findOne({ broadName: req.body.broadName })
    if (broadCheck) {
      return res.status(400).json({
        message: "tên broad đã tồn tại"
      })
    }

    const broad = await Broad.create({
      broadName: req.body.broadName,
      description: req.body.description,
      owner: UserId,

    })
    return res.status(200).json({
      message: "thêm broad thanh công"
    })
  } catch (error) {
    console.log(error)

  }
}

export const ListBroad = async (req, res) => {
  try {
    const broadList = await Broad.find();

    if (broadList.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không có board nào"
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
        message: "Không tìm thấy id cần xóa",
      });
    }
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
export const GetByIdBroad = async (req, res) => {
  try {
    const { id } = req.params; // ✅ Lấy id từ URL, ví dụ /broad/detail/:id

    // ✅ Tìm board theo id và lấy luôn các list liên quan
    const broad = await Broad.findById(id)
      .populate("ownerList"); // Lấy chi tiết các list từ ref "List"

    // ✅ Nếu không tìm thấy board
    if (!broad) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy board",
      });
    }

    // ✅ Trả dữ liệu board kèm list
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