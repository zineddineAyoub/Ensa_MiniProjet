import React, { Component } from 'react';
import {Card, CardText,CardBody,CardTitle,Button,Form,FormGroup,Input,Alert} from 'reactstrap';
import {Link} from 'react-router-dom';
import axios from 'axios';

class ForgottenPassword extends Component {
    state={
        msg:null,
        success:null,
        email:null
    }

    onChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    onSubmit=(e)=>{
        e.preventDefault();
        const {email}=this.state;
        const config={
            headers:{
                'Content-type':'application/json'
            }
          }
        const body=JSON.stringify({email});
        axios.post('http://localhost:5000/prof/passwordRecovery',body,config)
        .then(()=>{
            this.setState({
                success:'Email envoyé avec succés',
                msg:null
            });
        }).catch(err=>{
            this.setState({
                msg:err.response.data.msg,
                success:null
            });
        });
    }

    render() {
        const styling={
            background: 'linear-gradient(to top,#ef8e38 0%,#108dc7 100%)',
            height:'100vh',
            display:'flex',
            alignItems:"center",
            justifyContent:"center",
            "alert":{
                marginTop:"-30px"
            },
            "card":{
                height:"370px",
                width:"50rem"
            }
        }
        return (
            <div style={styling}>
                <Card style={styling.card}>
                    <CardBody >
                        <CardTitle className="text-center"><h5><strong>Professeur Password Recovery</strong></h5></CardTitle>
                        <hr /><br />
                        <Alert color="info" style={styling.alert}>
                            <span>Le mot de pass va être envoyer dans le mail spécifié dans la zone au dessous !</span>
                        </Alert>
                        {this.state.msg ? <Alert color="danger">
                            {this.state.msg}
                        </Alert>:null}
                        {this.state.success ? <Alert color="success">
                            {this.state.success}
                        </Alert>:null}
                        <CardText className="text-center">
                            <Form onSubmit={this.onSubmit}>
                                <FormGroup>
                                    <Input type="email" name="email" placeholder="Enter Email" onChange={this.onChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Button color="primary" block>Submit</Button>
                                </FormGroup>
                            </Form>
                            <Link to="/prof/login">Return to login</Link>
                        </CardText>
                    </CardBody>  
                </Card>
            </div>
        )
    }
}

export default ForgottenPassword;
