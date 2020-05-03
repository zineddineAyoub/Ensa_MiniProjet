const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const today=new Date();

const CommentaireSchema=new Schema({
    message:{
        type:String
    },
    document:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Document'
    },
    etudiant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Etudiant'
    },
    prof:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Prof'
    },
    postDate:{
        type:String,
        default:today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear()
    }
});

const Commentaire=mongoose.model('Commentaire',CommentaireSchema);

module.exports=Commentaire;