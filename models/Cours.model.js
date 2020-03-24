const mongoose = require('mongoose')

const Cours = new mongoose.Schema({
    Nom: {
      type: String,
      required: true
    },

   Fichier : {
    type: String,
    required: false
   },


    element: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Element'}

    
  })
  
  module.exports = mongoose.model('Cours', Cours)