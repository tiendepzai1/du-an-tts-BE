import User from "../Model/user.model.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {

    const userExistEmail = await User.findOne({ email: req.body.email });
    const userExistUsername = await User.findOne({ username: req.body.username });
    if (userExistUsername) {
      return res.status(400).json({
        field: "username",
        message: `Tên người dùng "${req.body.username}" đã tồn tại, vui lòng chọn tên khác`
      });
    }

    if (userExistEmail) {
      return res.status(400).json({
        field: "email",
        message: `Email "${req.body.email}" đã được đăng ký, vui lòng chọn email khác`
      });
    }


    const hashPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashPassword


    const user = await User.create(req.body)
    user.password = undefined;

    return res.status(201).json({
      message: "Đăng ký thành công",
      data: user
    })

  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body; // Chỉ cần email và password

    const user = await User.findOne({ email }).select("+password"); // Chỉ kiểm tra email
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "123456", { expiresIn: "24h" }); // Tăng thời gian
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 giờ
    });

    user.password = undefined;
    return res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Search users for invitations
export const searchUsers = async (req, res) => {
  try {
    // Lấy đúng tham số 'search' và 'searchBy' từ frontend
    const { search, searchBy } = req.query;
    // Đảm bảo req.user được cung cấp bởi middleware auth
    const currentUserId = req.user ? req.user._id : null;
    const trimmedSearch = search ? search.trim() : '';

    // 1. Kiểm tra Query rỗng
    if (!trimmedSearch) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "Search query cannot be empty."
      });
    }

    // 2. Tạo điều kiện tìm kiếm
    let searchConditions = {};
    const searchRegex = new RegExp(trimmedSearch, 'i');

    if (searchBy === 'email') {
      // ✅ SỬA LỖI LOGIC: Khi tìm kiếm bằng email, bỏ qua kiểm tra độ dài < 2
      searchConditions = { email: searchRegex };
    } else if (searchBy === 'name' || searchBy === 'username') {
      // Chỉ áp dụng kiểm tra độ dài cho Name/Username
      if (trimmedSearch.length < 2) {
        return res.status(200).json({
          success: true,
          data: [],
          message: "Please enter at least 2 characters to search"
        });
      }
      searchConditions = {
        $or: [
          { email: searchRegex },
          { username: searchRegex },
          { name: searchRegex }
        ]
      };
    } else {
      // Trường hợp searchBy không hợp lệ hoặc thiếu
      return res.status(400).json({
        success: false,
        message: "Invalid or missing 'searchBy' parameter."
      });
    }

    // Điều kiện loại trừ người dùng hiện tại (chỉ nếu currentUserId tồn tại)
    const exclusionCondition = currentUserId ? { _id: { $ne: currentUserId } } : {};


    // 3. Thực hiện tìm kiếm (Loại trừ người dùng hiện tại)
    const users = await User.find({
      ...exclusionCondition, // Loại trừ chính người dùng đang tìm kiếm (nếu đã đăng nhập)
      ...searchConditions // Áp dụng điều kiện tìm kiếm
    }).select('_id name email username').limit(10);

    return res.status(200).json({
      success: true,
      data: users,
      message: users.length > 0 ? "Search completed." : "No users found."
    });

  } catch (error) {
    console.error("Error searching users:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const Logout = async (req, res) => {
  res.clearCookie()
}