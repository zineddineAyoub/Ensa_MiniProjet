const mongoose = require('mongoose')

const Notification = new mongoose.Schema({

   sender : {
    type: String
   },

   receiver1 : {
    type: String
     },

   receiver2 : {
       type:String
      
   },
   
   content : {
       type : String  
   },

   read:{
       type:Boolean
   },
   
   date : {
       type: Date, 
       default: Date.now 
   }

  })
  
  module.exports = mongoose.model('Notification', Notification)