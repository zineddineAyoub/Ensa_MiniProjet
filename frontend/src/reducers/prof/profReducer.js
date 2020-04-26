import {
    PROF_EDIT_PROFILE,
    PROF_EDIT_PROFILE_FAIL,
    PROF_EDIT_PROFILE_PICTURE,
    PROF_EDIT_PROFILE_PICTURE_FAIL,
    ETUDIANT_BY_NIVEAU_FILIERE,
    ETUDIANT_BY_NIVEAU_FILIERE_FAIL,
    AJOUTER_NOTE,
    AJOUTER_NOTE_FAIL,
    LIST_NOTE_FAIL,
    LIST_NOTE,
    MODIFIER_NOTE,
    MODIFIER_NOTE_FAIL,
    ADD_DOCUMENT,
    ADD_DOCUMENT_FAIL,
    LIST_DOCUMENT,
    LIST_DOCUMENT_FAIL
    
  } from '../../actions/prof/types';

  const initialState={
    success:null,
    users:[],
    user:{}
  }
  
  export default function(state=initialState,action){
    switch(action.type){
        case PROF_EDIT_PROFILE:
            return {
              ...state,
              success:'PROF_EDIT_PROFILE'
            }
        case  PROF_EDIT_PROFILE_FAIL:
          return{
            ...state,
            success:null
          }

          case PROF_EDIT_PROFILE_PICTURE:
            return {
              ...state,
              success:'PROF_EDIT_PROFILE'
            }
            case  PROF_EDIT_PROFILE_PICTURE_FAIL:
          return{
            ...state,
            success:null
          }
          
          case  ETUDIANT_BY_NIVEAU_FILIERE:
          return{
            ...state,
            users:action.payload,
            success:'ETUDIANT_BY_NIVEAU_FILIERE'
          }
          case ETUDIANT_BY_NIVEAU_FILIERE_FAIL:
            console.log("the fail reducer you know");
            
          return{
            ...state,
            success:null,
          }

          case AJOUTER_NOTE:
            return{
              ... state,
              success:'AJOUTER_NOTE'
            }

            case AJOUTER_NOTE_FAIL:
            return{
              ... state,
              success:null,
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

                case MODIFIER_NOTE:
                  return {
                    ...state,
                    success:'MODIFIER_NOTE'
                  }

                  case MODIFIER_NOTE_FAIL:
                    return {
                      ...state,
                      success:null
                    }


                    case ADD_DOCUMENT:
                      return{
                        ...state,
                        success:'ADD_DOCUMENT'
                      }

                      case ADD_DOCUMENT_FAIL:
                        return {
                          ...state,
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