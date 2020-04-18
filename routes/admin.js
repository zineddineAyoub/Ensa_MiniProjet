const express=require('express');
//import models
const Admin=require('../models/Admin.model');
const Etudiant=require('../models/Etudiant.model');
const Prof=require('../models/Prof.model');
const Emploie=require('../models/Emploie.model');
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
const path=require('path');

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
        return res.status(400).json({msg:'Enter Al fields'});
    }
    Admin.findOne({username})
    .then(user=>{
        if(!user || user.password!==password){
            return res.status(400).json({msg:'False Credentials'});
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
                            username:user.username,
                            type:user.type
                        }
                    })
                }
            )
        }
    })
});



const deleteStudents=(niveauFiliere)=>{
    return new Promise((resolve,reject)=>{
        Etudiant.deleteMany({niveauFiliere})
        .then(()=>{
            resolve();
        }).catch(err=>{
            reject();
        })
    });
} 

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
    let fileName;
    let niveauFiliere;
    busboy.on('field',(fieldname, val) =>{
        formData.set(fieldname, val);
    });

    busboy.on('file', async(fieldname, file, filename, encoding, mimetype) => {
    niveauFiliere=formData.get("niveauFiliere");
    if(niveauFiliere==="erreur"){
        return res.status(400).json({msg:'Enter all fields'});
    }
     if(mimetype!=="application/vnd.ms-excel"){
        return res.status(400).json({msg:"Enter a excel file!"});
     }    
     fileName=filename; 
     if(file){
        try{
            await deleteStudents(niveaufiliere);
        }
        catch(err){
            return res.status(400).json({msg:'Error'});
        }
     } 
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
      
         const etudiant = new Etudiant({
            nom:data.nom,
            prenom:data.prenom,
            cne:data.cne,
            cin:data.cin,
            email:data.email,
            password:password,
            niveauFiliere
            
          })
          console.log("done");
          
         etudiant.save();   
        
      })
      .on('end', () => {
        res.json({msg:'success'});
       
      });

    });

    busboy.on("finish",()=>{
        niveauFiliere=formData.get("niveauFiliere");
        if(!niveauFiliere || !fileName){
            return res.status(400).json({msg:'Enter all fields!'})
        }
    });
   
    req.pipe(busboy);

});


const deleteAllMatieres=()=>{
    return new Promise((resolve,reject)=>{
        Matiere.deleteMany()
        .then(()=>{
            NiveauFiliere_Matiere.deleteMany()
            .then(()=>{
                resolve();
            })
        }).catch(err=>{
            reject();
        })
    })
}
const deleteAllProfs=()=>{
    return new Promise((resolve,reject)=>{
        Prof.deleteMany()
        .then(async()=>{
            try{
                await deleteAllMatieres();
            }
            catch(err){
                reject();
            }
        }).catch((err)=>{
            reject();
        })
    });
}

//ajouter profs
router.route('/ajouterProf').post(async (req,res)=>{
    let transporter = mailConf('tarik.ouhamou@gmail.com','dragonballz123+');

    const busboy = new BusBoy({ headers: req.headers });
    let fileName;
    busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
     if(mimetype!=="application/vnd.ms-excel"){
         return res.status(400).json({msg:"Enter a excel file!"});
     }
     fileName=filename;
     if(file){
        try{
            await deleteAllProfs();
        }
        catch(err){
            return res.status(400).json({msg:'Error'});
        }
     }
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
        res.json({msg:'success'});
       
      });

    });

    busboy.on('finish',()=>{
        if(!fileName){
            return res.status(400).json({msg:'Enter all fields!'});
        }
    })
   
    req.pipe(busboy);
});


