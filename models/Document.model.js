const mongoose = require('mongoose')

const Document = new mongoose.Schema({
    Nom: {
      type: String
    },

    Type: {
      type: String
    },

   Fichier : {
    type: String
   },


    matiere: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Matiere'}
  })
  
  module.exports = mongoose.model('Document', Document)
