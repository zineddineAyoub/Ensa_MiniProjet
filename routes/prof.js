const express = require('express')
const router = express.Router()
const Prof = require('../models/Prof.model')

// Getting all
router.get('/', async (req, res) => {
  try {
    const profs= await Prof.find()
    res.json(profs)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
 
})

// DELETE ALL
router.delete('/', async (req, res) => {
  Prof.deleteMany({}).then(
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
