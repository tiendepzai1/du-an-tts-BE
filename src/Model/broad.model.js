import mongoose from "mongoose";

const BroadSchema = new mongoose.Schema({
    broadName: {
        type: String,
        required: true,
        // ❌ HÃY XÓA: unique : true (đã bị xóa để sử dụng Composite Index)
    },
    description: {
        type: String,
        default: ""
    },

    // ✅ FIX 1: Đổi từ ownerUser array sang owner (single ObjectId)
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true // Đảm bảo luôn có owner
    },

    ownerList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "List"
    }]

}, { versionKey: false, timestamps: true })

// ✅ FIX 2: Thêm index tổng hợp để tên Board là DUY NHẤT CHO MỖI USER
// Điều này cho phép nhiều user có Board cùng tên (khắc phục lỗi E11000)
BroadSchema.index({ broadName: 1, owner: 1 }, { unique: true });

const Broad = mongoose.model("Broad", BroadSchema);
export default Broad;