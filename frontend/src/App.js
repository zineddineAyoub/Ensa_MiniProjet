import React from 'react';
import './App.css';
import store from './store';
import {Provider} from 'react-redux';
import {BrowserRouter as Router,Route} from 'react-router-dom';
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
import Statistique from './components/admin/Statistique';

//prof components
import LoginProf from './components/prof/Login';
import HomeProf from './components/prof/Home';
import ForgottenPasswordProf from './components/prof/ForgottenPassword';
//etudiant components
import LoginEtudiant from './components/etudiant/Login';
import HomeEtudiant from './components/etudiant/Home';
import ForgottenPasswordEtudiant from './components/etudiant/ForgottenPassword';
//home component
import Home from './components/Home';
//loading user
import {loadAdmin} from './actions/admin/authActions';
import {loadProf} from './actions/prof/authActions';
import {loadEtudiant} from './actions/etudiant/authActions';

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
          <Route path="/" component={Home} exact />

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
      
          <Route path="/prof/login" component={LoginProf} exact />
          <Route path="/prof/home" component={profProtected(HomeProf)} exact />
          <Route path="/prof/forgottenPassword" component={ForgottenPasswordProf} exact />

          <Route path="/etudiant/login" component={LoginEtudiant} exact />
          <Route path="/etudiant/home" component={etudiantProtected(HomeEtudiant)} exact />
          <Route path="/etudiant/forgottenPassword" component={ForgottenPasswordEtudiant} exact />
        </Router>
      </Provider>
    )
  }
}

export default App;
