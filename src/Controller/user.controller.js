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

export const Logout = async (req, res) => {
  res.clearCookie()
}