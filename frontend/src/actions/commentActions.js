import axios from "axios";
import {
    POST_COMMENT,
    GET_COMMENTS,
    POST_COMMENT_FAIL,
    GET_COMMENTS_FAIL
  } from '../actions/types';

import {returnErrors} from './errorActions';

export const postComment=({message,type,document,idSender})=>dispatch=>{
    const config={
        headers:{
            'Content-type':'application/json'
        }
      }
      const body=JSON.stringify({message,type,document,idSender});
      axios.post('http://localhost:5000/prof/postComment',body,config)
      .then(docs=>{
        dispatch({
            type:POST_COMMENT,
            payload:docs.data
        })
      });
}

export const getComments=(id)=>dispatch=>{

      axios.get(`http://localhost:5000/prof/comments/${id}`)
      .then(docs=>{
        dispatch({
            type:GET_COMMENTS,
            payload:docs.data
        })
      }).catch(err=>{
        dispatch(returnErrors(err.response.data,err.response.status,'GET_COMMENTS_FAIL'));
        dispatch({
            type:GET_COMMENTS_FAIL
        })
      });
}



