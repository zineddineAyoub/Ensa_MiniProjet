const mongoose = require('mongoose')

const NiveauFiliere = new mongoose.Schema({
    filiere: {
      type: String
    },

    niveau: {
      type:String
    }
    
  })
  
  module.exports = mongoose.model('NiveauFiliere', NiveauFiliere)