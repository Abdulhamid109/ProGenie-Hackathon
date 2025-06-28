import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"Please Enter your Name"]
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    accountverification:{
        type:Boolean,
        default:false
    },
    OTP:{
        type:String
    }
});

const user = mongoose.models.User || mongoose.model("User", userSchema);

export default user;