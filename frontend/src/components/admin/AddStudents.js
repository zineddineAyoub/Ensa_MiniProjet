import React, { Component } from 'react'
import SideBarUI from './SideBarUI';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText'
import Container from '@material-ui/core/Container';
export default class AddStudents extends Component {
    render() {
        return (
         <Container maxWidth="xs">
                <SideBarUI/>
                <h1>Add a student</h1>
         <FormControl>
            <InputLabel htmlFor="my-input">Email address</InputLabel>
           
  
             <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
            </FormControl>
         </Container>  
        )
    }
}
