const mongoose = require('mongoose')

const NiveauFiliere_Module = new mongoose.Schema({
   
   module: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Module'},

    niveauFiliere: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'NiveauFiliere'}

    
  })
  
  module.exports = mongoose.model('NiveauFiliere_Module',NiveauFiliere_Module )