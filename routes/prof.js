const express = require('express')
const router = express.Router()
const Prof = require('../models/Prof.model')
const Matiere = require('../models/Matiere.model')
const NiveauFiliere_Matiere = require('../models/NiveauFiliere_Matiere.model')
const Etudiant = require('../models/Etudiant.model')
const Note = require('../models/Note.model')
const Document = require('../models/Document.model')
const jwt=require('jsonwebtoken');
const auth=require('../middleware/auth');
const BusBoy = require('busboy');
const path=require('path');
const fs = require('fs');

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
  const {nom,prenom,cin,email}=req.body;
  Prof.findOne({_id:req.params.id})
  .then(user=>{
      user.nom =nom,
      user.prenom = prenom,
      user.cin= cin,
      user.email = email,
      user.save();

      res.json({msg:'success'});

  }).catch(err=>{
      res.status(400).json({msg:'Enter all fields!'});
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
      let filepath = path.join(path2, `/Document/${formData.get("type")}/${filename}`);
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



// afficher etudiant selon NiveauFiliere
router.post('/Listdocument/:id', (req, res) => {

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

module.exports=router;

