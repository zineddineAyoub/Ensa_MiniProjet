const mongoose = require('mongoose')

const Note = new mongoose.Schema({
    note: {
      type: Number
    },
    
   element: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Element'},

    etudiant: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Etudiant'}

    
  })
  
  module.exports = mongoose.model('Note', Note)