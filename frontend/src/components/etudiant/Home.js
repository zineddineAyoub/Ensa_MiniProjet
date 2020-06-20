import React, { Component } from 'react';
import {Container, Spinner,Col} from 'reactstrap';
import axios from 'axios';

import AppNavbar from './AppNavbar';
import {connect} from 'react-redux';

// DOWN WE IMPORT THE PICTURES FROM FOLDER 

class Home extends Component {
   
    state={
       
        success:null,
        msg:null,
        user:{},
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
            axios.get(`http://localhost:5000/etudiant/getMatiere/${this.props.user.niveauFiliere}`)
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
            axios.get(`http://localhost:5000/etudiant/getMatiere/${this.props.user.niveauFiliere}`)
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
        const styling={
          background: 'linear-gradient(to top, #97aba4, #003973)',
          height:'100vh',
          display:'flex',  
          color:'#FFFFFF'
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
                                      
                    <Col xs={2}></Col>
                    
                                    <h4>Bienvenu Mr {this.state.user.nom} </h4>
                                     <br/>
                                    <p>Cette Platefrom est faite pour vous faciliter toute sorte de contacte entre vous et vos <i>Professeurs</i></p>
                                    <p>Vous pouvez consulter et télecharger les <i>Cours - TD - TP </i>des différents modules . Ainsi de laissé un commentaire ou poser une question à votre professeur.</p>
                                    <p>Vous pouvez aussi consulter vos <i>Notes</i> </p>
                                    <p>Vous pouvez ainsi consulter les <i>Emploi du Temps - Planning des DS</i></p>
                        <div className="col-sm-4 profile-social text-center" >
                         <div className="list-group">
              
                        <a href="#" className="list-group-item list-group-item-action active">
                         Voici la Liste de vos Matieres
                         </a>
                         {this.state.listMatiere.map((data)=>(
                        <a href="#" className="list-group-item list-group-item-action">{data.matiere.nom}</a>
                                          ))}
                        </div>

                        </div>
                    
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

export default connect(mapStateToProps)(Home);
