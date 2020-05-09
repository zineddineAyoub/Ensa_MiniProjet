const mongoose = require('mongoose')
const today=new Date();
const NotificationSchema = new mongoose.Schema({

   senderEtudiant : {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Etudiant'
   },
   senderProf:{
       type:mongoose.Schema.Types.ObjectId,
       ref:'Prof'
   },
   receiver : {
    type: String
    },
   
   content : {
       type : String  
   },

   read:{
       type:Boolean,
       default:false
   },
   
   postDate:{
    type:String,
    default:today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear()
}

  })

  const Notification=mongoose.model('Notification',NotificationSchema);
  
  module.exports = Notification;