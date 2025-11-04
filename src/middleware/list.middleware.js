export const validateList = (req, res, next) => {
  const { listName, ownerBroad } = req.body; // ❌ Đã xóa status khỏi destructuring

  // Required fields
  if (!listName || !ownerBroad) {
    return res.status(400).json({
      success: false,
      message: "listName và ownerBroad là bắt buộc",
    });
  }

  if (listName.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "listName không được để trống",
    });
  }

  // ❌ ĐÃ XÓA LOGIC KIỂM TRA status

  // Validate ownerBroad ObjectId
  if (!/^[0-9a-fA-F]{24}$/.test(ownerBroad)) {
    return res.status(400).json({
      success: false,
      message: "ownerBroad không hợp lệ (phải là ObjectId)",
    });
  }

  next();
};