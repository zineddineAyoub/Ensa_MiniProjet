const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const ProfSchema=new Schema({
    nom:{
        type:String
    },
    prenom:{
        type:String
    },
    cin:{
        type:String
    },
    email:{
        type:String
    },
    image:{
        type:String
    },
    password:{
        type:String
    },
    type:{
        type:String,
        default:'prof'
    }
});

const Prof=mongoose.model('Prof',ProfSchema);

module.exports=Prof;