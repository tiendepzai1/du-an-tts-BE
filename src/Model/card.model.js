import mongoose from "mongoose";
const CardSchema = new mongoose.Schema({
    cardName : {
        type : String,
        required : true
    },
    description : {
        type : String,
        default : ""
    },
    duaDate : {
       type : Date
    },
    position : {
        type : Number,
        default : 0,
    },
    status : {
        type : Boolean,
        default : false
    },
    CreateUserList : {
        type : mongoose.Schema.ObjectId,
        ref : "User",
        require : true
    },
    member : {
        type : mongoose.Schema.ObjectId,
        ref: "User",
    }
})