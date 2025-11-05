import mongoose from "mongoose";

const BroadSchema = new mongoose.Schema({
    broadName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: ""
    },

    // ID người tạo
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // Trường thành viên cho lời mời
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    ownerList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "List"
    }]

}, { versionKey: false, timestamps: true })

// Index tổng hợp để tên Board là DUY NHẤT CHO MỖI USER
BroadSchema.index({ broadName: 1, owner: 1 }, { unique: true });

const Broad = mongoose.model("Broad", BroadSchema);
export default Broad;