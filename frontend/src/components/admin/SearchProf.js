import React, { Component } from 'react';
import {Container,Alert, FormGroup,Form,Input,Button,Row,Col,Card,CardBody,CardImg,CardTitle,CardText} from 'reactstrap';
import axios from 'axios';
import icon from '../../logo.svg';
import AppNavbar from './AppNavbar';
import {connect} from 'react-redux';
import {getProf} from '../../actions/admin/adminProfActions';
import {clearSuccess} from '../../actions/admin/authActions';
import ExampleComponent from "react-rounded-image";

class SearchProf extends Component {
    state={
        cin:null,
        success:null,
        msg:null,
        user:null,
        userExist:false
    }
    componentWillMount(){
        this.props.clearSuccess();
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
                success:'Professeur exist!',
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
                                   <div className="d-flex justify-content-center">
                                 <ExampleComponent 
                            roundedColor="#66A5CC"
                            imageWidth="140"
                            imageHeight="140"
                            roundedSize="8"
                            image={require(`../../../../public/photoProfile/prof/${this.state.user.image}`)}
                      />
                     
                           
                        </div>
                                    <CardBody >
                                        <CardText className="text-center">
                                         <strong>Nom : </strong>{this.state.user.nom} <br></br>
                                          <strong >Prenom: </strong> {this.state.user.prenom}<br></br>
                                         <strong> Email :</strong>      {this.state.user.email} <br/>
                                         <strong>CIN :</strong>    {this.state.user.cin} <br/>
                                         <strong> Adresse : </strong>   {this.state.user.adresse ? (
                                           this.state.user.adresse
                                              ): 
                                              "( Non Disponible)"
                                              } <br></br>
                                              <strong> Telephone :  </strong>
                                              {this.state.user.telephone ? (
                                                  this.state.user.telephone
                                                      ): 
                                                        "( Non Disponible)"
                                                 }
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

export default connect(mapStateToProps,{getProf,clearSuccess})(SearchProf);
