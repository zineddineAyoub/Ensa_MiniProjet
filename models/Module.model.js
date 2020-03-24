const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const ModuleSchema=new Schema({
    nom:{
        type:String
    }
});

const Module=mongoose.Schema('Module',ModuleSchema);

module.exports=Module;