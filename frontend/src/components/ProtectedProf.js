import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

export default function(ComposedComponent){
    class ProtectedProf extends Component {
        state={
            redirect:false
        }
        componentWillMount(){
            let auth=localStorage.getItem('authProf');
            let userType=localStorage.getItem('type');
            console.log(auth!=="true");
            console.log(userType!=="prof");
            if(auth!=="true" && userType!=="prof"){
                this.setState({
                    redirect:true
                });
            }
        }
        render() {
            if(this.state.redirect){
                return (<Redirect to="/prof/login" />)
            }
            return (
                <ComposedComponent {...this.props} />
            )
        }
    }

    return ProtectedProf;
}
