import axios from "axios";
import {
    PROF_LOADED,
    PROF_LOADING,
    PROF_AUTH_ERROR,
    PROF_LOGIN_SUCCESS,
    PROF_LOGIN_FAIL,
    PROF_LOGOUT_SUCCESS,
  } from './types';

import {returnErrors} from '../errorActions';

export const loadProf=()=>(dispatch,getState)=>{
    dispatch({type:PROF_LOADING});
    axios.get('http://localhost:5000/prof/user',tokenConfig(getState))
    .then(user=>{
      dispatch({
        type:PROF_LOADED,
        payload:user.data
      });
    }).catch(err=>{
      dispatch(returnErrors(err.response.data,err.response.status));
      dispatch({
        type:PROF_AUTH_ERROR
      });
    })
}

export const login=({email,cin,password})=>dispatch=>{
    const config={
      headers:{
          'Content-type':'application/json'
      }
    }
    const body=JSON.stringify({email,cin,password});
    axios.post('http://localhost:5000/prof/login',body,config)
    .then(user=>{
      dispatch({
        type:PROF_LOGIN_SUCCESS,
        payload:user.data
      });
    }).catch(err=>{
      dispatch(returnErrors(err.response.data,err.response.status,'LOGIN_FAIL'));
      dispatch({
        type:PROF_LOGIN_FAIL
      });
    })
}

export const logout=()=>dispatch=>{
    dispatch({
      type:PROF_LOGOUT_SUCCESS
    });
}

const tokenConfig = getState => {
    // Get token from localstorage
    const token = getState().profAuth.token;
  
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
