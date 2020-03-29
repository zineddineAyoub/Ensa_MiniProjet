const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const EmploieSchema=new Schema({
   
    semestre:{
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

const EmploieSchema=mongoose.model('EmploieSchema',EmploieSchema);

module.exports=EmploieSchema;