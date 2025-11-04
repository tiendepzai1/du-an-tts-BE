import jwt from 'jsonwebtoken';
import User from '../Model/user.model.js';
// Bạn có thể xóa import Board, isAdmin, isBoardMember, refreshToken nếu chưa dùng.
// Giữ lại Board nếu bạn dự định dùng isBoardMember.

// Đổi tên hàm thành verifyToken (hoặc giữ nguyên authenticateToken nếu bạn thích)
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Access token not found' });
        }

        // ✅ FIX 1: THÊM FALLBACK SECRET để khớp với token generation trong user.controller.js
        const secret = process.env.JWT_SECRET || '123456';
        const decoded = jwt.verify(token, secret);

        // ✅ FIX 2: SỬ DỤNG decoded.id (thay vì decoded.userId) 
        // để khớp với payload { id: user._id } khi tạo token.
        // Thêm .select('-password') để không gắn mật khẩu vào req.user
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        // Log lỗi chi tiết
        console.error("Token verification error:", error.message);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Xuất mặc định để các router có thể dễ dàng import
export default verifyToken;

// Giữ lại các export phụ nếu bạn cần sử dụng chúng ở những nơi khác (ví dụ: trong user.router.js)
// export const authenticateToken = verifyToken;
// export const refreshToken = ...
// ...