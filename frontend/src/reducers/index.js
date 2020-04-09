import {combineReducers} from 'redux';
import AdminAuthReducer from './admin/authReducer';
import ErrorReducer from './errorReducer';

export default combineReducers({
    adminAuth:AdminAuthReducer,
    error:ErrorReducer
});