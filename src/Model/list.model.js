import mongoose from "mongoose";

const listSchema = new mongoose.Schema({
    listName : {
        type : String,
        required : true,
    },
       
    ownerBroad : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Broad"
    },
    ownerCard : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Card"
    }]
},{
    timestamps : true,
    versionKey : false
})

const List = mongoose.model('List',listSchema);
export default List;