import express from 'express';
import {
    sendInvitation,
    getReceivedInvitations,
    acceptInvitation,
    rejectInvitation
} from '../Controller/invitation.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const router = express.Router();

// Tất cả routes đều cần authentication
router.use(verifyToken);

// POST /invitation/send - Gửi lời mời
router.post('/send', sendInvitation);

// GET /invitation/received - Lấy danh sách lời mời đã nhận
router.get('/received', getReceivedInvitations);

// PUT /invitation/:invitationId/accept - Chấp nhận lời mời
router.put('/:invitationId/accept', acceptInvitation);

// PUT /invitation/:invitationId/reject - Từ chối lời mời
router.put('/:invitationId/reject', rejectInvitation);

export default router;