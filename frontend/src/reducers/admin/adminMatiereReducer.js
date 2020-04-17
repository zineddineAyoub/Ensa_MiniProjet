import {
    ADD_MATIERE,
    ADD_MATIERE_FAIL,
    ADD_MATIERES,
    ADD_MATIERES_FAIL,
    LIST_MATIERES,
    LIST_MATIERES_FAIL,
    DELETE_MATIERE,
    CLEAR_SUCCESS
  } from '../../actions/admin/types';
  
  const initialState={
    success:null,
    matieres:[]
  }
  
  export default function(state=initialState,action){
    switch(action.type){
        case ADD_MATIERE:
            return {
              ...state,
              success:'ADD_MATIERE'
            }
        case ADD_MATIERE_FAIL:
          return{
            ...state,
            success:null
          }
        case ADD_MATIERES:
            return{
                ...state,
                success:'ADD_MATIERES'
            }
        case ADD_MATIERES_FAIL:
            return{
                ...state,
                success:null
            }
        case LIST_MATIERES:
            return{
              ...state,
              success:'LIST_MATIERES',
              matieres:action.payload
            }
        case LIST_MATIERES_FAIL:
            return{
              ...state,
              success:null,
              matieres:[]
            }
        case DELETE_MATIERE:
            return{
              ...state,
              success:null,
              matieres:state.matieres.filter(matiere=>matiere.matiere._id!==action.payload)
            }
        case CLEAR_SUCCESS:
          return{
            ...state,
            success:null
          }
        default:
            return state;
    }
  }