const express = require('express')
const router = express.Router()
const Etudiant = require('../models/Etudiant.model')
const jwt=require('jsonwebtoken');
const nodeMailer = require('nodemailer');
const auth=require('../middleware/auth');
const Notification=require('../models/Notification.model');

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
    Etudiant.findOne({cne})
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
                            niveauFiliere:user.niveauFiliere
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

module.exports=router;

