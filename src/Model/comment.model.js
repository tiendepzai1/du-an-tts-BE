import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const commentSchema = new Schema({
  cardId: {
    type: Schema.Types.ObjectId,
    ref: 'Card',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});

// ✅ Kiểm tra nếu model đã được khai báo thì dùng lại
const Comment = models.Comment || model('Comment', commentSchema);

export default Comment;
