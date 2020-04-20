import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Card, CardImg, CardText, CardBody,CardTitle,Button,Form,FormGroup,Input,Alert} from 'reactstrap';
import icon from '../../ressources/student_icon.png';
import {Redirect,Link} from 'react-router-dom';
//actions
import {login} from '../../actions/etudiant/authActions';

class Login extends Component {
    state={
        cne:null,
        cin:null,
        password:null,
        msg:null
    }

    onChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    onSubmit=(e)=>{
        e.preventDefault();
        const {cne,cin,password}=this.state;
        const body={
            cne,
            cin,
            password
        }
        this.props.login(body);
    }

    componentDidUpdate(prevProps){
        const {error,isAuthenticated}=this.props;
        if(error!==prevProps.error){
            if(error.id=='LOGIN_FAIL'){
                this.setState({msg:error.msg.msg});
            }
            else{
                this.setState({msg:null})
            }
        }
        if(isAuthenticated!==prevProps.isAuthenticated){
            this.setState({
                cne:'',
                cin:'',
                password:'',
                msg:null
            });
        }
    }

    render() {
        const styling={
            backgroundImage: 'linear-gradient(to top, #00c6fb 0%, #005bea 100%)',
            height:'100vh',
            display:'flex',
            alignItems:"center",
            justifyContent:"center"
        }
        return (
            <div style={styling}>
                <Card style={{height:"554px",width:"28rem",borderRadius:"8%"}}>
                    <div className="text-center"><br />
                        <CardImg src={icon} style={{height:"150px",width:"150px"}}></CardImg>
                    </div>
                    <CardBody >
                        <CardTitle className="text-center"><h5><strong>Login Etudiant</strong></h5></CardTitle><br />
                        {this.state.msg ? <Alert color="danger">
                            {this.state.msg}
                        </Alert>:null}
                        {this.props.isAuthenticated ? <Alert color="success">
                            You are Logged In Etudiant <Link to="/etudiant/home">Home</Link>
                        </Alert>:null}
                        <CardText className="text-center">
                            <Form onSubmit={this.onSubmit}>
                                <FormGroup>
                                    <Input type="text" name="cne" placeholder="Enter CNE" onChange={this.onChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Input type="text" name="cin" placeholder="Enter CIN" onChange={this.onChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Input type="password" name="password" placeholder="Enter Password" onChange={this.onChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Button type="submit" color="primary" className="btn-block">Submit</Button>
                                </FormGroup>
                            </Form>
                            <Link to="/etudiant/forgottenPassword">Forgotten Password?</Link>
                        </CardText>
                    </CardBody>  
                </Card>
            </div>
        )
    }
}


const mapStateToProps=(state)=>({
    isAuthenticated:state.etudiantAuth.isAuthenticated,
    error:state.error
})

export default connect(mapStateToProps,{login})(Login);
