import React, { Component } from 'react';
import {Container,Alert, Spinner,FormGroup,Form,Input,Button,Row,Col,Card,CardBody,CardImg,CardTitle,CardText, Modal, ModalHeader, ModalFooter, ModalBody} from 'reactstrap';
import axios from 'axios';
import icon from '../../logo.svg';
import AppNavbar from './AppNavbar';
import {connect} from 'react-redux';
import {getProf} from '../../actions/admin/adminProfActions';
import {Redirect,Link} from 'react-router-dom';
import {ProfEditProfile,ProfEditProfilePicure} from '../../actions/prof/profActions';
import ExampleComponent from "react-rounded-image";
import {AiFillEdit} from 'react-icons/ai';


// DOWN WE IMPORT THE PICTURES FROM FOLDER 


class ProfileProf extends Component {
   
    state={
       
        success:null,
        msg:null,
        user:{},
        isOpenEdit : false,
        loaded:false,
      
        
    }


    onChange=(e)=>{
    
        const currentState = this.state.user;
        const {name,value} = e.target;
        currentState[name] = value;
        this.setState({user:currentState});

    }

    onSubmit=(e)=>{
        this.setState({
            isOpenEdit:!this.state.isOpenEdit
        });

        //const {nom,prenom,cin,email} = this.state.user;
        const body = {
            nom:this.state.user.nom,
            prenom:this.state.user.prenom,
            cin:this.state.user.cin,
            email:this.state.user.email
        }

        this.props.ProfEditProfile(body,this.state.user._id);
    }


    toggleEdit=()=>{
        this.setState({
            isOpenEdit : !this.state.isOpenEdit,
           
        })
    }

    onChangeImage=(e)=>{
       
        console.log(e.target.files[0]);
        
        let formData=new FormData();
        formData.append("image",e.target.files[0]);
        this.props.ProfEditProfilePicure(formData,this.state.user._id);
    }

    
    componentWillMount()
    {
        if(this.props.user)
        {
              this.state.user = this.props.user;
              this.state.loaded = true;
        }
    }

    componentDidUpdate(prevProps){
        const {error,success,user}=this.props;
        if(error!==prevProps.error){
            if(error.id==='PROF_EDIT_PROFILE_FAIL'){
                this.setState({
                    msg:error.msg.msg,
                    success:null,
                    
                });
            }
            else{
                this.setState({msg:null})
            }
        }
        if(success!==prevProps.success && success==='PROF_EDIT_PROFILE'){
            this.setState({
                success:'Prof Modifier avec succes',
                msg:null
            });
        }
       
        if(user!==prevProps.user && Object.keys(user).length !==0){
            this.setState({
                user:user,
                loaded:true
            });   
        }
        
    }
/*
    onSubmit=(e)=>{
        e.preventDefault();
        const {cin}=this.state;
        const body={
            cin
        };
        this.props.getProf(body);
    }*/
    render() {
        const itemStyle={textDecoration:'line-through',width:400 }
        return (
            <div>
                <AppNavbar />
                <Container className="mt-5">
                    <h4 className="text-center">Profile</h4><br/>
               
                    <Row>
                    <Col xs={3}></Col>
                    <Col xs={5}>
                    {this.state.msg ? <Alert color="danger">
                                {this.state.msg}
                            </Alert>:null}
                            {this.state.success ? <Alert color="success">
                                {this.state.success}
                            </Alert>:null}

                            {this.state.loaded ? (
                                <Col xs={10}>
                                    
                                <Card className="mb-5">
                                <div className="d-flex justify-content-center">
                         <ExampleComponent 
                            roundedColor="#66A5CC"
                            imageWidth="140"
                            imageHeight="140"
                            roundedSize="8"
                            image={ require(`../../../../photoProfile/prof/${this.state.user.image}`)} />
                           
                           
                          
                          <div>
                            <label htmlFor="myInput"><AiFillEdit size="30" color="#66A5CC" /></label>
                             <input id="myInput" style={{display:'none'}} type={"file"} onChange={this.onChangeImage}/>
                        </div>

                                </div>
                                
                                    <CardBody d-flex justify-content-center >
                                          <CardText className="text-center">
                                           <strong> Nom :  </strong> {this.state.user.nom}
                                        </CardText>
                                        <CardText className="text-center">
                                           <strong >  Prenom :  </strong> {this.state.user.prenom}
                                        </CardText>
                                        <CardText className="text-center">
                                           <strong> Email :  </strong> {this.state.user.email}
                                        </CardText>
                                        <CardText className="text-center">
                                           <strong> CIN :  </strong> {this.state.user.cin}
                                        </CardText>
                                      
                                    </CardBody>  
                                </Card>
                                <Row>
                                    <div className="text-center">
                   <Button color="danger" onClick={()=>this.toggleEdit()}>Edit Profile</Button>
                   </div>
                    </Row>
                           
                        </Col>
                            ):
                            <Spinner animation="border" role="status">
                             <span className="sr-only">Loading...</span>
                            </Spinner>}
                        
                        </Col>
                    </Row>
                   
                    <Modal isOpen={this.state.isOpenEdit} toggle={()=>this.toggleEdit()}>
                    <ModalHeader toggle={()=>this.toggleEdit()}>
                        Edit Profile's Information 
                    </ModalHeader>
                    <ModalBody>
                    <Form>
                                <FormGroup onSubmit={this.onSubmit}>
                                    <Input type="text" name="nom" defaultValue={this.state.user.nom} placeholder="Entrer Name" onChange={this.onChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Input type="text" name="prenom" defaultValue={this.state.user.prenom} placeholder="Entrer Prenom" onChange={this.onChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Input type="text" name="cin" defaultValue={this.state.user.cin} placeholder="Entrer CIN" onChange={this.onChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Input type="text" name="email" defaultValue={this.state.user.email} placeholder="Entrer Email" onChange={this.onChange} />
                                </FormGroup>
                                
                            </Form>
                    </ModalBody>
                    <ModalFooter>
                          <Button color="secondary" onClick={()=>this.toggleEdit()}>Cancel</Button>
                          <Button color="info" onClick={()=>this.onSubmit()}>Edit</Button>
                          
                     </ModalFooter>
                    </Modal>
                </Container>
            </div>
        )
    }
}

const mapStateToProps=(state)=>({
    error:state.error,
    success:state.profReducer.success,
    user:state.profAuth.user,
    
});

export default connect(mapStateToProps,{ProfEditProfile,ProfEditProfilePicure})(ProfileProf);
