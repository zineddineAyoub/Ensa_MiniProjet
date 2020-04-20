import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Card, CardImg, CardText, CardBody,CardTitle,Button,Form,FormGroup,Input,Alert} from 'reactstrap';
import icon from '../../ressources/admin_icon.png';
import {Redirect,Link} from 'react-router-dom';
//actions
import {login} from '../../actions/admin/authActions';

class Login extends Component {
    state={
        username:null,
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
        const {username,password}=this.state;
        const body={
            username,
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
                username:'',
                password:'',
                msg:null
            });
        }
    }

    render() {
        const styling={
            backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
            height:'100vh',
            display:'flex',
            alignItems:"center",
            justifyContent:"center"
        }
        return (
            <div style={styling}>
                <Card style={{height:"546px",width:"28rem",borderRadius:"8%"}}>
                    <div className="text-center">
                        <CardImg src={icon} style={{height:"200px",width:"200px"}}></CardImg>
                    </div>
                    <CardBody >
                        <CardTitle className="text-center"><h5><strong>Login Admin</strong></h5></CardTitle><br />
                        {this.state.msg ? <Alert color="danger">
                            {this.state.msg}
                        </Alert>:null}
                        {this.props.isAuthenticated ? <Alert color="success">
                            You are Logged In Admin <Link to="/admin/home">Home</Link>
                        </Alert>:null}
                        <CardText className="text-center">
                            <Form onSubmit={this.onSubmit}>
                                <FormGroup>
                                    <Input type="text" name="username" placeholder="Enter Username" onChange={this.onChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Input type="password" name="password" placeholder="Enter Password" onChange={this.onChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Button type="submit" color="primary" className="btn-block">Submit</Button>
                                </FormGroup>
                            </Form>
                        </CardText>
                    </CardBody>  
                </Card>
            </div>
        )
    }
}


const mapStateToProps=(state)=>({
    isAuthenticated:state.adminAuth.isAuthenticated,
    error:state.error
})

export default connect(mapStateToProps,{login})(Login);
