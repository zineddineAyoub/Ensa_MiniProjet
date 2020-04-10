import {
    PROF_LOADED,
    PROF_LOADING,
    PROF_AUTH_ERROR,
    PROF_LOGIN_SUCCESS,
    PROF_LOGIN_FAIL,
    PROF_LOGOUT_SUCCESS,
  } from '../../actions/prof/types';

  const initialState={
    token:localStorage.getItem('tokenProf'),
    isAuthenticated:false,
    isLoading:false,
    user:null
  }

export default function(state=initialState,action){
    switch(action.type){
        case PROF_LOADING:
            return{
                ...state,
                isLoading:true,
                isAuthenticated:false
            }
        case PROF_LOADED:
            localStorage.setItem('authProf','true')
            localStorage.setItem('type',action.payload.type)
            return{
                ...state,
                isAuthenticated:true,
                user:action.payload,
                isLoading:false
            }
        case PROF_LOGIN_SUCCESS:
            localStorage.setItem('tokenProf',action.payload.token)
            localStorage.setItem('authProf','true')
            localStorage.setItem('type',action.payload.type)
            return{
                ...state,
                ...action.payload,
                isAuthenticated:true,
                isLoading:false
            }
        case PROF_AUTH_ERROR:
        case PROF_LOGIN_FAIL:
        case PROF_LOGOUT_SUCCESS:
            localStorage.removeItem('tokenProf');
            localStorage.setItem('authProf','false');
            localStorage.setItem('type','')
            return{
                ...state,
                token:null,
                user:null,
                isAuthenticated:false,
                isLoading:false
            }
        default:
            return state;
    }
}