import mongoose from "mongoose";

const CardSchema = new mongoose.Schema({
    cardName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    dueDate: {
        type: Date,
    },
    position: {
        type: Number,
        default: 0,
    },

    // ✅ FIX: Thay thế Boolean bằng String Enum
    status: {
        type: String,
        enum: ['todo', 'doing', 'done'], // Giá trị chấp nhận là chuỗi
        default: 'todo',
    },


    ownerLists: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "List",
        },
    ],

    memberUser: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
    ],
});

const Card = mongoose.model("Card", CardSchema);
export default Card;