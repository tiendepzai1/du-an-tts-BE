import mongoose from "mongoose";

const listSchema = new mongoose.Schema(
  {
    listName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["việc cần làm", "đang thực hiện", "đã xong"],
      default: "việc cần làm",
    },

    ownerBroad: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Broad",
      required: true,
    },

    ownerCard: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Card",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const List = mongoose.model("List", listSchema);
export default List;
