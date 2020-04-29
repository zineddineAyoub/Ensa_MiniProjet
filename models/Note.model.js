const mongoose = require('mongoose')

const Note = new mongoose.Schema({
    note: {
      type: Number
    },
    
   matiere: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Matiere'},

    semestre:{
      type:Number,
    },

    etudiant: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Etudiant'}  
  })
  
  module.exports = mongoose.model('Note', Note)
