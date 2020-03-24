const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const ElementSchema=new Schema({
    nom:{
        type:String
    },
    prof:{
        type:Schema.Types.ObjectId,
        ref:'Prof'
    },
    module:{
        type:Schema.Types.ObjectId,
        ref:'Module'
    }
});

const Element=mongoose.model('Element',ElementSchema);

module.exports=Element;