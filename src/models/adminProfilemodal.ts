// profile related information of admin
import mongoose from "mongoose";


const adminprofile = new mongoose.Schema({
    adminID:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    jobcreated:{
        type:[String],
    },
    jobShortlisted:{
        type:[String],
    },
    Notification:{
        type:Boolean,
        default:false
    },
    
});

const adminProfile = mongoose.models.AdminProfile || mongoose.model('AdminProfile',adminprofile);
export default adminProfile;