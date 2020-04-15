import {
  ADD_STUDENT,
  ADD_STUDENT_FAIL,
  ADD_EMPLOIE,
  ADD_EMPLOIE_FAIL,
  LIST_STUDENTS,
  LIST_STUDENTS_FAIL,
  DELETE_STUDENT,
  GET_STUDENT,
  GET_STUDENT_FAIL
} from '../../actions/admin/types';

const initialState={
  success:null,
  users:[],
  user:{}
}

export default function(state=initialState,action){
  switch(action.type){
      case ADD_STUDENT:
          return {
            ...state,
            success:'ADD_STUDENT'
          }
      case ADD_STUDENT_FAIL:
        return{
          ...state,
          success:null
        }
      case ADD_EMPLOIE:
        return{
          ...state,
          success:'ADD_EMPLOIE'
        }
      case ADD_EMPLOIE_FAIL:
        return{
          ...state,
          success:null
        }
      case LIST_STUDENTS:
        return{
          ...state,
          success:'LIST_STUDENTS',
          users:action.payload.users
        }
      case LIST_STUDENTS_FAIL:
        return{
          ...state,
          success:null,
          users:[]
        }
      case DELETE_STUDENT:
        return{
          ...state,
          success:null,
          users:state.users.filter(user=>user._id!==action.payload)
        }
      case GET_STUDENT:
        return{
          ...state,
          success:'GET_STUDENT',
          user:action.payload.user
        }
      case GET_STUDENT_FAIL:
        return{
          ...state,
          success:null,
          user:{}
        }
      default:
          return state;
  }
}