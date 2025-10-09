import mongoose from "mongoose";
const listSchema = new mongoose.Schema({
    listName : {
        type : String,
        require : true,
        unique : true,
    },
    owner : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Card"
    }
},{
    timestamps : true,
    versionKey : false
})