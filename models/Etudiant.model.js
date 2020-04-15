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
        type:String
    },
    niveauFiliere:{
        type:Schema.Types.ObjectId, 
        ref:'NiveauFiliere'
    }
});

const Etudiant=mongoose.model('Etudiant',EtudiantSchema);

module.exports=Etudiant;