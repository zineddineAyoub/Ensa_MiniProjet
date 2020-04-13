import React, { Component } from 'react'
import {Button} from 'reactstrap';
import {connect} from 'react-redux';
import {logout} from '../../actions/prof/authActions';
import {Redirect,Link} from 'react-router-dom';
import { Container } from '@material-ui/core';

class Notification extends Component {
   
    render() {
        return (
            <div>
                <Container maxWidth="xs">
                Notification
                
                </Container>
            </div>
        )
    }
}


export default Notification;
