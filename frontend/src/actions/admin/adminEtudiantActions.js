import axios from "axios";
import {
    ADD_STUDENT,
    ADD_EMPLOIE,
    ADD_STUDENT_FAIL,
    LIST_STUDENTS,
    LIST_STUDENTS_FAIL,
    ADD_EMPLOIE_FAIL,
    DELETE_STUDENT,
    GET_STUDENT,
    GET_STUDENT_FAIL
  } from './types';

import {returnErrors} from '../errorActions';

export const addStudent=({nom,prenom,cne,cin,email,niveauFiliere})=>dispatch=>{
    const config={
      headers:{
          'Content-type':'application/json'
      }
    }
    const body=JSON.stringify({nom,prenom,cne,cin,email,niveauFiliere});
    axios.post('http://localhost:5000/admin/addOneEtudiant',body,config)
    .then(user=>{
      dispatch({
        type:ADD_STUDENT,
        payload:user.data
      });
    }).catch(err=>{
      dispatch(returnErrors(err.response.data,err.response.status,'ADD_STUDENT_FAIL'));
    });
}

export const addStudents=(formData)=>dispatch=>{
  axios.post('http://localhost:5000/admin/ajouterEtudiant',formData)
  .then(user=>{
    dispatch({
      type:ADD_EMPLOIE,
      payload:user.data
    });
  }).catch(err=>{
    dispatch(returnErrors(err.response.data,err.response.status,'ADD_STUDENTS_FAIL'));
    dispatch({
      type:ADD_STUDENT_FAIL
    });
  });
}

export const addEmploie=(formData)=>dispatch=>{
  axios.post('http://localhost:5000/admin/addEmploie',formData)
  .then(user=>{
    dispatch({
      type:ADD_EMPLOIE,
      payload:user.data
    });
  }).catch(err=>{
    dispatch(returnErrors(err.response.data,err.response.status,'ADD_EMPLOIE_FAIL'));
    dispatch({
      type:ADD_EMPLOIE_FAIL
    });
  });
}

export const listStudent=({niveauFiliere})=>dispatch=>{
  
  axios.get(`http://localhost:5000/admin/getEtudiantByNiveau/${niveauFiliere}`)
  .then(users=>{
    dispatch({
      type:LIST_STUDENTS,
      payload:users.data
    });
  }).catch(err=>{
    dispatch(returnErrors(err.response.data,err.response.status,'LIST_STUDENTS_FAIL'));
    dispatch({
      type:LIST_STUDENTS_FAIL
    });
  });
}

export const deleteStudent=(id)=>dispatch=>{
  axios.delete(`http://localhost:5000/admin/deleteEtudiant/${id}`)
  .then(user=>{
    dispatch({
      type:DELETE_STUDENT,
      payload:id
    });
  });
}

export const getStudent=({cne})=>dispatch=>{
  axios.get(`http://localhost:5000/admin/getEtudiant/${cne}`)
  .then(user=>{
    dispatch({
      type:GET_STUDENT,
      payload:user.data
    })
  }).catch(err=>{
    dispatch(returnErrors(err.response.data,err.response.status,'GET_STUDENT_FAIL'));
    dispatch({
      type:GET_STUDENT_FAIL
    });
  })
}






