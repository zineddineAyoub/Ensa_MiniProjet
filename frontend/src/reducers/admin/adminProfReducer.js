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
  } from '../../actions/admin/types';
  
  const initialState={
    success:null,
    users:[],
    user:{}
  }
  
  export default function(state=initialState,action){
    switch(action.type){
        case ADD_PROF:
            return {
              ...state,
              success:'ADD_PROF'
            }
        case ADD_PROF_FAIL:
          return{
            ...state,
            success:null
          }
        case ADD_PROFS:
            return{
                ...state,
                success:'ADD_PROFS'
            }
        case ADD_PROFS_FAIL:
            return{
                ...state,
                success:null
            }
        case LIST_PROFS:
            return{
              ...state,
              success:'LIST_PROFS',
              users:action.payload.users
            }
        case LIST_PROFS_FAIL:
            return{
              ...state,
              success:null,
              users:[]
            }
        case DELETE_PROF:
            return{
              ...state,
              success:null,
              users:state.users.filter(user=>user.matiere.prof._id!==action.payload)
            }
        case GET_PROF:
          return{
            ...state,
            success:'GET_PROF',
            user:action.payload.user
          }
        case GET_PROF_FAIL:
          return{
            ...state,
            success:null,
            user:{}
          }
        default:
            return state;
    }
  }