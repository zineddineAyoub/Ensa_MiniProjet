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
import AddStudent from './components/admin/AddStudents';
//prof components
import LoginProf from './components/prof/Login';
import HomeProf from './components/prof/Home';
import NotificationProf from './components/prof/Notification';
//etudiant components
import LoginEtudiant from './components/etudiant/Login';
import HomeEtudiant from './components/etudiant/Home';
import EmploiEtudiant from './components/etudiant/Emploi';

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
          <Route path="/admin/login" component={LoginAdmin} exact />
          <Route path="/admin/home" component={adminProtected(HomeAdmin)} exact />
          <Route path="/admin/addStudent" component={adminProtected(AddStudent)} exact />

          <Route path="/prof/login" component={LoginProf} exact />
          <Route path="/prof/home" component={profProtected(HomeProf)} exact />
          <Route path="/prof/emploi" component={profProtected(NotificationProf)} exact />
          

          <Route path="/etudiant/login" component={LoginEtudiant} exact />
          <Route path="/etudiant/home" component={etudiantProtected(HomeEtudiant)} exact />
           <Route path="/etudiant/emploi" component={profProtected(EmploiEtudiant)} exact />
        </Router>
      </Provider>
    )
  }
}

export default App;
