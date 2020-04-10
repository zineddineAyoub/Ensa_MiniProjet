import {combineReducers} from 'redux';
import AdminAuthReducer from './admin/authReducer';
import ProfAuthReducer from './prof/authReducer';
import EtudiantAuthReducer from './etudiant/authReducer';
import ErrorReducer from './errorReducer';

export default combineReducers({
    adminAuth:AdminAuthReducer,
    profAuth:ProfAuthReducer,
    etudiantAuth:EtudiantAuthReducer,
    error:ErrorReducer
});