//delete student
router.route('/deleteEtudiant/:id').delete((req,res)=>{
    const _id=req.params.id;
    Etudiant.findByIdAndRemove({_id},(err,user)=>{
        if(err) throw err;
        res.json(user);
    });
});



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
router.route('/getEtudiant/:cne').get((req,res)=>{
    Etudiant.findOne({cne:req.params.cne}).populate('niveauFiliere')
    .then(user=>{
        if(!user){
            return res.status(400).json({msg:"Etudiant n'existe pas!"})
        }
        return res.json({msg:'success',user});
    }).catch(err=>{
        res.status(400).json({msg:"Etudiant n'existe pas!"});
    });
});
//get prof
router.route('/getProf/:cin').get((req,res)=>{
    Prof.findOne({cin:req.params.cin})
    .then(user=>{
        if(!user){
            return res.status(400).json({msg:"Professeur n'existe pas!"})
        }
        return res.json({msg:'success',user});
    }).catch(err=>{
        res.status(400).json({msg:"Professeur n'existe pas!"});
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
    const {nom,prenom,cin,cne,email,niveauFiliere}=req.body;
    if(!nom || !prenom || !cin || !cne || !email){
        return res.status(400).json({msg:'Enter all fields'});
    }
    let transporter = mailConf('tarik.ouhamou@gmail.com','dragonballz123+');
   
    const password = generator.generate({
        length: 6,
        numbers: true
    });
    let newEtudiant=new Etudiant({
        nom,
        prenom,
        cne,
        cin,
        email,
        password,
        niveauFiliere
    });
    newEtudiant.save();
    let mailOptions = {
        // should be replaced with real recipient's account
      //  from: 'zineddine.ayoub98@gmail.com',
        to: email,
        subject: "Site Officiel Ensa",
        text: 'Login : '+email+'\n Password : '+password
    };

   transporter.sendMail(mailOptions);
   return res.json({msg:'success'}); 

});


//ajouter prof manuelement
router.route('/addOneProf').post((req,res)=>{
    let transporter = mailConf('zineddine.ayoub98@gmail.com','ayoubstar');
    const {nom,prenom,cin,email}=req.body;
    if(!nom || !prenom || !cin || !email){
        return res.status(400).json({msg:'Enter all fields'});
    }
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
    return res.json({msg:'success'});
});





//ajouter Matiere manuelement
router.route('/ajoutOneMatiere').post((req,res)=>{
    const {nom,niveauFiliere,prof}=req.body;
    if(!nom || niveauFiliere.length==0 || !prof){
        return res.status(400).json({msg:'Enter all fields!'});
    }
    let newMatiere=new Matiere({
        nom,
        prof
    });
    
    newMatiere.save((err)=>{
        if(err) throw err;
        niveauFiliere.forEach(val => {
            console.log(val)
            let newFiliereMatiere=new NiveauFiliere_Matiere({
                matiere:newMatiere._id,
                niveauFiliere:val
            });
            newFiliereMatiere.save(); 
        });
        res.json({msg:'success'});
    });
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
    
// DELETE ALL MATIERES
router.delete('/deleteMatieres', async (req, res) => {
    Matiere.deleteMany({}).then(
      () => {
        res.status(200).json({
          msg: 'success'
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
      res.status(500).json({ msg: err.message })
    }
   
  });

  //add Emploie
router.route('/addEmploie').post((req,res)=>{
    //manage and save file in folder
    //database
    const busboy = new BusBoy({ headers: req.headers });
    let formData = new Map();
    let nameFile;
    busboy.on('field',(fieldname, val) =>{
        formData.set(fieldname, val);
    });
    busboy.on('file',(fieldname, file, filename, encoding, mimetype)=>{
        nameFile=filename;
        let appDir = path.dirname(require.main.filename);
        let path2 = appDir.replace(/\\/g, "/");
        let filepath = path.join(path2, `/emploie/${filename}`);
        file.pipe(fs.createWriteStream(filepath));
    });
    busboy.on('finish',()=>{
        let semestre=formData.get("semestre");
        let niveauFiliere=formData.get("niveauFiliere");
        let type=formData.get("type");
        if(!semestre || !niveauFiliere || !type || !nameFile){
            return res.status(400).json({msg:'Enter all fields'});
        }
        const emploie=new Emploie({
            semestre,
            image:nameFile,
            type,
            niveauFiliere 
        });
        emploie.save();
        res.json({msg:'success'});
    });
    req.pipe(busboy);
});


//getNiveauFiliereById
router.route('/getNiveauFiliere/:id').get((req,res)=>{
    const _id=req.params.id;
    NiveauFiliere.findById({_id})
    .then(doc=>{
        res.json(doc);
    });
})

//get students selon niveau
router.route('/getEtudiantByNiveau/:id').get((req,res)=>{
    const niveauFiliere=req.params.id;
    if(!niveauFiliere){
        return res.json({users:[]});
    }
    Etudiant.find({niveauFiliere}).populate('niveauFiliere')
    .then(users=>{
        return res.json({users,msg:'success'})
    }).catch(err=>{
        return res.json({msg:err});
    })
})

//getAll prof
router.route('/allProf').get((req,res)=>{
    Prof.find()
    .then(users=>{
        res.json(users);
    }).catch(err=>{
        res.status(400).json({msg:err});
    })
});

//get all niveaufiliere
router.route('/getNiveauFiliere').get((req,res)=>{
    NiveauFiliere.find()
    .then(docs=>{
        res.json(docs);
    }).catch(err=>{
        res.status(400).json({msg:err});
    });
});

// -------------------- MATIERE -------------------------
//ajouter Matiere CSV
router.route('/ajouterMatiereCSV').post((req,res)=>{

    const busboy = new BusBoy({ headers: req.headers });  
    let fileName;
    busboy.on('file',async (fieldname, file, filename, encoding, mimetype) => {   
     if(mimetype!=="application/vnd.ms-excel"){
        return res.status(400).json({msg:"Enter a excel file!"});
     }   
     fileName=filename;
     if(file){
         try{
            await deleteAllMatieres();
         }
         catch(err){
            return res.status(400).json({msg:'Erreur'});
         }
     }
     file
      .pipe(csv())
      .on('data', (data) =>
      {
          if(data.filiere)
          {
              var nf = {niveau:data.niveau,filiere:data.filiere}
          }
          else{
              var nf = {niveau:data.niveau}
          }
          console.log(data);
        NiveauFiliere.findOne(nf)
       .then((niveaufiliere)=>{

        Prof.findOne({nom : data.prof})
        .then((prof)=>{

            var newMatiere=new Matiere({
                nom:data.nom,
                prof:prof._id,
            });
            newMatiere.save((err)=>{
                if(err) throw err;
                
               var newFiliereMatiere=new NiveauFiliere_Matiere({
                    matiere:newMatiere._id,
                    niveauFiliere:niveaufiliere._id
                });
                newFiliereMatiere.save();
                if(data.filiere2)
                {
                    NiveauFiliere.findOne({niveau:data.niveau,filiere:data.filiere2}).then(
                       (niveaufiliere2)=>{
                        var newFiliereMatiere2=new NiveauFiliere_Matiere({
                            matiere:newMatiere._id,
                            niveauFiliere:niveaufiliere2.id
                        });
                        newFiliereMatiere2.save();
                       }
                    )

                    if(data.filiere3)
                    {
                        NiveauFiliere.findOne({niveau:data.niveau,filiere:data.filiere3}).then(
                            (niveaufiliere3)=>{
                             var newFiliereMatiere3=new NiveauFiliere_Matiere({
                                 matiere:newMatiere._id,
                                 niveauFiliere:niveaufiliere3.id
                             });
                             newFiliereMatiere3.save();
                            }
                         )
                        
                         if(data.filiere4)
                         {
                            NiveauFiliere.findOne({niveau:data.niveau,filiere:data.filiere4}).then(
                                (niveaufiliere4)=>{
                                 var newFiliereMatiere4=new NiveauFiliere_Matiere({
                                     matiere:newMatiere._id,
                                     niveauFiliere:niveaufiliere4.id
                                 });
                                 newFiliereMatiere4.save();
                                }
                             )
                         }

                    }
                }
            });   
        }).then(console.log('finish'));
     })
           });
          
        
      })
      .on('end', () => {
        console.log("all data inserterd");
       
      });

      busboy.on('finish',()=>{
          if(!fileName){
              return res.status(400).json({msg:'Enter all fields!'});
          }
          return res.json({msg:'success'});
      })
      req.pipe(busboy);

});

//get Prof by niveauFiliere
router.route('/getProfByNiveau/:id').get((req,res)=>{
    const niveauFiliere=req.params.id;
    let profs=[];
    NiveauFiliere_Matiere.find({niveauFiliere}).populate('niveauFiliere')
    .populate([{path:'matiere',populate:{path:'prof'}}])
    .then(docs=>{
        if(!docs){
            return res.status(400).json({msg:'error'});
        }
        res.json({users:docs,msg:'success'});
    });
});

//get matiere by niveau filiere
router.route('/getMatiere/:id').get((req,res)=>{
    const niveauFiliere=req.params.id;
    NiveauFiliere_Matiere.find({niveauFiliere})
    .populate([{path:'matiere',populate:{path:'prof'}}]).populate('niveauFiliere')
    .then(docs=>{
        if(!docs){
            return res.status(400).json({msg:'erreur'});
        }
        return res.json(docs);
    });
});

//delete one matiere
router.route('/deleteMatiere/:id').delete((req,res)=>{
    const _id=req.params.id;
    Matiere.findByIdAndRemove({_id},(err,doc)=>{
        if(err) throw err
        NiveauFiliere_Matiere.deleteMany({matiere:_id},(err,docs)=>{
            if(err) throw err;
            res.json(doc);
        });
    });
});

const getDoc=(_id)=>{
    return new Promise((resolve,reject)=>{
        Matiere.find({prof:_id})
        .then(doc=>{
            resolve(doc)
        })
    })
}

//test
router.route('/deleteOneProf/:id').delete(async(req,res)=>{
    const _id=req.params.id;
    Prof.findByIdAndRemove(_id)
        .then(async(prof)=>{
            try{
                const doc=await getDoc(req.params.id);
                doc.forEach(docs=>{
                    Matiere.findByIdAndRemove(docs._id)
                    .then(()=>{
                        NiveauFiliere_Matiere.deleteMany({matiere:docs._id})
                        .then(()=>{
                            res.json(prof);
                        })
                    })
                }) 
            }
            catch(err){
                res.status(400).json({msg:'error'})
            }
        });  
})


module.exports=router;