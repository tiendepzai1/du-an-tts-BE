import express from 'express';
import {
  addComment,
  getCommentsByCard,
  updateComment,
  deleteComment
} from '../Controller/comment.controller.js';

import verifyToken from '../middleware/comment.middleware.js';

const router = express.Router();

router.post('/add', verifyToken, addComment);
router.get('/card/:cardId', getCommentsByCard);
router.put('/:commentId', verifyToken, updateComment);
router.delete('/:commentId', verifyToken, deleteComment);

export default router;
