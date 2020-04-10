import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

export default function(ComposedComponent){
    class ProtectedEtudiant extends Component {
        state={
            redirect:false
        }
        componentWillMount(){
            let auth=localStorage.getItem('authEtudiant');
            let userType=localStorage.getItem('type');
            console.log(auth!=="true");
            console.log(userType!=="etudiant");
            if(auth!=="true" && userType!=="etudiant"){
                this.setState({
                    redirect:true
                });
            }
        }
        render() {
            if(this.state.redirect){
                return (<Redirect to="/etudiant/login" />)
            }
            return (
                <ComposedComponent {...this.props} />
            )
        }
    }

    return ProtectedEtudiant;
}
