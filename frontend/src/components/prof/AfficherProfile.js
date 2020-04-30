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
import './AfficherProfile.css';


// DOWN WE IMPORT THE PICTURES FROM FOLDER 


class ProfileProf extends Component {
   
    state={
       
        success:null,
        msg:null,
        user:{},
        isOpenEdit : false,
        loaded:false,
        listMatiere:[]
      
        
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
            email:this.state.user.email,
            adresse:this.state.user.adresse,
            telephone:this.state.user.telephone
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
            axios.get(`http://localhost:5000/prof/afficherMatieres/${this.props.user._id}`)
            .then((res)=>{
                this.setState({
                    listMatiere:res.data,
                    loaded:true,
                    user:this.props.user
                });
            });
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
            axios.get(`http://localhost:5000/prof/afficherMatieres/${this.props.user._id}`)
            .then((res)=>{
                this.setState({
                    listMatiere:res.data,
                    loaded:true,
                    user:user
                });
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
                   
                  
                
               
                    <Row>
                    <Col xs={1}></Col>
                    <Col xs={10}>
                    {this.state.msg ? <Alert color="danger">
                                {this.state.msg}
                            </Alert>:null}
                            {this.state.success ? <Alert color="success">
                                {this.state.success}
                            </Alert>:null}

                            {this.state.loaded ? (

                                <div>
<Card style={{boxShadow:"10px 10px 8px 10px #888888"}}>

<div>
  <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet" />
  <div className="container bootstrap snippets">
    <div className="row" id="user-profile">
      <div className="col-lg-3 col-md-4 col-sm-4">
        <div classame="main-box clearfix">
          <h2>{this.state.user.nom} {this.state.user.prenom} </h2>
         

          <div className="d-flex justify-content-center">
                                 <ExampleComponent 
                            roundedColor="#66A5CC"
                            imageWidth="140"
                            imageHeight="140"
                            roundedSize="8"
                            image={require(`../../../../public/photoProfile/prof/${this.state.user.image}`)}
                      />
                     
                           
                        </div> <br/>
                        
                        <div class="d-flex justify-content-center">
                        <label class="btn btn-dark" htmlFor="myInput"> <i className="logo fa fa-pencil-square fa-lg" /> 
                          Modifier Photo
                         </label> 
                             <input id="myInput" style={{display:'none'}} type={"file"} onChange={this.onChangeImage}/>
                        </div>
          
         
        </div>
      </div>
      <div className="col-lg-9 col-md-8 col-sm-8">
        <div className="main-box clearfix">
          <div className="profile-header">
            <h3><span>Professeur Profile</span></h3>
            
            
              
              <Button color="dark" className="edit-profile" onClick={()=>this.toggleEdit()}>
              <i className="fa fa-pencil-square fa-lg" /> Modifier profile
                 </Button>
           
          </div>
          <div className="row profile-user-info">
            <div className="col-sm-8">
              <div className="profile-user-details clearfix">
                <div className="profile-user-details-label">
                  Prenom
                </div>
                <div className="profile-user-details-value">
                  {this.state.user.prenom}
                </div>
              </div>
              <div className="profile-user-details clearfix">
                <div className="profile-user-details-label">
                  Nom
                </div>
                <div className="profile-user-details-value">
                {this.state.user.nom}
                </div>
              </div>
              <div className="profile-user-details clearfix">
                <div className="profile-user-details-label">
                  CIN
                </div>
                <div className="profile-user-details-value">
                  {this.state.user.cin}
                </div>
              </div>
              
              <div className="profile-user-details clearfix">
                <div className="profile-user-details-label">
                  Email
                </div>
                <div className="profile-user-details-value">
                {this.state.user.email} 
                </div>
              </div>

              <div className="profile-user-details clearfix">
                <div className="profile-user-details-label">
                  Address
                </div>
                <div className="profile-user-details-value">
                    {this.state.user.adresse ? (
                        this.state.user.adresse
                    ): 
                            "( Non Disponible)"
                    }
                   
                </div>
              </div>

              <div className="profile-user-details clearfix">
                <div className="profile-user-details-label">
                  Telephone
                </div>
                <div className="profile-user-details-value">
                {this.state.user.telephone ? (
                        this.state.user.telephone
                    ): 
                            "( Non Disponible)"
                    }
                </div>
              </div>
            </div>
            <div className="col-sm-4 profile-social">
            <div className="list-group">
  <a href="#" className="list-group-item list-group-item-action active">
    List Matiere
  </a>
  {this.state.listMatiere.map((data)=>(
                     <a href="#" className="list-group-item list-group-item-action">{data.nom}</a>
                                          ))}
</div>

              </div>
          </div>
         
        </div>
      </div>
    </div>
  </div>
</div>
</Card>


                           
                           
                    </div>
                            ):
                            <div className="d-flex justify-content-center">
                                <Spinner  animation="border" role="status">
                             <span className="sr-only">Loading...</span>
                            </Spinner>
                            </div>
                            }
                        
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
                                <FormGroup>
                                    <Input type="text" name="adresse" defaultValue={this.state.user.adresse} placeholder="Entrer Adresse" onChange={this.onChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Input type="text" name="telephone" defaultValue={this.state.user.telephone} placeholder="Entrer Numero Telephone" onChange={this.onChange} />
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
