const mongoose = require('mongoose')

const Document = new mongoose.Schema({
    nom: {
      type: String
    },

    type: {
      type: String
    },

   fichier : {
    type: String
   },


    matiere: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Matiere'}

    
  })
  
  module.exports = mongoose.model('Document', Document)
