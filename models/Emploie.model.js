const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const EmploieSchema=new Schema({
   
    semestre:{
        type:String
    },

    image:{
        type:String
    },

    type:{
        type:String
    },

    niveauFiliere:{
        type:Schema.Types.ObjectId,
        ref:'NiveauFiliere'
    }
});

const Emploie=mongoose.model('Emploie',EmploieSchema);

module.exports=Emploie;