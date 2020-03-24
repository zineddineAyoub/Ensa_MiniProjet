const mongoose = require('mongoose')

const Cours = new mongoose.Schema({
    Nom: {
      type: String
    },

   Fichier : {
    type: String
   },


    element: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Element'}

    
  })
  
  module.exports = mongoose.model('Cours', Cours)