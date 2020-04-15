import axios from "axios";
import {
    ADD_MATIERE,
    ADD_MATIERE_FAIL,
    ADD_MATIERES,
    ADD_MATIERES_FAIL,
    LIST_MATIERES,
    LIST_MATIERES_FAIL,
    DELETE_MATIERE
} from './types';

import {returnErrors} from '../errorActions';

export const addMatiere=({nom,prof,niveauFiliere})=>dispatch=>{
    const config={
      headers:{
          'Content-type':'application/json'
      }
    }
    const body=JSON.stringify({nom,prof,niveauFiliere});
    axios.post('http://localhost:5000/admin/ajoutOneMatiere',body,config)
    .then(user=>{
      dispatch({
        type:ADD_MATIERE,
        payload:user.data
      });
    }).catch(err=>{
      dispatch(returnErrors(err.response.data,err.response.status,'ADD_MATIERE_FAIL'));
      dispatch({
          type:ADD_MATIERE_FAIL
      })
    });
}

export const addMatieres=(formData)=>dispatch=>{
    axios.post('http://localhost:5000/admin/ajouterMatiereCSV',formData)
    .then(user=>{
      dispatch({
        type:ADD_MATIERES,
        payload:user.data
      });
    }).catch(err=>{
      dispatch(returnErrors(err.response.data,err.response.status,'ADD_MATIERES_FAIL'));
      dispatch({
        type:ADD_MATIERES_FAIL
      });
    });
  }

  export const listMatiere=({niveauFiliere})=>dispatch=>{

    axios.get(`http://localhost:5000/admin/getMatiere/${niveauFiliere}`)
    .then(users=>{
      dispatch({
        type:LIST_MATIERES,
        payload:users.data
      });
    }).catch(err=>{
      dispatch(returnErrors(err.response.data,err.response.status,'LIST_MATIERES_FAIL'));
      dispatch({
        type:LIST_MATIERES_FAIL
      });
    });
  }

  export const deleteMatiere=(id)=>dispatch=>{
    axios.delete(`http://localhost:5000/admin/deleteMatiere/${id}`)
    .then(user=>{
      dispatch({
        type:DELETE_MATIERE,
        payload:id
      });
    });
  }








