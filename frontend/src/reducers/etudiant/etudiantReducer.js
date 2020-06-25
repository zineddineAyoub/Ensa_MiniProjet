import {
    ETUDIANT_EDIT_PROFILE,
    ETUDIANT_EDIT_PROFILE_FAIL,
    ETUDIANT_EDIT_PROFILE_PICTURE,
    ETUDIANT_EDIT_PROFILE_PICTURE_FAIL, 
    ETUDIANT_EDIT_PASS,
    ETUDIANT_EDIT_PASS_FAIL,
    LIST_NOTE_FAIL,
    LIST_NOTE,
    LIST_DOCUMENT,
    LIST_DOCUMENT_FAIL,
    
    
  } from '../../actions/etudiant/types';

  const initialState={
    success:null,
    users:[],
    user:{}
  }
  
  export default function(state=initialState,action){
    switch(action.type){
        case ETUDIANT_EDIT_PROFILE:
            return {
              ...state,
              success:'ETUDIANT_EDIT_PROFILE'
            }
        case  ETUDIANT_EDIT_PROFILE_FAIL:
          return{
            ...state,
            success:null
          }

          case ETUDIANT_EDIT_PROFILE_PICTURE:
            return {
              ...state,
              success:'ETUDIANT_EDIT_PROFILE'
            }
            case  ETUDIANT_EDIT_PROFILE_PICTURE_FAIL:
          return{
            ...state,
            success:null
          }
          
          case ETUDIANT_EDIT_PASS:
            return {
              ...state,
              success:'ETUDIANT_EDIT_PASS'
            }
            case  ETUDIANT_EDIT_PASS_FAIL:
              return{
                ...state,
                success:null
              }
        
            case  LIST_NOTE:
              console.log("list note from reducer "+action.payload);
              
              return{
                ...state,
                users:action.payload,
                success:'LIST_NOTE'
              }

              case  LIST_NOTE_FAIL:
                console.log("list note from reducer not working "+action.payload);
                return{

                  ...state,
                  users:[],
                  success:null
                }

               

                        case  LIST_DOCUMENT:
                          return{
                            ...state,
                            users:action.payload,
                            success:'LIST_DOCUMENT'
                          }
            
                          case  LIST_DOCUMENT_FAIL:
                            return{
                                ...state,
                              users:[],
                              success:null
                            }

                        

            default:
            return state;
    }
  }