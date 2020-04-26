import axios from "axios";
import {
    ADMIN_LOADED,
    ADMIN_LOADING,
    ADMIN_AUTH_ERROR,
    ADMIN_LOGIN_SUCCESS,
    ADMIN_LOGIN_FAIL,
    ADMIN_LOGOUT_SUCCESS,
    CLEAR_SUCCESS
  } from './types';

import {returnErrors} from '../errorActions';

export const loadAdmin=()=>(dispatch,getState)=>{
    dispatch({type:ADMIN_LOADING});
    axios.get('http://localhost:5000/admin/user',tokenConfig(getState))
    .then(user=>{
      dispatch({
        type:ADMIN_LOADED,
        payload:user.data
      });
    }).catch(err=>{
      dispatch(returnErrors(err.response.data,err.response.status));
      dispatch({
        type:ADMIN_AUTH_ERROR
      });
    })
}

export const login=({username,password})=>dispatch=>{
    const config={
      headers:{
          'Content-type':'application/json'
      }
    }
    const body=JSON.stringify({username,password});
    axios.post('http://localhost:5000/admin/login',body,config)
    .then(user=>{
      dispatch({
        type:ADMIN_LOGIN_SUCCESS,
        payload:user.data
      });
    }).catch(err=>{
      dispatch(returnErrors(err.response.data,err.response.status,'LOGIN_FAIL'));
      dispatch({
        type:ADMIN_LOGIN_FAIL
      });
    })
}

export const clearSuccess=()=>dispatch=>{
  dispatch({
    type:CLEAR_SUCCESS
  });
}

export const logout=()=>dispatch=>{
    dispatch({
      type:ADMIN_LOGOUT_SUCCESS
    });
}

const tokenConfig = getState => {
    // Get token from localstorage
    const token = getState().adminAuth.token;
  
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
