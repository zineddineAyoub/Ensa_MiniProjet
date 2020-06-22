import React, { Component } from 'react';
import {Container,Alert, Spinner,FormGroup,Form,Input,Button,Row,Col,Card,CardBody,CardImg,CardTitle,CardText, Modal, ModalHeader, ModalFooter, ModalBody} from 'reactstrap';
import axios from 'axios';
import icon from '../../ressources/professor-clipart-talking-4-transparent.png';
import AppNavbar from './AppNavbar';
import {connect} from 'react-redux';
import {getProf} from '../../actions/admin/adminProfActions';
import {Redirect,Link} from 'react-router-dom';
import {ProfEditProfile,ProfEditProfilePicure} from '../../actions/prof/profActions';
import ExampleComponent from "react-rounded-image";



// DOWN WE IMPORT THE PICTURES FROM FOLDER 


class Home extends Component {
   
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
        const styling={
            background: 'linear-gradient(to top, #97aba4, #003973)',
            height:'100vh',
            display:'flex',  
            color:'#FFFFFF'
        }

      const spinner={ position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      color:'#FFFFFF'
  }

        return (
            <div className="whole">
                <AppNavbar />
                <div style={styling}> 
                <Container className="mt-5">
                            {this.state.loaded ? (

                                <div>
                                    <Row>
                                        <Col xs={7}>
                                       <h4>Bienvenu {this.state.user.prenom} </h4>
                                     <br/>
                                    <p>Cette Platefrom est faite pour vous faciliter toute sorte de contacte entre vous et vos <i>Etudiants</i></p>
                                    <p>Vous pouvez uploader - Modifier - Supprimer les <i>Cours - TD - TP </i>des différents modules . Ainsi de voir les commentaires de vos étudiants.</p>
                                    <p>Vous pouvez aussi uploader - Modifier les <i>Notes</i> </p>
                                    <div className="col-sm-8 profile-social">
            <div className="list-group">
              
  <a href="#" className="list-group-item list-group-item-action active">
    Voici la liste de vos matieres
  </a>
  {this.state.listMatiere.map((data)=>(
                     <a href="#" className="list-group-item list-group-item-action">{data.nom}</a>
                                          ))}
</div>

              </div>
              </Col>
              <Col xs={1}></Col>
              <Col xs={4}> <img  src={icon} alt="fireSpot"   width='90%' /></Col> 
                    </Row>
                                      </div>
                            ):
                            <div className="d-flex justify-content-center">
                               <div style={spinner}><Spinner /></div>
                            </div>
                            }
                        
                        
                   
                      </Container>
                </div>
            </div>
        )
    }
}

const mapStateToProps=(state)=>({
    error:state.error,
    success:state.profReducer.success,
    user:state.profAuth.user,
    
});

export default connect(mapStateToProps,{ProfEditProfile,ProfEditProfilePicure})(Home);
