
const express = require('express')
const router = express.Router()
const Prof = require('../models/Prof.model')
const jwt=require('jsonwebtoken');
const auth=require('../middleware/auth');

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


router.route('/login').post((req,res)=>{
    const {cne,cin,password}=req.body;
    if(!cin || !password){
        res.status(400).json({msg:'Enter Al fields'});
    }
    Prof.findOne({cin})
    .then(user=>{
        if(!user){
            res.status.json({msg:'False Credentials'});
        }
        if(user.password==password){
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
                            cin:user.cin,
                            email:user.email,
                            image:user.image,
                            niveauFiliere:user.niveauFiliere
                        }
                    })
                }
            )
        }
    })
});


router.get('/user',auth,(req,res)=>{
    Prof.findById(req.user.id)
    .then(user=>{
        res.json(user);
    })
});

module.exports=router;

