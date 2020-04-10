import {combineReducers} from 'redux';
import AdminAuthReducer from './admin/authReducer';
import ProfAuthReducer from './prof/authReducer';
import ErrorReducer from './errorReducer';

export default combineReducers({
    adminAuth:AdminAuthReducer,
    profAuth:ProfAuthReducer,
    error:ErrorReducer
});