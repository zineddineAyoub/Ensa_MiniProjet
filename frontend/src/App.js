import React from 'react';
import './App.css';
import store from './store';
import {Provider} from 'react-redux';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
//protection route
import adminProtected from './components/ProtectedAdmin';
import profProtected from './components/ProtectedProf';
import etudiantProtected from './components/ProtectedEtudiant';
//admin components
import LoginAdmin from './components/admin/Login';
import HomeAdmin from './components/admin/Home';
import AddStudent from './components/admin/AddStudent';
import AddStudents from './components/admin/AddStudents';
import AddEmploie from './components/admin/AddEmploie';
import ListStudents from './components/admin/ListStudents';
import AddProf from './components/admin/AddProf';
import AddProfs from './components/admin/AddProfs';
import ListProfs from './components/admin/ListProfs';
import AddMatiere from './components/admin/AddMatiere';
import AddMatieres from './components/admin/AddMatieres';
import SearchStudent from './components/admin/SearchStudent';
import SearchProf from './components/admin/SearchProf';
import ListMatieres from './components/admin/ListMatieres';
import FeedBacks from './components/admin/FeedBacks';
import Statistique from './components/admin/Statistique';


//prof components
import LoginProf from './components/prof/Login';
import HomeProf from './components/prof/Home';
import AddDocument from './components/prof/AddDocument';
import ProfProfile from './components/prof/AfficherProfile';
import AjouterNote from './components/prof/AddNote';
import ListNote from './components/prof/ListNote';
import ListDocument from './components/prof/ListDocument';
import ForgottenPasswordProf from './components/prof/ForgottenPassword';
import NotificationsProf from './components/prof/Notifications';
import ChangePassword from './components/prof/ChangePassword';
import EmploieProf from './components/prof/Emploie';
import ListEtudiant from './components/prof/ListEtudiant';
import ProfileEtudiant from  './components/prof/AfficherProfileEtudiant';

//etudiant components
import LoginEtudiant from './components/etudiant/Login';
import HomeEtudiant from './components/etudiant/Home';
import ForgottenPasswordEtudiant from './components/etudiant/ForgottenPassword';
import ListNoteE from './components/etudiant/ListNote';
import ListDocumentE from './components/etudiant/ListDocument';
import EtudiantProfile from './components/etudiant/AfficherProfile';
import NotificationsEtudiant from './components/etudiant/Notifications';
import ChangePasswordEtud from './components/etudiant/ChangePassword';
import EmploieEtudiant from './components/etudiant/Emploie';
import ListProf from './components/etudiant/ListProf';
import ProfileProf from './components/etudiant/AfficherProfileProf';

//home component
import Home from './components/Home';
import PageNotFound from './components/PageNotFound';
//loading user
import {loadAdmin} from './actions/admin/authActions';
import {loadProf} from './actions/prof/authActions';
import {loadEtudiant} from './actions/etudiant/authActions';
import ProtectedProf from './components/ProtectedProf';


class App extends React.Component{
  componentDidMount(){
    store.dispatch(loadAdmin());
    store.dispatch(loadProf());
    store.dispatch(loadEtudiant());
  }
  render(){
    return(
      <Provider store={store}>
        <Router>
        <Switch>
        
          <Route path="/" component={Home} exact />

          <Route path="/prof" component={profProtected(HomeProf)} exact />
          <Route path="/prof/login" component={LoginProf} exact />
          <Route path="/prof/home" component={profProtected(HomeProf)} exact />
          <Route path="/prof/AddDocument" component={profProtected(AddDocument)} exact />
          <Route path="/prof/Afficherprofile" component={ProtectedProf(ProfProfile)} exact />
          <Route path="/prof/ajouterNote" component={profProtected(AjouterNote)} exact />
          <Route path="/prof/listNote" component={profProtected(ListNote)} exact />
          <Route path="/prof/listDocument" component={profProtected(ListDocument)} exact />
          <Route path="/prof/forgottenPassword" component={ForgottenPasswordProf} exact />
          <Route path="/prof/notifications" component={profProtected(NotificationsProf)} exact />
          <Route path="/prof/ChangePassword" component={profProtected(ChangePassword)} exact />
          <Route path="/prof/emploie" component={profProtected(EmploieProf)} exact />
          <Route path="/prof/listEtudiant" component={profProtected(ListEtudiant)} exact />
          <Route path="/prof/AfficherProfileEtudiant/:id" component={profProtected(ProfileEtudiant)} exact />
           
            <Route path="/admin" component={adminProtected(HomeAdmin)} exact />
            <Route path="/admin/login" component={LoginAdmin} exact />
            <Route path="/admin/home" component={adminProtected(HomeAdmin)} exact />
            <Route path="/admin/addStudent" component={adminProtected(AddStudent)} exact />
            <Route path="/admin/addStudents" component={adminProtected(AddStudents)} exact />
            <Route path="/admin/emploie" component={adminProtected(AddEmploie)} exact />
            <Route path="/admin/listStudents" component={adminProtected(ListStudents)} exact />
            <Route path="/admin/addProf" component={adminProtected(AddProf)} exact />
            <Route path="/admin/addProfs" component={adminProtected(AddProfs)} exact />
            <Route path="/admin/listProfs" component={adminProtected(ListProfs)} exact />
            <Route path="/admin/AddMatiere" component={adminProtected(AddMatiere)} exact />
            <Route path="/admin/AddMatieres" component={adminProtected(AddMatieres)} exact />
            <Route path="/admin/SearchStudent" component={adminProtected(SearchStudent)} exact />
            <Route path="/admin/SearchProf" component={adminProtected(SearchProf)} exact />
            <Route path="/admin/listMatieres" component={adminProtected(ListMatieres)} exact />
            <Route path="/admin/statistiques" component={adminProtected(Statistique)} exact />
            <Route path="/admin/feedbacks" component={adminProtected(FeedBacks)} exact />

            <Route path="/etudiant" component={etudiantProtected(HomeEtudiant)} exact />
            <Route path="/etudiant/login" component={LoginEtudiant} exact />
            <Route path="/etudiant/home" component={etudiantProtected(HomeEtudiant)} exact />
            <Route path="/etudiant/forgottenPassword" component={ForgottenPasswordEtudiant} exact />
            <Route path="/etudiant/Afficherprofile" component={etudiantProtected(EtudiantProfile)} exact />
            <Route path="/etudiant/listNote" component={etudiantProtected(ListNoteE)} exact />
            <Route path="/etudiant/listDocument" component={etudiantProtected(ListDocumentE)} exact />
            <Route path="/etudiant/notifications" component={etudiantProtected(NotificationsEtudiant)} exact />
            <Route path="/etudiant/emploie" component={etudiantProtected(EmploieEtudiant)} exact />
            <Route path="/etudiant/listProf" component={etudiantProtected(ListProf)} exact />
            <Route path="/etudiant/AfficherprofileProf/:id" component={etudiantProtected(ProfileProf)} exact />
            <Route path="/etudiant/ChangePassword" component={etudiantProtected(ChangePasswordEtud)} exact />

            <Route component={PageNotFound} />
          </Switch>
        </Router>
      </Provider>
    )
  }
}

export default App;
