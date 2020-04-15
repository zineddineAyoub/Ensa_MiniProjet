import axios from "axios";
import {
    ADD_PROF,
    ADD_PROF_FAIL,
    ADD_PROFS,
    ADD_PROFS_FAIL,
    LIST_PROFS,
    LIST_PROFS_FAIL,
    DELETE_PROF,
    GET_PROF,
    GET_PROF_FAIL
  } from './types';

import {returnErrors} from '../errorActions';

export const addProf=({nom,prenom,cin,email})=>dispatch=>{
    const config={
      headers:{
          'Content-type':'application/json'
      }
    }
    const body=JSON.stringify({nom,prenom,cin,email});
    axios.post('http://localhost:5000/admin/addOneProf',body,config)
    .then(user=>{
      dispatch({
        type:ADD_PROF,
        payload:user.data
      });
    }).catch(err=>{
      dispatch(returnErrors(err.response.data,err.response.status,'ADD_PROF_FAIL'));
      dispatch({
          type:ADD_PROF_FAIL
      })
    });
}

export const addProfs=(formData)=>dispatch=>{
    axios.post('http://localhost:5000/admin/ajouterProf',formData)
    .then(user=>{
      dispatch({
        type:ADD_PROFS,
        payload:user.data
      });
    }).catch(err=>{
      dispatch(returnErrors(err.response.data,err.response.status,'ADD_PROFS_FAIL'));
      dispatch({
        type:ADD_PROFS_FAIL
      });
    });
  }

  export const listProf=({niveauFiliere})=>dispatch=>{
    axios.get(`http://localhost:5000/admin/getProfByNiveau/${niveauFiliere}`)
    .then(users=>{
      dispatch({
        type:LIST_PROFS,
        payload:users.data
      });
    }).catch(err=>{
      dispatch(returnErrors(err.response.data,err.response.status,'LIST_PROFS_FAIL'));
      dispatch({
        type:LIST_PROFS_FAIL
      });
    });
  }


export const deleteProf=(id)=>dispatch=>{
    axios.delete(`http://localhost:5000/admin/deleteOneProf/${id}`)
    .then(user=>{
      console.log(user);
      dispatch({
        type:DELETE_PROF,
        payload:id
      });
    });
  }

  export const getProf=({cin})=>dispatch=>{
    axios.get(`http://localhost:5000/admin/getProf/${cin}`)
    .then(user=>{
      dispatch({
        type:GET_PROF,
        payload:user.data
      })
    }).catch(err=>{
      dispatch(returnErrors(err.response.data,err.response.status,'GET_PROF_FAIL'));
      dispatch({
        type:GET_PROF_FAIL
      });
    })
  }







