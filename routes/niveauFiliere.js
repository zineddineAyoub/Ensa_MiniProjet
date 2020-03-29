const express = require('express')
const router = express.Router()
const NiveauFiliere = require('../models/NiveauFiliere.model')


// Getting all
router.get('/', async (req, res) => {
  try {
    const niveauFiliere= await NiveauFiliere.find()
    res.json(niveauFiliere)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
 
})

router.route('/ajouter').post((req,res)=>{
    const {filiere,niveau}=req.body;
    let newNiveauFiliere=new NiveauFiliere({
        filiere,
        niveau
    });
   const result =  newNiveauFiliere.save();
   res.json(result);
});





module.exports=router;

