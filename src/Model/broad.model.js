import mongoose from "mongoose";

const BroadSchema = new mongoose.Schema({
    broadName : {
        type : String,
        require : true,
        unique : true
        
    },
    description : {
        type : String,
        default : ""
    },
    owner : {
       type : mongoose.Schema.Types.ObjectId,
       ref:"List"
    }
},{versionKey : false,timestamps : true})

const Broad = mongoose.model("Broad", BroadSchema);
export default Broad;