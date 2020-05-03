const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const EtudiantSchema=new Schema({
    nom:{
        type:String
    },
    prenom:{
        type:String
    },
    cne:{
        type:String
    },
    cin:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    image:{
        type:String,
        default:'default.jpg'
    },
    niveauFiliere:{
        type:Schema.Types.ObjectId,
        ref:'NiveauFiliere'
    },
    type:{
        type:String,
        default:'etudiant'
    }
});

const Etudiant=mongoose.model('Etudiant',EtudiantSchema);

module.exports=Etudiant;