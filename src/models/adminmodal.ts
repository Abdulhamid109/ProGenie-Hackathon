import mongoose from 'mongoose';

const adminModal = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
})

const Admin = mongoose.models.admin || mongoose.model('admin',adminModal);
export default Admin;