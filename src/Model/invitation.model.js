import mongoose from "mongoose";

const InvitationSchema = new mongoose.Schema({
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Broad",
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    recipientEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null // Sẽ được set khi user được tìm thấy
    },
    message: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'expired'],
        default: 'pending'
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 ngày
    }
}, {
    versionKey: false,
    timestamps: true
});

// Index để tránh duplicate invitation
InvitationSchema.index({ boardId: 1, recipientEmail: 1, status: 1 });

// Index để tự động xóa expired invitations
InvitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Invitation = mongoose.model("Invitation", InvitationSchema);
export default Invitation;