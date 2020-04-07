const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const MatiereSchema=new Schema({
    nom:{
        type:String
    },
    prof:{
        type:Schema.Types.ObjectId,
        ref:'Prof'
    }
});

const Matiere=mongoose.model('Matiere',MatiereSchema);

module.exports=Matiere;