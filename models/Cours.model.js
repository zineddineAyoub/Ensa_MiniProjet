const mongoose = require('mongoose')

const Cours = new mongoose.Schema({
    Nom: {
      type: String
    },

   Fichier : {
    type: String
   },


    matiere: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Matiere'}

    
  })
  
  module.exports = mongoose.model('Cours', Cours)
