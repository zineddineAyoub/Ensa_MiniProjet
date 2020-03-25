const express=require('express');
const Etudiant=require('../models/Etudiant.model');
const jwt=require('jsonwebtoken');
const auth=require('../middleware/auth');

const router=express.Router();

router.route('/').get((req,res)=>{

});

router.route('/login').post((req,res)=>{
    const {cne,cin,password}=req.body;
    if(!cin || !password){
        res.status(400).json({msg:'Enter Al fields'});
    }
    Admin.findOne({cin})
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
    Admin.findById(req.user.id)
    .then(user=>{
        res.json(user);
    })
});

module.exports=router;