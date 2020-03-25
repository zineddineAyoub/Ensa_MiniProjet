const express=require('express');
const Admin=require('../models/Admin.model');
const Etudiant=require('../models/Etudiant.model');
const Prof=require('../models/Prof.model');
const csv = require('csv-parser');
const nodeMailer = require('nodemailer');
const fs = require('fs');
const generator = require('generate-password');
const jwt=require('jsonwebtoken');
const auth=require('../middleware/auth');


const router=express.Router();

router.route('/').get((req,res)=>{

});

router.route('/login').post((req,res)=>{
    const {username,password}=req.body;
    if(!username || !password){
        res.status(400).json({msg:'Enter Al fields'});
    }
    Admin.findOne({username})
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
                            id:user._id,
                            username:user.username
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

router.route('/ajouterEtudiant').post((req,res)=>{

    const results = [];
    let transporter = nodeMailer.createTransport({
       service:'gmail',
        auth: {
            // should be replaced with real sender's account
            user: 'zineddine.ayoub98@gmail.com',
            pass: 'ayoubstar'
        },tls: {
            rejectUnauthorized: false
        }
    });

 

    fs.createReadStream('./Files/Etudiants1.csv')
      .pipe(csv())
      .on('data', (data) =>
      {
        var password = generator.generate({
            length: 6,
            numbers: true
        });

        let mailOptions = {
            // should be replaced with real recipient's account
          //  from: 'zineddine.ayoub98@gmail.com',
            to: data.email,
            subject: "Site Officiel Ensa",
            text: 'Login : '+data.email+'\n Password : '+password
        };

       transporter.sendMail(mailOptions);

        const etudiant = new Etudiant({
            
            nom:data.nom,
            prenom:data.prenom,
            cne:data.cne,
            cin:data.cin,
            email:data.email,
            password:password
          })
         etudiant.save();    
      })
      .on('end', () => {
        res.send("all data inserterd");
       
      });
});



router.route('/ajouterProf').post((req,res)=>{

    let transporter = nodeMailer.createTransport({
        service:'gmail',
         auth: {
             // should be replaced with real sender's account
             user: 'zineddine.ayoub98@gmail.com',
             pass: 'ayoubstar'
         },tls: {
             rejectUnauthorized: false
         }
     });
 
     fs.createReadStream('./Files/Etudiants1.csv')
       .pipe(csv())
       .on('data', (data) =>
       {
         var password = generator.generate({
             length: 6,
             numbers: true
         });
 
         let mailOptions = {
             // should be replaced with real recipient's account
           //  from: 'zineddine.ayoub98@gmail.com',
             to: data.email,
             subject: "Site Officiel Ensa",
             text: 'Login : '+data.email+'\n Password : '+password
         };
 
        transporter.sendMail(mailOptions); 
 
         const prof = new Prof({
             
             nom:data.nom,
             prenom:data.prenom,
             cin:data.cin,
             email:data.email,
             password:password
           })
          prof.save();    
       })
       .on('end', () => {
         res.send("all data inserterd");
        
       });
});

module.exports=router;