const mongoose = require('mongoose')

const NiveauFiliere = new mongoose.Schema({
    filiere: {
      type: String,
      required: true
    },

    niveau: {
      type:String,
      required:true
    }
    
  })
  
  module.exports = mongoose.model('NiveauFiliere', NiveauFiliere)