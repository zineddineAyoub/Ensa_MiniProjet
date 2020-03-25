const express = require('express')
const router = express.Router()
const Etudiant = require('../models/Etudiant.model')

// Getting all
router.get('/', async (req, res) => {
  try {
    const etudiants= await Etudiant.find()
    res.json(etudiants)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
 
});

// DELETE ALL
router.delete('/', async (req, res) => {
  Etudiant.deleteMany({}).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
  });


module.exports=router;
