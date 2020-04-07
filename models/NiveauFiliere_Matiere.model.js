const mongoose = require('mongoose')

const NiveauFiliere_Matiere = new mongoose.Schema({
   
   matiere: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Matiere'},

    niveauFiliere: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'NiveauFiliere'}

    
  })
  
  module.exports = mongoose.model('NiveauFiliere_Matiere',NiveauFiliere_Matiere )