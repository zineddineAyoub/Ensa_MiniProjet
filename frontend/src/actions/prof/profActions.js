import axios from "axios";
import {
    PROF_EDIT_PROFILE,
    PROF_EDIT_PROFILE_FAIL,
    PROF_EDIT_PROFILE_PICTURE,
    PROF_EDIT_PROFILE_PICTURE_FAIL,
    ETUDIANT_BY_NIVEAU_FILIERE,
    ETUDIANT_BY_NIVEAU_FILIERE_FAIL,
    AJOUTER_NOTE,
    AJOUTER_NOTE_FAIL,
    LIST_NOTE,
    LIST_NOTE_FAIL,
    MODIFIER_NOTE,
    MODIFIER_NOTE_FAIL,
    ADD_DOCUMENT,
    ADD_DOCUMENT_FAIL,
    LIST_DOCUMENT,
    LIST_DOCUMENT_FAIL,
  } from './types';

import {returnErrors} from '../errorActions';

export const ProfEditProfile=({nom,prenom,cin,email},id)=>dispatch=>{
    const config={
      headers:{
          'Content-type':'application/json'
      }
    }
    const body=JSON.stringify({nom,prenom,cin,email});
    axios.put(`http://localhost:5000/prof/ModifierProf/${id}`,body,config)
    .then(user=>{
      dispatch({
        type:PROF_EDIT_PROFILE,
        payload:user.data
      });
    }).catch(err=>{
      dispatch(returnErrors(err.response.data,err.response.status,'PROF_EDIT_PROFILE_FAIL'));
      dispatch({
          type:PROF_EDIT_PROFILE_FAIL
      })
    });
}

export const ProfEditProfilePicure=(formData,id)=>dispatch=>{
  axios.put(`http://localhost:5000/prof/EditProfilePicture/${id}`,formData)
  .then(user=>{
    dispatch({
      type:PROF_EDIT_PROFILE_PICTURE,
      payload:user.data
    });
  }).catch(err=>{
    dispatch(returnErrors(err.response.data,err.response.status,'PROF_EDIT_PROFILE_PICTURE_FAIL'));
    dispatch({
      type:PROF_EDIT_PROFILE_PICTURE_FAIL
    });
  });
}

/*export const EtudiantByNiveauFiliere=(id)=>dispatch=>{
  axios.get(`http://localhost:5000/prof/EtudiantByNiveauFiliere/${id}`)
  .then(users=>{
    console.log("its "+user[0].nom);
    
    dispatch({
      type:ETUDIANT_BY_NIVEAU_FILIERE,
      payload:users.data
      
    });
  }).catch(err=>{
   // dispatch(returnErrors(err.response.data,err.response.status,'ETUDIANT_BY_NIVEAU_FILIERE_FAIL'));
    dispatch({
      type:ETUDIANT_BY_NIVEAU_FILIERE_FAIL
    });
  });
}*/

export const EtudiantByNiveauFiliere=(id)=>dispatch=>{
  console.log("im in prof action "+`http://localhost:5000/prof/EtudiantByNiveauFiliere/${id}`);
  
  axios.get(`http://localhost:5000/prof/EtudiantByNiveauFiliere/${id}`)
  .then((users)=>{
    console.log("oh cooll");
    console.log(users.data);
    
    dispatch({
      type:ETUDIANT_BY_NIVEAU_FILIERE,
      payload:users.data
    })
    
    console.log("what");
    
  }).catch(err=>{
    //dispatch(returnErrors(err.response.data,err.response.status,'ETUDIANT_BY_NIVEAU_FILIERE_FAIL'));
    console.log("okay");
    
    dispatch({
      type:ETUDIANT_BY_NIVEAU_FILIERE_FAIL
    });
    
  })
}


export const AjouterNote=(data)=>dispatch=>{
  const config={
    headers:{
        'Content-type':'application/json'
    }
  }
  const body=JSON.stringify(data);
  axios.post(`http://localhost:5000/prof/ajouterNote`,body,config)
  .then(user=>{
    dispatch({
      type:AJOUTER_NOTE,
      payload:user.data
    });
  }).catch(err=>{
    dispatch(returnErrors(err.response.data,err.response.status,'AJOUTER_NOTE_FAIL'));
    dispatch({
        type:AJOUTER_NOTE_FAIL
    })
  });
}


export const ListNote=({niveauFiliere,matiere,semestre})=>dispatch=>{
  const config={
    headers:{
        'Content-type':'application/json'
    }
  }
  const body=JSON.stringify({niveauFiliere,matiere,semestre});
  console.log("action dody data "+niveauFiliere+" "+matiere+" "+semestre);
  
  axios.post(`http://localhost:5000/prof/afficherNote`,body,config)
  .then(users=>{

    dispatch({
      type:LIST_NOTE,
      payload:users.data
    });
  }).catch(err=>{
   /// dispatch(returnErrors(err.response.data,err.response.status,'LIST_NOTE_FAIL'));
    dispatch({
      type:LIST_NOTE_FAIL
    });
  });
}

export const EditNote=(note)=>dispatch=>{
  const config={
    headers:{
        'Content-type':'application/json'
    }
  }
  const body=JSON.stringify(note);
  axios.put(`http://localhost:5000/prof/modifierNote`,body,config)
  .then(user=>{
    dispatch({
      type:MODIFIER_NOTE,
      payload:user.data
    });
  }).catch(err=>{
    dispatch(returnErrors(err.response.data,err.response.status,'MODIFIER_NOTE_FAIL'));
    dispatch({
        type:MODIFIER_NOTE_FAIL
    })
  });
}

export const addDocument=(formData)=>dispatch=>{
  axios.post('http://localhost:5000/prof/AddDocument',formData)
  .then(user=>{
    dispatch({
      type:ADD_DOCUMENT,
      payload:user.data
    });
  }).catch(err=>{
    dispatch(returnErrors(err.response.data,err.response.status,'ADD_DOCUMENT_FAIL'));
    dispatch({
      type:ADD_DOCUMENT_FAIL
    });
  });
}

export const ListDocument=(id)=>dispatch=>{
  
  axios.post(`http://localhost:5000/prof/Listdocument/${id}`)
  .then(users=>{
    dispatch({
      type:LIST_DOCUMENT,
      payload:users.data
    });
  }).catch(err=>{
    dispatch(returnErrors(err.response.data,err.response.status,'LIST_DOCUMENT_FAIL'));
    dispatch({
      type:LIST_DOCUMENT_FAIL
    });
  });
}