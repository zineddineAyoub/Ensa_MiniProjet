const express = require('express')
const router = express.Router()
const Prof = require('../models/Prof.model')

const Matiere = require('../models/Matiere.model')
const NiveauFiliere_Matiere = require('../models/NiveauFiliere_Matiere.model')
const Etudiant = require('../models/Etudiant.model')
const Note = require('../models/Note.model')
const Commentaire=require('../models/Commentaire.model')
const Notification=require('../models/Notification.model')

const Document = require('../models/Document.model')
const jwt=require('jsonwebtoken');
const auth=require('../middleware/auth');
const BusBoy = require('busboy');
const path = require('path');
const fs = require('fs');
const nodeMailer = require('nodemailer');
const { resolve } = require('path')
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

router.get('/document', async (req, res) => {
  try {
    const profs= await Document.find()
    res.json(profs)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
 
})

// DELETE ALL
router.delete('/deleteAllProf', async (req, res) => {
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
            res.status(400).json({msg:'False Credentials'});
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
                            _id:user._id,
                            nom:user.nom,
                            prenom:user.prenom,
                            cin:user.cin,
                            email:user.email,
                            image:user.image,
                            telephone:user.telephone,
                            adresse:user.adresse,
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
/*router.put('/:id', (req, res) => {
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
});*/
//Modifier Prof
router.route('/ModifierProf/:id').put((req,res)=>{
  const {nom,prenom,cin,email,adresse,telephone}=req.body;
  Prof.findOne({_id:req.params.id})
  .then(user=>{
      user.nom =nom,
      user.prenom = prenom,
      user.cin= cin,
      user.email = email,
      user.adresse=adresse,
      user.telephone=telephone,
      user.save();

      res.json({msg:'success'});

  }).catch(err=>{
      res.status(400).json({msg:err});
  });
});

//Modifier pass
router.route('/ModifierPass/:id').put((req,res)=>{
  const {password}=req.body;
  Prof.findOne({_id:req.params.id})
  .then(user=>{
      user.password =password,
      
      user.save();

      res.json({msg:'success'});

  }).catch(err=>{
      res.status(400).json({msg:err});
  });
});

  //Photo de Profile
  router.route('/EditProfilePicture/:id').put((req,res)=>{
    //manage and save file in folder
    //database
    const busboy = new BusBoy({ headers: req.headers });
    
    let nameFile;
    busboy.on('file',(fieldname, file, filename, encoding, mimetype)=>{
        nameFile=filename;
        let appDir = path.dirname(require.main.filename);
        let path2 = appDir.replace(/\\/g, "/");
        let filepath = path.join(path2, `/photoProfile/prof/${filename}`);
        file.pipe(fs.createWriteStream(filepath));
    });
    busboy.on('finish',()=>{
        if(!nameFile){
            return res.status(400).json({msg:'Please Enter your picture'});
        }
        Prof.findById(req.params.id).then(
          (user)=>{
            user.image = nameFile;
            user.save();
          }
        )
        res.json({msg:'success'});
    });
    req.pipe(busboy);
});



//Afficher Modules+Elements
router.get('/afficherMatieres/:idProf', (req, res) => {
  Matiere.find ({
    prof:req.params.idProf
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

  req.body.forEach(element => {

    const note = new Note({
      note: element.note,
      matiere: element.matiere,
      etudiant: element.etudiant,
      semestre:element.semestre
    });
    note.save()
    .catch(
      (error) => {
        res.status(400).json({
          msg: error
        });
      }
    );
    
  })
  res.status(201).json({
    message: 'Note bien ajouté!'
  });
  
});

router.post('/noteExam',async(req,res)=>{
  console.log("hey");
  
  try {
  Note.find().populate('matiere').populate('etudiant').then((note)=>{
    console.log("haha");
    
      res.json(note)
    })
    
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Afficher Etudiant+Notes d'une matière
router.get('/afficherNotes/:idMatiere', async (req, res) => {
  Note.aggregate ([
    {$match: { matiere: req.params.idMatiere }},
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
        msg: error
      });
    }
  );
 
});

// afficher note des etudiants

  router.route('/afficherNote').post((req,res)=>{
  // NiveauFiliere Matiere semestre 
  const {niveauFiliere,matiere,semestre} = req.body;
  Note.find({matiere,semestre}).populate({
    path: 'etudiant',
    match: { niveauFiliere: {$eq:niveauFiliere}},
    // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
    select: 'nom prenom niveauFiliere -_id'
  })
  .exec().then((data)=>{
    res.json(data);
  }).catch(
    (error) => {
      res.status(404).json({
        msg: error
      });
    }
  );
  });



//Modifier Note 
router.put('/modifierNote', (req, res) => {
 Note.findOne({_id:req.body._id})
 .then((note)=>{
   note.note = req.body.note
   note.save().then(()=>{
     res.json("Note Updated");
   }).catch(err=>res.status(400).json({msg:err}));
 })
 .catch(err=>res.status(400).json({msg:err}));
});


// affiche niveau filiere selon matiere
router.get('/NiveauFiliereByMatiere/:idMatiere', (req, res) => {
  NiveauFiliere_Matiere.find ({
    matiere:req.params.idMatiere
  }).populate('niveauFiliere').then(
    (matieres) => {
      res.status(200).json(matieres);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        msg: error
      });
    }
  );

});

// afficher etudiant selon NiveauFiliere
router.get('/EtudiantByNiveauFiliere/:id', (req, res) => {

  Etudiant.find ({
   niveauFiliere:req.params.id
  }).then(
    (etudiants) => {
      return res.status(200).json(etudiants);
    }
  ).catch(
    (error) => {
    return  res.status(404).json({
        msg: error
      });
    }
  );
  
 
});



//Photo de Profile
router.route('/AddDocument').post((req,res)=>{
  //manage and save file in folder
  //database
  const busboy = new BusBoy({ headers: req.headers });

  let formData = new Map();
  //nom //fichier // type // matiere
  busboy.on('field',(fieldname, val) =>{
    formData.set(fieldname, val);
});
  var nameOfFile;
  busboy.on('file',(fieldname, file, filename, encoding, mimetype)=>{
    console.log(formData.get("type")+"hahah"+formData.get("nom"));
    console.log(encoding);
    console.log(mimetype);
    
    
    if(!mimetype || mimetype!="application/pdf")
    {
      return res.status(400).json({msg:"Please choose a pdf file"});
    }
    
      let appDir = path.dirname(require.main.filename);
      let path2 = appDir.replace(/\\/g, "/");
      let filepath = path.join(path2, `public/Document/${formData.get("type")}/${filename}`);
      file.pipe(fs.createWriteStream(filepath));
      nameOfFile=filename;

  });
  busboy.on('finish',()=>{
      if(!nameOfFile){
          return res.status(400).json({msg:'Please Enter your file'});
      }
      /////////// 
      const document = new Document({
        Nom: formData.get("nom"),
        Type: formData.get("type"),
        Fichier: nameOfFile,
        matiere:formData.get("matiere")

       
      });
      document.save()
      .then(res.json({msg:'success'}))
      .catch(
        (error) => {
          res.status(400).json({
            msg: error
          });
        }
      );

      
  });
  req.pipe(busboy);
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



// afficher Document selon
router.get('/Listdocument/:id', (req, res) => {

  Document.find({
    matiere:req.params.id
  }).then(
    (documents) => {   
      return res.status(200).json(documents);
    }
  ).catch(
    (error) => {
    return  res.status(404).json({
        msg: error
      });
    }
  );
});

// DELETE DOCUMENT
router.delete('/deleteDocument/:id', async (req, res) => {
  console.log(req.params.id+"haha");
  
  Document.deleteOne({
    _id:req.params.id
  }).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        msg: error
      });
    }
  );
  });

//Photo de Profile
router.route('/ModifierDocument').put((req,res)=>{
  //manage and save file in folder
  //database
  const busboy = new BusBoy({ headers: req.headers });

  let formData = new Map();
  //nom //fichier // type // matiere
  busboy.on('field',(fieldname, val) =>{
    formData.set(fieldname, val);
});
  var nameOfFile;
  busboy.on('file',(fieldname, file, filename, encoding, mimetype)=>{
    console.log(formData.get("type")+"hahah"+formData.get("nom"));
    console.log(encoding);
    console.log(mimetype);
    
    
    if(mimetype && mimetype!="application/pdf")
    {
      return res.status(400).json({msg:"Please choose a pdf file"});
    }
    
    if(mimetype=="application/pdf")
    {
      let appDir = path.dirname(require.main.filename);
      let path2 = appDir.replace(/\\/g, "/");
      let filepath = path.join(path2, `public/Document/${formData.get("type")}/${filename}`);
      file.pipe(fs.createWriteStream(filepath));
      nameOfFile=filename;
    }
     

  });
  busboy.on('finish',()=>{

      if(!nameOfFile){
         Document.findOne({_id:formData.get("_id")})
         .then((document)=>{
             nameOfFile=document.Fichier;
          })
      }

      Document.findOne({_id:formData.get("_id")})
    .then((document)=>{
        document.Nom = formData.get("nom"),
        document.Type = formData.get("type"),
        document.Fichier = nameOfFile,
        document.save().then(()=>{
     res.status(200).json("Document Updated");
   }).catch(err=>res.status(400).json({msg:err}));
 })
 .catch(err=>res.status(400).json({msg:err}));
 
  });
  req.pipe(busboy);
});

//post comment general for prof and for student
router.route('/postComment').post((req,res)=>{
  const {message,type,document,idSender}=req.body;
  let status;
  if(!message || !idSender){
    return res.status(400).json({msg:'Entrer les fields!'});
  }
  let newComment=new Commentaire({
    message,
    document
  });
  if(type==="etudiant"){
    newComment.etudiant=idSender;
    newComment.prof=null;
    status=0;
  }
  if(type==="prof"){
    newComment.prof=idSender;
    newComment.etudiant=null;
    status=1;
  }
  newComment.save((err,doc)=>{
    if(err){
      return res.status(400).json({msg:'erreur'});
    }
    doc.populate('prof',(err,doc)=>{
      doc.populate('etudiant',(err1,doc1)=>{
        return res.json(doc1);
      })
    })
  });
});


//get all comments by id of a document general for prof and student
router.route('/comments/:id').get((req,res)=>{
  const id=req.params.id;
  Commentaire.find({document:id}).sort({date:'asc'}).populate('etudiant').populate('prof')
  .then((docs)=>{
    return res.json(docs)
  }).catch(err=>{
    return res.json({msg:'Error'});
  })
});

//get all prof notif
router.route('/getAllNotif/:id').get((req,res)=>{
  const id=req.params.id;
  Notification.find({receiver:id}).populate('senderEtudiant')
  .then((docs)=>{
    return res.json(docs);
  }).catch(err=>{
    return res.json(err);
  })
});

//get all prof notif not read
router.route('/getNotifNotViewed/:id').get((req,res)=>{
  const id=req.params.id;
  Notification.find({receiver:id,read:false}).populate('senderEtudiant')
  .then((docs)=>{
    return res.json(docs);
  }).catch(err=>{
    return res.json(err);
  })
});

//modify prof notif
router.route('/modifNotif/:id').put((req,res)=>{
  const id=req.params.id;
  Notification.update({receiver:id},{read:true},{multi:true})
  .then(notifs=>{
    return res.json('success');
  });
});

const getStudentsToNotify=(niveauFiliere)=>{
  return new Promise((resolve,reject)=>{
    Etudiant.find({niveauFiliere})
    .then((docs)=>{
      resolve(docs);
    }).catch(err=>{
      reject(err);
    })
  });
}
const sendNotifToStudent=(senderProf,receiver,content)=>{
  return new Promise((resolve,reject)=>{
    let newNotif=new Notification({
      senderProf,
      receiver,
      content
    });
    newNotif.save((err,doc)=>{
      if(err) reject('failed');
      resolve('success');
    });
  })
}

//send notif
router.route('/sendNotification/:id').post(async(req,res)=>{
  let response;
  const {senderProf,content}=req.body;
  try{
    let data=await getStudentsToNotify(req.params.id);
    data.forEach(async(doc)=>{
      try{
        response=await sendNotifToStudent(senderProf,doc._id,content);
      }
      catch(err){
        console.log(err);
      }
    })

    return res.json('success');
  }
  catch(err){
    console.log(err);
    return res.json(err);
  }
});

module.exports=router;

