import express from 'express';
import {
  addComment,
  getCommentsByCard,
  updateComment,
  deleteComment
} from '../Controller/comment.controller.js';

import verifyToken from '../middleware/auth.middleware.js';

const router = express.Router();

// POST /comment - Tạo comment mới
router.post('/', verifyToken, addComment);
// GET /comment/card/:cardId - Lấy comments theo cardId
router.get('/card/:cardId', getCommentsByCard);
// PUT /comment/:commentId - Cập nhật comment
router.put('/:commentId', verifyToken, updateComment);
// DELETE /comment/:commentId - Xóa comment
router.delete('/:commentId', verifyToken, deleteComment);

export default router;
