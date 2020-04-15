import React, { Component } from 'react';
import {Container,Alert, FormGroup,Form,Input,Button,Row,Col,Card,CardBody,CardImg,CardTitle,CardText} from 'reactstrap';
import axios from 'axios';
import icon from '../../logo.svg';
import AppNavbar from './AppNavbar';
import {connect} from 'react-redux';
import {getProf} from '../../actions/admin/adminProfActions';

class SearchProf extends Component {
    state={
        cin:null,
        success:null,
        msg:null,
        user:null,
        userExist:false
    }

    onChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        });
        console.log(this.state.userExist);
    }
    componentDidUpdate(prevProps){
        const {error,success,user}=this.props;
        if(error!==prevProps.error){
            if(error.id==='GET_PROF_FAIL'){
                this.setState({
                    msg:error.msg.msg,
                    success:null,
                    userExist:false
                });
            }
            else{
                this.setState({msg:null})
            }
        }
        if(success!==prevProps.success && success==='GET_PROF'){
            this.setState({
                success:'Etudiant exist!',
                msg:null
            });
        }
        if(user!==prevProps.user && Object.keys(user).length !==0){
            this.setState({
                user:user,
                userExist:true
            });   
        }
    }

    onSubmit=(e)=>{
        e.preventDefault();
        const {cin}=this.state;
        const body={
            cin
        };
        this.props.getProf(body);
    }
    render() {
        return (
            <div>
                <AppNavbar />
                <Container className="mt-5">
                    <h2 className="text-center">Recherche des professeurs</h2><br/>
                    <Alert color="info">
                        <div>Ici vous pouvez rechercher les professeurs selon leurs CIN!</div>
                    </Alert>
                    <Row>
                        <Col xs={3}></Col>
                        <Col xs={7}>
                            {this.state.msg ? <Alert color="danger">
                                {this.state.msg}
                            </Alert>:null}
                            {this.state.success ? <Alert color="success">
                                {this.state.success}
                            </Alert>:null}
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6}>
                            <Form onSubmit={this.onSubmit}>
                                <FormGroup>
                                    <Input type="text" name="cin" placeholder="Entrer CIN" onChange={this.onChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Button type="submit" color="primary" block>Search</Button>
                                </FormGroup>
                            </Form>
                        </Col>
                        <Col xs={6}>
                            {this.state.userExist ? (
                                <Card className="mb-5">
                                    <CardImg src={icon} style={{height:"60px",width:"100%"}}></CardImg>
                                    <CardBody >
                                        <CardTitle className="text-center"><strong>{this.state.user.nom}</strong></CardTitle><br /><br />
                                        <CardText className="text-center">
                                            {this.state.user.email}
                                        </CardText>
                                    </CardBody>  
                                </Card>
                            ):null}
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

const mapStateToProps=(state)=>({
    success:state.adminProf.success,
    user:state.adminProf.user,
    error:state.error
});

export default connect(mapStateToProps,{getProf})(SearchProf);
