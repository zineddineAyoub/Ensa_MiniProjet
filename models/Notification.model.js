const mongoose = require('mongoose')

const Notification = new mongoose.Schema({

   sender : {
    type: String,
     required: true
   },

   receiver1 : {
    type: String,
     required: true
   },

   receiver2 : {
       type:String,
       required:false
   },
   
   content : {
       type : String,
       required : true
   },

   date : {
       required : false ,
       type: Date, 
       default: Date.now 
   }

  })
  
  module.exports = mongoose.model('Notification', Notification)