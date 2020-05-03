import {
    POST_COMMENT,
    GET_COMMENTS,
    POST_COMMENT_FAIL,
    GET_COMMENTS_FAIL
  } from '../actions/types';
  
  const initialState={
    success:null,
    comments:[],
  }
  
  export default function(state=initialState,action){
    switch(action.type){
        case GET_COMMENTS:
            return {
              ...state,
              comments:action.payload
            }
        case GET_COMMENTS_FAIL:
            return {
                ...state,
                success:null,
                comments:[]
            }
        case POST_COMMENT:
            return {
                ...state,
                success:'Posted Succeffully',
                comments:[...state.comments,action.payload]
            }
        case POST_COMMENT_FAIL:
            return {
                success:null,
            }
        default:
            return state
    }
  }