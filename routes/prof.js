const express = require('express')
const router = express.Router()
const Prof = require('../models/Prof.model')
const jwt=require('jsonwebtoken');
const auth=require('../middleware/auth');



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


module.exports=router;

