import {combineReducers} from 'redux';
import AdminAuthReducer from './admin/authReducer';
import ProfAuthReducer from './prof/authReducer';
import EtudiantAuthReducer from './etudiant/authReducer';
import ErrorReducer from './errorReducer';
import adminEtudiantReducer from './admin/adminEtudiantReducer';
import adminProfReducer from './admin/adminProfReducer';
import adminMatiereReducer from './admin/adminMatiereReducer';
import profReducer from './prof/profReducer';
import commentReducer from './commentReducer';
import etudiantReducer from './etudiant/etudiantReducer';

export default combineReducers({
    adminAuth:AdminAuthReducer,
    profAuth:ProfAuthReducer,
    profReducer:profReducer,
    etudiantAuth:EtudiantAuthReducer,
    etudiantReducer:etudiantReducer,
    adminEtudiant:adminEtudiantReducer,
    adminProf:adminProfReducer,
    adminMatiere:adminMatiereReducer,
    comment:commentReducer,
    error:ErrorReducer
});