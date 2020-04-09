const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const AdminSchema=new Schema({
    username:{
        type:String
    },
    password:{
        type:String
    },
    type:{
        type:String,
        default:'admin'
    }
});

const Admin=mongoose.model('Admin',AdminSchema);

module.exports=Admin;