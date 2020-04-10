import axios from "axios";
import {
    ETUDIANT_LOADED,
    ETUDIANT_LOADING,
    ETUDIANT_AUTH_ERROR,
    ETUDIANT_LOGIN_SUCCESS,
    ETUDIANT_LOGIN_FAIL,
    ETUDIANT_LOGOUT_SUCCESS,
  } from './types';

import {returnErrors} from '../errorActions';

export const loadEtudiant=()=>(dispatch,getState)=>{
    dispatch({type:ETUDIANT_LOADING});
    axios.get('http://localhost:5000/etudiant/user',tokenConfig(getState))
    .then(user=>{
      dispatch({
        type:ETUDIANT_LOADED,
        payload:user.data
      });
    }).catch(err=>{
      dispatch(returnErrors(err.response.data,err.response.status));
      dispatch({
        type:ETUDIANT_AUTH_ERROR
      });
    })
}

export const login=({cne,cin,password})=>dispatch=>{
    const config={
      headers:{
          'Content-type':'application/json'
      }
    }
    const body=JSON.stringify({cne,cin,password});
    axios.post('http://localhost:5000/etudiant/login',body,config)
    .then(user=>{
      dispatch({
        type:ETUDIANT_LOGIN_SUCCESS,
        payload:user.data
      });
    }).catch(err=>{
      dispatch(returnErrors(err.response.data,err.response.status,'LOGIN_FAIL'));
      dispatch({
        type:ETUDIANT_LOGIN_FAIL
      });
    })
}

export const logout=()=>dispatch=>{
    dispatch({
      type:ETUDIANT_LOGOUT_SUCCESS
    });
}

const tokenConfig = getState => {
    // Get token from localstorage
    const token = getState().etudiantAuth.token;
  
    // Headers
    const config = {
      headers: {
        'Content-type': 'application/json'
      }
    };
  
    // If token, add to headers
    if (token) {
      config.headers['x-auth-token'] = token;
    }
  
    return config;
  };
