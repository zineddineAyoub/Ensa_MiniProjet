import {
    ETUDIANT_LOADED,
    ETUDIANT_LOADING,
    ETUDIANT_AUTH_ERROR,
    ETUDIANT_LOGIN_SUCCESS,
    ETUDIANT_LOGIN_FAIL,
    ETUDIANT_LOGOUT_SUCCESS,
  } from '../../actions/etudiant/types';

  const initialState={
    token:localStorage.getItem('tokenEtudiant'),
    isAuthenticated:false,
    isLoading:false,
    user:null
  }

export default function(state=initialState,action){
    switch(action.type){
        case ETUDIANT_LOADING:
            return{
                ...state,
                isLoading:true,
                isAuthenticated:false
            }
        case ETUDIANT_LOADED:
            localStorage.setItem('authEtudiant','true')
            localStorage.setItem('type',action.payload.type)
            return{
                ...state,
                isAuthenticated:true,
                user:action.payload,
                isLoading:false
            }
        case ETUDIANT_LOGIN_SUCCESS:
            localStorage.setItem('tokenEtudiant',action.payload.token)
            localStorage.setItem('authEtudiant','true')
            localStorage.setItem('type',action.payload.type)
            return{
                ...state,
                ...action.payload,
                isAuthenticated:true,
                isLoading:false
            }
        case ETUDIANT_AUTH_ERROR:
        case ETUDIANT_LOGIN_FAIL:
        case ETUDIANT_LOGOUT_SUCCESS:
            localStorage.removeItem('tokenEtudiant');
            localStorage.setItem('authEtudiant','false');
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