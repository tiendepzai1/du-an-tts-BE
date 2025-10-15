import mongoose from 'mongoose';
 const  UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email :{
        type : String,
        require : true,
        unique :true
    },
    password: {
        type: String,
        required: true  
    },
    owner : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Broad"
    }]
   
},{timestamps : true,
    versionKey : false
});

const User = mongoose.model('User', UserSchema);

export default User;
