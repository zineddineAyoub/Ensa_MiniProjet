import {
    ADMIN_LOADED,
    ADMIN_LOADING,
    ADMIN_AUTH_ERROR,
    ADMIN_LOGIN_SUCCESS,
    ADMIN_LOGIN_FAIL,
    ADMIN_LOGOUT_SUCCESS,
  } from '../../actions/admin/types';

  const initialState={
    token:localStorage.getItem('token'),
    isAuthenticated:false,
    isLoading:false,
    user:null
  }

export default function(state=initialState,action){
    switch(action.type){
        case ADMIN_LOADING:
            return{
                ...state,
                isLoading:true,
                isAuthenticated:false
            }
        case ADMIN_LOADED:
            localStorage.setItem('auth','true')
            localStorage.setItem('type',action.payload.type)
            return{
                ...state,
                isAuthenticated:true,
                user:action.payload,
                isLoading:false
            }
        case ADMIN_LOGIN_SUCCESS:
            localStorage.setItem('token',action.payload.token)
            localStorage.setItem('auth','true')
            localStorage.setItem('type',action.payload.type)
            return{
                ...state,
                ...action.payload,
                isAuthenticated:true,
                isLoading:false
            }
        case ADMIN_AUTH_ERROR:
        case ADMIN_LOGIN_FAIL:
        case ADMIN_LOGOUT_SUCCESS:
            localStorage.removeItem('token');
            localStorage.setItem('auth','false');
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