import Comment from '../Model/comment.model.js';

// Thêm bình luận
export const addComment = async (req, res) => {
  try {
    const { cardId, content } = req.body;
    const userId = req.user._id;

    if (!content || !cardId) {
      return res.status(400).json({ message: 'Thiếu nội dung hoặc cardId' });
    }

    const comment = await Comment.create({ cardId, userId, content });
    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi thêm bình luận' });
  }
};

// Lấy danh sách bình luận theo card
export const getCommentsByCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const comments = await Comment.find({ cardId })
      .populate('userId', 'name email')
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy bình luận' });
  }
};

// Cập nhật bình luận
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Không tìm thấy bình luận' });

    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Không có quyền sửa bình luận' });
    }

    comment.content = content;
    comment.updatedAt = new Date();
    await comment.save();

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi cập nhật bình luận' });
  }
};

// Xóa bình luận
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Không tìm thấy bình luận' });

    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Không có quyền xóa bình luận' });
    }

    await comment.deleteOne();
    res.json({ message: 'Xóa bình luận thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi xóa bình luận' });
  }
};
