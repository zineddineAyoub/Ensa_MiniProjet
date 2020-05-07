import axios from "axios";
import {
    ETUDIANT_EDIT_PROFILE,
    ETUDIANT_EDIT_PROFILE_FAIL,
    ETUDIANT_EDIT_PROFILE_PICTURE,
    ETUDIANT_EDIT_PROFILE_PICTURE_FAIL,
   
    LIST_NOTE,
    LIST_NOTE_FAIL,
   
    LIST_DOCUMENT,
    LIST_DOCUMENT_FAIL,
   
  } from './types';

import {returnErrors} from '../errorActions';

export const EtudiantEditProfile=({nom,prenom,cin,email,adresse,telephone},id)=>dispatch=>{
  console.log("data -- "+adresse+" "+telephone+" "+nom);
  
    const config={
      headers:{
          'Content-type':'application/json'
      }
    }
    const body=JSON.stringify({nom,prenom,cin,email,adresse,telephone});
    axios.put(`http://localhost:5000/etudiant/ModifierEtudiant/${id}`,body,config)
    .then(user=>{
      dispatch({
        type:ETUDIANT_EDIT_PROFILE,
        payload:user.data
      });
    }).catch(err=>{
      dispatch(returnErrors(err.response.data,err.response.status,'ETUDIANT_EDIT_PROFILE_FAIL'));
      dispatch({
          type:ETUDIANT_EDIT_PROFILE_FAIL
      })
    });
}

export const EtudiantEditProfilePicure=(formData,id)=>dispatch=>{
  axios.put(`http://localhost:5000/etudiant/EditProfilePicture/${id}`,formData)
  .then(user=>{
    dispatch({
      type:ETUDIANT_EDIT_PROFILE_PICTURE,
      payload:user.data
    });
  }).catch(err=>{
    dispatch(returnErrors(err.response.data,err.response.status,'ETUDIANT_EDIT_PROFILE_PICTURE_FAIL'));
    dispatch({
      type:ETUDIANT_EDIT_PROFILE_PICTURE_FAIL
    });
  });
}




export const ListNote=({etudiant,semestre})=>dispatch=>{
  const config={
    headers:{
        'Content-type':'application/json'
    }
  }
  
  axios.get(`http://localhost:5000/etudiant/ListNote/${etudiant}/${semestre}`)
  .then(users=>{
    
    dispatch({
      type:LIST_NOTE,
      payload:users.data
    });
  }).catch(err=>{
    dispatch(returnErrors(err.response.data,err.response.status,'LIST_NOTE_FAIL'));
    dispatch({
      type:LIST_NOTE_FAIL
    });
  });
}


export const ListDocument=(id)=>dispatch=>{
  
  axios.get(`http://localhost:5000/etudiant/Listdocument/${id}`)
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





