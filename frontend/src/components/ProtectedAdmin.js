import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

export default function(ComposedComponent){
    class ProtectedAdmin extends Component {
        state={
            redirect:false
        }
        componentWillMount(){
            let auth=localStorage.getItem('auth');
            let userType=localStorage.getItem('type');
            if(auth==="false" && userType!=="admin"){
                console.log("lol");
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
