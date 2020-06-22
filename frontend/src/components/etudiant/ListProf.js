import React, { Component } from 'react';
import {Container, Spinner,Col,Row,CardGroup,Card,CardImg,CardBody,CardText,CardTitle,CardSubtitle,Button,NavLink} from 'reactstrap';
import axios from 'axios';
import ExampleComponent from "react-rounded-image";
import {Link} from 'react-router-dom';
import AppNavbar from './AppNavbar';
import {connect} from 'react-redux';

// DOWN WE IMPORT THE PICTURES FROM FOLDER 

class ListProf extends Component {
   
    state={
       
        success:null,
        msg:null,
        user:{},
        loaded:false,
        listProf:[]
      
        
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

        
        
        this.props.EtudiantEditProfile(body,this.state.user._id);
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
        this.props.EtudiantEditProfilePicure(formData,this.state.user._id);
    }

    
    componentWillMount()
    {
        if(this.props.user)
        {
            axios.get(`http://localhost:5000/etudiant/getProfs/${this.props.user._id}`)
            .then((res)=>{
                console.log(res);
                
                this.setState({
                    listProf:res.data,
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
            axios.get(`http://localhost:5000/etudiant/getProfs/${this.props.user._id}`)
            .then((res)=>{
                console.log(res);
                
                this.setState({
                    listProf:res.data,
                    loaded:true,
                    user:this.props.user
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
        const styling={
          background: 'linear-gradient(to top, #97aba4, #003973)',
          height:'100vh',
          display:'flex',  
         // color:'#FFFFFF'
      }

      const scrolling = {
       overflow : "auto",
       height:"200px",
       width:"200px"
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
                                   
                               {this.state.listProf.map((data)=>(
                                      <Col xs={4}>
                                      <div class="card-deck">
                                     <div className="card d-flex justify-content-center">
                                    
                                     <div className="d-flex justify-content-center">
                                 <ExampleComponent 
                            roundedColor="#66A5CC"
                            imageWidth="140"
                            imageHeight="140"
                            roundedSize="8"
                            image={require(`../../../../public/photoProfile/prof/${data.matiere.prof.image}`)}
                      />
                     
                           
                        </div  >
                                     <div class="card-body text-center">
                                       <h5 class="card-title">{data.matiere.prof.prenom} {data.matiere.prof.nom}</h5>
                                       <p class="card-text"><b>Matiere</b> : {data.matiere.nom}</p>
                               <p class="card-text"><b>E-mail </b> : {data.matiere.prof.email}</p>
                               
                                     </div>
                                     <div class="card-footer text-center">
                                     <Link to={`/etudiant/AfficherprofileProf/${data.matiere.prof._id}`}   style={{textDecoration:'none'}}>
                                          Voir Profile   </Link>
                                     </div>
                                   
                                     
                                    
                                                     </div>
                                   </div>
                                   </Col>
                              
                                          ))}

                                </div>
                                    ):
                            <div style={spinner}><Spinner /></div>
                            }
                       
                   
                   
                </Container>
                </div>
            </div>
        )
    }
}

const mapStateToProps=(state)=>({
    error:state.error,
    success:state.etudiantReducer.success,
    user:state.etudiantAuth.user,
    
});

export default connect(mapStateToProps)(ListProf);
