const express = require('express')
const router = express.Router()
const Etudiant = require('../models/Etudiant.model')
const Note = require('../models/Note.model')
const NiveauFiliereMatiere = require('../models/NiveauFiliere_Matiere.model')
const Document = require('../models/Document.model')
const jwt=require('jsonwebtoken');
const nodeMailer = require('nodemailer');
const auth=require('../middleware/auth');
const Notification=require('../models/Notification.model');
const Emploie=require('../models/Emploie.model');
const BusBoy = require('busboy');
const path = require('path');
const fs = require('fs');

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

  

router.route('/login').post((req,res)=>{
    const {cne,cin,password}=req.body;
    if(!cne || !cin || !password){
        res.status(400).json({msg:'Enter Al fields'});
    }
    Etudiant.findOne({cne,cin,password})
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
                            niveauFiliere:user.niveauFiliere,
                            _id:user.id,
                            type:user.type,
                            
                        }
                    })
                }
            )
        }
    }).catch(err=>{
      return res.status(400).json({msg:'False Credential'})
    })
});


router.get('/user',auth,(req,res)=>{
    Etudiant.findById(req.user.id)
    .then(user=>{
        res.json(user);
    })
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
  Etudiant.find({email})
  .then(etudiant=>{
    if(etudiant.length===0){
      return res.status(400).json({msg:'Email etudiant non existant!'})
    }
    password=etudiant[0].password
    let transporter = mailConf('zineddine.ayoub98@gmail.com','ayoubstar');
    let mailOptions = {
      to: email,
      subject: "Site Officiel Ensa",
      text: 'Login : '+email+'\n Password : '+password
    };
    transporter.sendMail(mailOptions);
    return res.json('succes');
  });
});


router.route('/ModifierEtudiant/:id').put((req,res)=>{
  const {nom,prenom,cin,email,adresse,telephone}=req.body;
  Etudiant.findOne({_id:req.params.id})
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

router.route('/getMatiere/:id').get((req,res)=>{
  const niveauFiliere=req.params.id;
  NiveauFiliereMatiere.find({niveauFiliere}).populate('matiere').populate('niveauFiliere')
  .then(docs=>{
    return res.json(docs);
  }).catch(err=>{
    return res.status(400).json({msg:err});
  })
})


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
        let filepath = path.join(path2, `/public/photoProfile/etudiant/${filename}`);
        file.pipe(fs.createWriteStream(filepath));
    });
    busboy.on('finish',()=>{
        if(!nameFile){
            return res.status(400).json({msg:'Please Enter your picture'});
        }
        Etudiant.findById(req.params.id).then(
          (user)=>{
            user.image = nameFile;
            user.save();
          }
        )
        res.json({msg:'success'});
    });
    req.pipe(busboy);
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



router.get('/note',(req,res)=>{
  Note.find({}).populate('etudiant').populate('matiere').then((docs)=>{
    return res.status(200).json(docs);
  }).catch((err)=>{
    return res.status(404).json({
      msg:error
    });
  })
})


const eleminateNull=(data)=>{
  return new Promise((resolve,reject)=>{
    newData=[];
    data.forEach(doc=>{
      if(doc.etudiant!=null){
        newData.push(doc);
      }
    })
    resolve(newData);
  });
}

router.route('/afficherNote').post((req,res)=>{
  // NiveauFiliere Matiere semestre 
  const {niveauFiliere,matiere,semestre} = req.body;
  Note.find({matiere,semestre}).populate({
    path: 'etudiant',
    match: { niveauFiliere: {$eq:niveauFiliere}},
    // Explicitly exclude _id, see http://bit.ly/2aEfTdB
    select: 'nom prenom niveauFiliere -_id'
  })
  .exec().then(async(data)=>{
    res.json(await eleminateNull(data));
  }).catch(
    (error) => {
      res.status(404).json({
        msg: error
      });
    }
  );
  });

//send notif if he comments for example or upload the td and homework
router.route('/sendNotification').post((req,res)=>{
  const {senderEtudiant,receiver,content}=req.body;
  let newNotif=new Notification({
    senderEtudiant,
    receiver,
    content
  });
  newNotif.save((err,doc)=>{
    return res.json(doc);
  });
});

//get all student notif
router.route('/getAllNotif/:id').get((req,res)=>{
  const id=req.params.id;
  Notification.find({receiver:id}).populate('senderProf')
  .then((docs)=>{
    return res.json(docs);
  }).catch(err=>{
    return res.json(err);
  })
});

//get all student notif not read
router.route('/getNotifNotViewed/:id').get((req,res)=>{
  const id=req.params.id;
  Notification.find({receiver:id,read:false}).populate('senderProf')
  .then((docs)=>{
    return res.json(docs);
  }).catch(err=>{
    return res.json(err);
  })
});

//modify student notif
router.route('/modifNotif/:id').put((req,res)=>{
  const id=req.params.id;
  Notification.update({receiver:id},{read:true},{multi:true})
  .then(notifs=>{
    return res.json('success');
  });
});

router.route('/getEmploie').post((req,res)=>{
  const {niveauFiliere, semestre, type}=req.body;
  Emploie.find({niveauFiliere,semestre,type})
  .then(doc=>{
    return res.json(doc)
  }).catch(err=>{
    return res.json(err);
  })
})






module.exports=router;

