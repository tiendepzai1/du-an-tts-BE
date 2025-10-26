// src/middlewares/verifyToken.js
import jwt from "jsonwebtoken";
import User from "../Model/user.model.js";

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Thiếu token xác thực" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, "123456"); // Nếu dùng biến môi trường thì thay bằng process.env.JWT_SECRET

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "Không tìm thấy người dùng" });
        }

        req.user = user; // Gán user cho req để controller phía sau dùng
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
};

export default verifyToken;
