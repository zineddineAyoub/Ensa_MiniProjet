import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

export default function(ComposedComponent){
    class ProtectedAdmin extends Component {
        state={
            redirect:false
        }
        componentWillMount(){
            let auth=localStorage.getItem('authAdmin');
            let userType=localStorage.getItem('type');
            console.log(auth!=="true");
            console.log(userType!=="prof");
            if(auth!=="true" && userType!=="admin"){
                this.setState({
                    redirect:true
                });
            }
        }
        render() {
            if(this.state.redirect){
                return (<Redirect to="/admin/login" />)
            }
            return (
                <ComposedComponent {...this.props} />
            )
        }
    }

    return ProtectedAdmin;
}
