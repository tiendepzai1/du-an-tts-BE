import mongoose from "mongoose";

const LabelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    color: {
        type: String,
        required: true
    },
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

// Index for faster lookups by board
LabelSchema.index({ board: 1 });

const Label = mongoose.model("Label", LabelSchema);
export default Label;