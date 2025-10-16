export const validateList = (req, res, next) => {
  const { listName, status, ownerBroad } = req.body;

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

  const validStatuses = ["việc cần làm", "đang thực hiện", "đã xong"];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `status phải là một trong: ${validStatuses.join(", ")}`,
    });
  }

  // Validate ownerBroad ObjectId
  if (!/^[0-9a-fA-F]{24}$/.test(ownerBroad)) {
    return res.status(400).json({
      success: false,
      message: "ownerBroad không hợp lệ (phải là ObjectId)",
    });
  }

  next();
};
