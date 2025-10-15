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
    ownerList : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "List"
    }],
 
    memberUser : [{
        type : mongoose.Schema.ObjectId,
        ref: "User",
    }]
})
const Card = mongoose.model('Card',CardSchema);
export default Card;