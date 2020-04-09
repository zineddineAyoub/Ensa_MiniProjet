import React from 'react';
import './App.css';
import store from './store';
import {Provider} from 'react-redux';
import {BrowserRouter as Router,Route} from 'react-router-dom';
//protection route
import adminProtected from './components/ProtectedAdmin';
//admin components
import LoginAdmin from './components/admin/Login';
import HomeAdmin from './components/admin/Home';
//prof components
import LoginProf from './components/prof/Login';
//etudiant components
import LoginEtudiant from './components/etudiant/Login';
//loading user
import {loadAdmin} from './actions/admin/authActions';

class App extends React.Component{
  componentDidMount(){
    store.dispatch(loadAdmin());
  }
  render(){
    return(
      <Provider store={store}>
        <Router>
          <Route path="/admin/login" component={LoginAdmin} exact />
          <Route path="/admin/home" component={adminProtected(HomeAdmin)} exact />

          <Route path="/prof/login" component={LoginProf} exact />

          <Route path="/etudiant/login" component={LoginEtudiant} exact />
        </Router>
      </Provider>
    )
  }
}

export default App;
