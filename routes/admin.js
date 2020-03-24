const express=require('express');
const Admin=require('../models/Admin.model');

const router=express.Router();

router.route('/').get((req,res)=>{

});

route.route('/login').post((req,res)=>{
    const {username,password}=req.body;
    if(!username || !password){
        res.status(400).json({msg:'Enter Al fields'});
    }
    Admin.findOne({username})
    .then(user=>{
        if(!user){
            res.status.json({msg:'False Credentials'});
        }

    })
});

module.exports=router;