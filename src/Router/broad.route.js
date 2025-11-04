import express from 'express'
// ✅ BƯỚC 1: IMPORT middleware xác thực (Bạn cần đảm bảo file này tồn tại)
import verifyToken from '../middleware/auth.middleware.js';
import { BroadCreate, DeleteBroad, ListBroad, UpdateBroad, GetByIdBroad } from '../Controller/broad.controller.js';


const router = express.Router();

// ✅ BƯỚC 2: ÁP DỤNG middleware verifyToken cho tất cả các route
router.post("/create", verifyToken, BroadCreate); // Protected: Cần user ID để tạo
router.get("/list", verifyToken, ListBroad); // Protected: Cần user ID để lọc danh sách
router.get("/detail/:id", verifyToken, GetByIdBroad); // Protected: Cần user ID để kiểm tra quyền xem
router.delete("/delete/:id", verifyToken, DeleteBroad) // Protected: Cần user ID để kiểm tra quyền xóa
router.put("/update/:id", verifyToken, UpdateBroad) // Protected: Cần user ID để kiểm tra quyền sửa

export default router;