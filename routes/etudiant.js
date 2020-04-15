const express = require('express')
const router = express.Router()
const Etudiant = require('../models/Etudiant.model')
const niveauFiliereMatiere= require("../models/NiveauFiliere_Matiere.model")
const Emploie= require("../models/Emploie.model")
const Note = require("../models/Note.model")

const jwt=require('jsonwebtoken');
const auth=require('../middleware/auth');

// Getting all
router.get('/', async (req, res) => {
  try {
    const etudiants= await Etudiant.find().populate('niveauFiliere');
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

//Login 
router.route('/login').post((req,res)=>{
    const {cne,cin,password}=req.body;
    if(!cne || !cin || !password){
      console.log(req.body);
      res.status(400).json({msg:'Enter Al fields'});
    }
    Etudiant.findOne({cne})
    .then(user=>{
        if(!user || user.cin!==cin || user.password!==password){
            res.status.json({msg:'False Credentials'});
        }
        if(user.cin==cin && user.password==password){
            jwt.sign(
                {id:user._id},
                'secret',
                {expiresIn:36000},
                (err,token)=>{
                    if(err) throw err;
                    res.json({
                        token,
                        user:{
                            nom:user.nom,
                            prenom:user.prenom,
                            cne:user.cne,
                            cin:user.cin,
                            email:user.email,
                            image:user.image,
                            niveauFiliere:user.niveauFiliere
                        }
                    })
                }
            )
        }
    }).catch(err=>{
      return res.status(400).json({msg:'False Credential'})
    })
});

//find Etudiant By Id 
router.get('/user',auth,(req,res)=>{
    Etudiant.findById(req.user.id)
    .then(user=>{
        res.json(user);
    })
});

//Voir le Profil et voir les Td  et cours 
router.get("/:id",async (req,res)=>{
  try{
    const etudiants= await Etudiant.findById(req.params.id).populate("niveauFiliere");
   const maat = await niveauFiliereMatiere.find({niveauFiliere:{$gte:etudiants.niveauFiliere._id}} )
    res.json(etudiants)

  }catch(err){
    res.json({message : err.message})
  }
});

 //Modifier le profill
 router.put('/:id',async(req,res)=>{
  try{
    const updateEtudiant = await Etudiant.updateOne(
      { _id : req.params.id},
      { $set : { nom : req.body.nom, prenom:req.body.prenom , email:req.body.email,image:req.body.image ,password :req.body.password }}
    );
    res.json(updateEtudiant);
  }catch(err){
    res.json({message:err.message})
  }
});
//voir les cours /td
router.get("/Cours/:id",async (req,res)=>{
  try{
  const etudiants= await Etudiant.findById(req.params.id).populate("niveauFiliere");
  const matiere = await niveauFiliereMatiere.find({niveauFiliere:{$gte:etudiants.niveauFiliere._id}}).populate("matiere").populate("niveauFiliere")
  res.json(matiere)

  }catch(err){
    res.json({message : err.message})
  }
});

//voir L Emploi 
router.get("/Emploie/:id",async (req,res)=>{
  try{
  const etudiants= await Etudiant.findById(req.params.id).populate("niveauFiliere");
  const emploie = await Emploie.find({niveauFiliere:{$gte:etudiants.niveauFiliere._id}}).populate("niveauFiliere")
  res.json(emploie)

  }catch(err){
    res.json({message : err.message})
  }
});
router.get("/Note/:id",async (req,res)=>{
  try{
  const note = await Note.find({etudiant:{$gte:req.params.id}}).populate("matiere")
  res.json(note)

  }catch(err){
    res.json({message : err.message})
  }
});

module.exports=router;

