const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const FeedBackSchema=new Schema({
    email:{
        type:String
    },
    description:{
        type:String
    }
});

const FeedBack=mongoose.model('FeedBack',FeedBackSchema);

module.exports=FeedBack;