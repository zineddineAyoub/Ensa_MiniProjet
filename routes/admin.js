const express=require('express');
//import models
const Admin=require('../models/Admin.model');
const Etudiant=require('../models/Etudiant.model');
const Prof=require('../models/Prof.model');
//const Element=require('../models/Element.model');
const Matiere = require('../models/Matiere.model');
const NiveauFiliere_Matiere=require('../models/NiveauFiliere_Matiere.model');
const NiveauFiliere = require('../models/NiveauFiliere.model');
//const Mod = require('../models/Module.model');
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

router.route('/').get((req,res)=>{
    res.send("Admin Route");
})

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
router.route('/etudiant/:cne').get((req,res)=>{
    Etudiant.findOne({cne:req.params.cne})
    .then(user=>{
        res.json(user);
    }).catch(err=>{
        res.status(400).json(err);
    });
});

//Modifier Etudiant
// On passe le niveau et filiere avec les parametres
router.route('/ModifierEtudiant/:cne').put((req,res)=>{
    const {nom,prenom,cne,cin,email,password,filiere,niveau}=req.body;
     NiveauFiliere.findOne({niveau:niveau,filiere:filiere})
    .then(filiere=>{
        console.log(filiere);
        Etudiant.findOne({cne:req.params.cne})
        .then(user=>{
            user.nom =nom,
            user.prenom = prenom,
            user.cne = cne,
            user.cin= cin,
            user.email = email,
            user.password = password,
            user.niveauFiliere = filiere._id;
            user.save();
    
            res.json(user);
    
        }).catch(err=>{
            res.status(400).json(err);
        });
    }).catch(err=>{
        res.status(400).json(err);
    });
   
});

//get prof
router.route('/prof/:cin').get( (req,res)=>{
   Prof.findOne({cin:req.params.cin})
    .then(user=>{
        res.json(user);
    }).catch(err=>{
        res.status(400).json(err);
    });   
});

//Modifier Prof
router.route('/ModifierProf/:cin').put((req,res)=>{
    const {nom,prenom,cin,email,password}=req.body;
    Prof.findOne({cin:req.params.cin})
    .then(user=>{
        user.nom =nom,
        user.prenom = prenom,
        user.cin= cin,
        user.email = email,
        user.password = password;
        user.save();

        res.json(user);

    }).catch(err=>{
        res.status(400).json(err);
    });
});

// !!!!!!!!!! SHOULD BE MODIFIED
//ajouter etudiant manuelement
router.route('/addOneEtudiant').post((req,res)=>{
    const {nom,prenom,cin,cne,email,niveau,filiere}=req.body;
    NiveauFiliere.findOne({niveau:req.body.niveau,filiere:req.body.filiere}).then(niveauFiliere=>{
        let transporter = mailConf('zineddine.ayoub98@gmail.com','ayoubstar');
   
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
        password,
        niveauFiliere:niveauFiliere._id
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
    })

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





//ajouter Matiere manuelement
router.route('/ajoutOneMatiere').post((req,res)=>{
    if(req.body.filiere)
    {
        var shit = {niveau:req.body.niveau,filiere:req.body.filiere};
    }
    
    else{
        var shit = {niveau:req.body.niveau};
    }
    NiveauFiliere.findOne(shit)
    .then(niveaufiliere=>{
        Prof.findOne({nom : req.body.prof}).then(prof=>{
            var newMatiere=new Matiere({
                nom : req.body.nom,
                prof:prof._id
            });
    
            newMatiere.save((err)=>{
                if(err) throw err;
                console.log("greate");
                
               var newFiliereMatiere=new NiveauFiliere_Matiere({
                    matiere:newMatiere._id,
                    niveauFiliere:niveaufiliere._id
                });
                newFiliereMatiere.save();
                res.send("insrted");
            });
        })
    })

   
    
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

// -------------------- MATIERE -------------------------
//ajouter Matiere CSV
router.route('/ajouterMatiereCSV').post((req,res)=>{

    if(req.body.filiere)
    {
        var shit = {niveau:req.body.niveau,filiere:req.body.filiere};
    }
    
    else{
        var shit = {niveau:req.body.niveau};
    }

    const busboy = new BusBoy({ headers: req.headers });  
    
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {      
     file
      .pipe(csv())
      .on('data', (data) =>
      {
          console.log(data);
        NiveauFiliere.findOne(shit)
       .then((niveaufiliere)=>{

        Prof.findOne({nom : data.prof})
        .then((prof)=>{

            var newMatiere=new Matiere({
                nom:data.nom,
                prof:prof._id,
            });
            newMatiere.save((err)=>{
                if(err) throw err;
                console.log("greate");
                
               var newFiliereMatiere=new NiveauFiliere_Matiere({
                    matiere:newMatiere._id,
                    niveauFiliere:niveaufiliere._id
                });
                newFiliereMatiere.save();
            });
            
        });
     })
           });
          
        
      })
      .on('end', () => {
        res.send("all data inserterd");
       
      });
      req.pipe(busboy);

    });
   
 
  
// DELETE ALL MATIERES
router.delete('/deleteMatieres', async (req, res) => {
    Matiere.deleteMany({}).then(
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
  
// Getting all
router.get('/NiveauFiliere_Matiere', async (req, res) => {
    try {
      const matiere = await NiveauFiliere_Matiere.find().populate('matiere','nom -_id').populate('niveauFiliere');
      res.json(matiere)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
   
  })
  
  
  // Getting all
  router.get('/matiere', async (req, res) => {
    try {
      const matiere = await Matiere.find();
      res.json(matiere)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
   
  })

module.exports=router;