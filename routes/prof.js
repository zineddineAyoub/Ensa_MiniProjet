const express = require('express')
const router = express.Router()
const Prof = require('../models/Prof.model')
const Etudiant = require('../models/Etudiant.model')
const Note = require('../models/Note.model')
const Matiere = require('../models/Matiere.model')
const Document = require('../models/Document.model')
const jwt=require('jsonwebtoken');
const auth=require('../middleware/auth');
const BusBoy = require('busboy');
const path = require('path');
const fs = require('fs');
const nodeMailer = require('nodemailer');
ObjectId = require('mongodb').ObjectID;



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
    const {email,cin,password}=req.body;
    if(!email || !cin || !password){
        res.status(400).json({msg:'Enter Al fields'});
    }
    Prof.findOne({cin})
    .then(user=>{
        if(!user || user.email!==email || user.password!==password){
            res.status.json({msg:'False Credentials'});
        }
        if(user.password==password && user.email==email){
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
                            type:user.type,
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
/* Profil */
//Voir Profil
router.get('/:id', (req, res) => {
  Prof.findOne({
    _id: req.params.id
  }).then(
    (prof) => {
      res.status(200).json(prof);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
});


//Modifier Profil 
router.put('/:id', (req, res) => {
  return Prof.updateOne(
    { _id: req.params.id },  // find prof
    { $set: {                // update prof
       
       cin: req.body.cin,
       nom: req.body.nom,
       prenom: req.body.prenom,
       email: req.body.email,
       password: req.body.password     
       
      } 
    }   
  ).then(result => {
    res.status(200).json({ message: "Infos du profil bien modifiés!" });
  });
});

//Modifier photo de profil
router.put('/modifierImage/:idProf',(req,res)=>{
  const busboy = new BusBoy({ headers: req.headers });
  let imageFileName;
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
      return res.status(400).json({ msg: 'Wrong file type submitted' });
    }
    
    // my.image.png => ['my', 'image', 'png']
    let imageExtension = filename.split('.')[filename.split('.').length - 1];
    // 32756238461724837.png
    imageFileName = req.params.idProf+'.'+imageExtension;
    filepath = path.join(__dirname,'../uploads/photosProf/'+imageFileName);
    file.pipe(fs.createWriteStream(filepath));
    
  });
  busboy.on('finish', () => {
       Prof.updateOne({_id: req.params.idProf},
        {
          $set: {                // update prof
       
            image:imageFileName 
            
           } 
        }).then(()=>{
          res.json("bien modifié");
      }).catch(err=>{
          console.log('error')
     });
  });
  req.pipe(busboy);
});

/* Matieres*/
//Afficher Modules+Elements
router.get('/afficherMatieres/:idProf', (req, res) => {
  Matiere.find ({
    prof: ObjectId(req.params.idProf)
  }).then(
    (matieres) => {
      res.status(200).json(matieres);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );

});

/*Notes*/
//Ajouter note
router.post('/ajouterNote', (req, res) => {
  const note = new Note({
    note: req.body.note,
    matiere: ObjectId(req.body.matiere),
    etudiant: ObjectId(req.body.etudiant)
  });
  note.save().then(
    () => {
      res.status(201).json({
        message: 'Note bien ajouté!'
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

// Afficher Etudiant+Notes d'une matière
router.get('/afficherNotes/:idMatiere', async (req, res) => {
  Note.aggregate ([
    {$match: { matiere: ObjectId(req.params.idMatiere) }},
    {
      $lookup: {
        from:'etudiants',
        localField: 'etudiant',
        foreignField: '_id',
        as: 'etudiant'
      }
    }
  ]).then(
    (listeNotes) => {
      res.status(200).json(listeNotes);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
 
});


//Modifier Note 
router.put('/modifierNote/:matiereId.:etudiantId', (req, res) => {
  return Note.updateOne(
    { "matiere": ObjectId(req.params.matiereId),"etudiant": ObjectId(req.params.etudiantId) },  // find note
    { $set: {                // update note
       
       note: req.body.note   
       
      } 
    }   
  ).then(result => {
    res.status(200).json({ message: "Note bien modifié !" });
  });
});

/*Cours+TD+TP*/
//ajouter document
router.post('/ajouterDocument',(req,res)=>{
  const busboy = new BusBoy({ headers: req.headers });
  //Array pour recuperer les données
  let formData = new Map();

  busboy.on('field',(fieldname, val) =>{
    formData.set(fieldname, val);
});
   
busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
   let documentFileName;
    if (mimetype !== 'application/pdf') {
      return res.status(400).json({ msg: 'Wrong file type submitted' });
    }
    
    if (formData.get('type') === 'cours') {
      
    let imageExtension = filename.split('.')[filename.split('.').length - 1];
    documentFileName = formData.get('nom') +'.'+imageExtension;
    filepath = path.join(__dirname,'../uploads/documentsProf/cours/'+documentFileName);
    
  } 
  else if (formData.get('type') === 'td'){
    let imageExtension = filename.split('.')[filename.split('.').length - 1];
    documentFileName = formData.get('nom') +'.'+imageExtension;
    filepath = path.join(__dirname,'../uploads/documentsProf/td/'+documentFileName);
  } 
  else {
    
    let imageExtension = filename.split('.')[filename.split('.').length - 1];
    documentFileName = formData.get('nom') +'.'+imageExtension;
    filepath = path.join(__dirname,'../uploads/documentsProf/tp/'+documentFileName);
  }
  file.pipe(fs.createWriteStream(filepath));
  });

  busboy.on('finish', () => {
  
    const document = new Document({
      nom: formData.get('nom'),
      type: formData.get('type'),
      fichier: formData.get('nom'),
      matiere: ObjectId(formData.get('matiere'))
    });
    document.save().then(()=>{
          res.json("bien ajouté");
      }).catch(err=>{
          console.log('error')
     });
  });

 
  req.pipe(busboy);
});


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

//password recovery
router.route('/passwordRecovery').post((req,res)=>{
  const {email}=req.body;
  if(!email){
    return res.status(400).json({msg:'Field is required!'});
  }
  let password;
  Prof.find({email})
  .then(prof=>{
    if(prof.length===0){
      return res.status(400).json({msg:'Email professeur non existant!'})
    }
    password=prof[0].password
    let transporter = mailConf('zineddine.ayoub98@gmail.com','ayoubstar');
    let mailOptions = {
      to: email,
      subject: "Site Officiel Ensa",
      text: 'Login : '+email+'\n Password : '+password
    };
    transporter.sendMail(mailOptions);
    return res.json('success');
  });
});


module.exports=router;

