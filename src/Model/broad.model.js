import mongoose from "mongoose";

const BroadSchema = new mongoose.Schema({
    broadName : {
        type : String,
        required : true,
        unique : true
        
    },
    description : {
        type : String,
        default : ""
    },
    owner : {
       type : mongoose.Schema.Types.ObjectId,
       ref:"User"
    }
},{versionKey : false,timestamps : true})

const Broad = mongoose.model("Broad", BroadSchema);
export default Broad;