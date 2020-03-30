const express=require('express');
//import models
const Admin=require('../models/Admin.model');
const Etudiant=require('../models/Etudiant.model');
const Prof=require('../models/Prof.model');
//const Module =require('../models/Module.model');
const Element=require('../models/Element.model');
//const NiveauFiliere_Module=require('../models/NiveauFiliere.model');
const NiveauFiliere = require('../models/NiveauFiliere.model');
//import packages
const csv = require('csv-parser');
const nodeMailer = require('nodemailer');
const fs = require('fs');
const generator = require('generate-password');
const jwt=require('jsonwebtoken');
const auth=require('../middleware/auth');
const BusBoy = require('busboy');

const router=express.Router();



//mail Conf
const mailConf=(user,pass)=>{
    let transporter = nodeMailer.createTransport({
       service:'gmail',
        auth: {
            // should be replaced with real sender's account
            user: user,
            pass: pass
        },tls: {
            rejectUnauthorized: false
        }
    });
    return transporter;
}

//login admin
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



 
// In form-data we send the csv file and key:filiere/value:informatique and key:niveau/value:CI1
// We should send the two keys first then send the file
// Cz the on('field') should fire before on('file')
//ajoueter etudiants
router.route('/ajouterEtudiant').post((req,res)=>{

   // const {niveau,filiere}=req.body;
   //const niveauFiliere = NiveauFiliere.findOne({niveau,filiere});
   
   let formData = new Map();

    let transporter = mailConf('zineddine.ayoub98@gmail.com','ayoubstar');

    const busboy = new BusBoy({ headers: req.headers });
    
    var Id;
    var myId;
    busboy.on('field',(fieldname, val) =>{
        formData.set(fieldname, val);
        
    });

    
    
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {      
     file
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
      

       const Id = NiveauFiliere.findOne({niveau:formData.get('niveau'),filiere:formData.get('filiere')},(err,obj)=>{
        myId = obj._id;
     }).then(()=>{
         const etudiant = new Etudiant({
            nom:data.nom,
            prenom:data.prenom,
            cne:data.cne,
            cin:data.cin,
            email:data.email,
            password:password,
           niveauFiliere:myId
            
          })
          console.log("done");
          
         etudiant.save();   
     });

        
      })
      .on('end', () => {
        res.send("all data inserterd");
       
      });

    });
   
    req.pipe(busboy);

});


//ajouter profs
router.route('/ajouterProf').post((req,res)=>{

  let transporter = mailConf('zineddine.ayoub98@gmail.com','ayoubstar');

    const busboy = new BusBoy({ headers: req.headers });
 
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
   
     file
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
   
    req.pipe(busboy);
});


//delete student
router.route('/deleteEtudiant/:cne').delete((req,res)=>{
    Etudiant.deleteOne({cne:req.params.cne})
    .then(user=>{
        res.json(user);
    }).catch(err=>{
        res.status(400).json(err);
    });
});

//delete prof
router.route('/deleteProf/:cin').delete((req,res)=>{
    Prof.deleteOne({cin:req.params.cin})
    .then(user=>{
        res.json(user);
    }).catch(err=>{
        res.status(400).json(err);
    });
});

//getAll prof
router.route('allProf').get((req,res)=>{
    Prof.find()
    .then(users=>{
        res.json(users);
    }).catch(err=>{
        res.json(err);
    })
})

//getAll etudiant
router.route('allEtudiant').get((req,res)=>{
    Etudiant.find()
    .then(users=>{
        res.json(users);
    }).catch(err=>{
        res.json(err);
    })
})


//get etudiant
router.route('etudiant/:cne').get((req,res)=>{
    Etudiant.findOne({cne:req.params.cne})
    .then(user=>{
        res.json(user);
    }).catch(err=>{
        res.status(400).json(err);
    });
});

//get prof
router.route('prof/:cin').get((req,res)=>{
    Prof.findOne({cin:req.params.cin})
    .then(user=>{
        res.json(user);
    }).catch(err=>{
        res.status(400).json(err);
    });
});

//ajouter etudiant manuelement
router.route('/addOneEtudiant').post((req,res)=>{
    let transporter = mailConf('zineddine.ayoub98@gmail.com','ayoubstar');
    const {nom,prenom,cin,cne,email}=req.body;
    const password = generator.generate({
        length: 6,
        numbers: true
    });
    let newProf=new Prof({
        nom,
        prenom,
        cne,
        cin,
        email,
        password
    });
    newProf.save();
    let mailOptions = {
        // should be replaced with real recipient's account
      //  from: 'zineddine.ayoub98@gmail.com',
        to: email,
        subject: "Site Officiel Ensa",
        text: 'Login : '+email+'\n Password : '+password
    };

   transporter.sendMail(mailOptions); 

});


//ajouter prof manuelement
router.route('/addOneProf').post((req,res)=>{
    let transporter = mailConf('zineddine.ayoub98@gmail.com','ayoubstar');
    const {nom,prenom,cin,email}=req.body;
    const password = generator.generate({
        length: 6,
        numbers: true
    });
    let newProf=new Prof({
        nom,
        prenom,
        cin,
        email,
        password
    });
    newProf.save();
    let mailOptions = {
        // should be replaced with real recipient's account
      //  from: 'zineddine.ayoub98@gmail.com',
        to: email,
        subject: "Site Officiel Ensa",
        text: 'Login : '+email+'\n Password : '+password
    };

    transporter.sendMail(mailOptions); 
});

/*
//get all modules
router.route('allModules').get((req,res)=>{
    Module.find()
    .then(modules=>{
        res.json(modules);
    }).catch(err=>{
        res.json(err);
    })
})*/

//ajouter module manuelement
router.route('/ajoutOneModule').post((req,res)=>{
    const {nom,niveauFiliereId}=req.body;
    let newModule=new Module({
        nom
    });
    newModule.save((err)=>{
        if(err) throw err;
        newFiliereModule=new NiveauFiliere_Module({
            module:newModule._id,
            niveauFiliere:niveauFiliereId
        });
    });
});

//ajouter element manuelement
router.route('/ajoutOneElement').post((req,res)=>{
    const {nom,idProf,idModule}=req.body;
    let newElement=new Element({
        nom,
        prof:idProf,
        module:idModule
    });
    newElement.save();
});

router.get('/user',auth,(req,res)=>{
    Admin.findById(req.user.id)
    .then(user=>{
        res.json(user);
    })
});



router.route('/ajouterNiveauFiliere').post((req,res)=>{
    const {filiere,niveau}=req.body;
    let newNiveauFiliere=new NiveauFiliere({
        filiere,
        niveau
    });
   const result =  newNiveauFiliere.save();
   res.send("nice");
});



module.exports=router;