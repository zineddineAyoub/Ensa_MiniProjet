import React, { Component } from 'react';
import {Container,Alert,Spinner, FormGroup,Form,Input,Button,Row,Col} from 'reactstrap';
import axios from 'axios';
import AppNavbar from './AppNavbar';
import {connect} from 'react-redux';
import {addDocument,sendNotification} from '../../actions/prof/profActions';

class AddDocument extends Component {
    state={
        niveauFiliere:null,
        success:null,
        msg:null,
        file:null,
        listNiveau:[],
        listMatiere:[],
        msg:null,
        user:{},
        loaded:null,
        nom:null,
        type:null,
        matiere:null,

    }
    componentWillMount(){
        if(this.props.user)
        {
            axios.get(`http://localhost:5000/prof/afficherMatieres/${this.props.user._id}`)  
            .then((res)=>{
                this.setState({
                    listMatiere:res.data,
                    user:this.props.user,
                    loaded:true
                });
            });
        }
        
    }

    onChangeFile=(e)=>{
        this.setState({
            file:e.target.files[0]
        });
    }

    onChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        });
    }
    componentDidUpdate(prevProps){
        const {success,error,user}=this.props;
        if(error!==prevProps.error){
            if(error.id=='ADD_DOCUMENT_FAIL'){
                this.setState({msg:error.msg.msg});
            }
            else{
                this.setState({msg:null})
            }
        }
        if(success!==prevProps.success && success==='ADD_DOCUMENT'){
           
            axios.get(`http://localhost:5000/prof/NiveauFiliereByMatiere/${this.state.matiere}`)
                .then((res=>{
                   const dataf = res.data;
                   const prof = this.state.user._id;
                   const matiere = this.state.matiere;
                   const listMatiere = this.state.listMatiere;
                   const type=this.state.type;

                   const result = listMatiere.filter(word => word._id ==matiere);
                    
                    const sendNotification = this.props.sendNotification;
                    console.log("heey wait "+this.state.user._id);
                    
                   dataf.forEach(function(item){
                    const body = {
                        senderProf:prof,
                        content : "A ajouté un "+type+" de la matiere "+result[0].nom+"."
                    }
                   sendNotification(body,item.niveauFiliere._id);  

                  
                  });
                  this.setState({
                    success:'Le document a été enregistré avec succée',
                    msg:null,
                    nom:null,
                    type:null,
                    file:null,
            
                });
                }))

               
        

        }
        if(user!==prevProps.user && Object.keys(user).length !==0){
            axios.get(`http://localhost:5000/prof/afficherMatieres/${this.props.user._id}`)  
            .then((res)=>{
                this.setState({
                    listMatiere:res.data,
                    user:this.props.user,
                    loaded:true
                });
            });  
        }
    }

    onSubmit=(e)=>{
        e.preventDefault();
        
        const {matiere,nom,type,file}=this.state;
        let formData=new FormData();
        formData.append("nom",nom);
        formData.append("type",type);
        formData.append("matiere",matiere);
        formData.append("file",file);
        this.props.addDocument(formData);

    }
    render() {
        
        const styling={
            background: 'linear-gradient(to top, #97aba4, #003973)',
            height:'100vh',
            display:'flex',
            color:"#FFFFFF",
            
        }

        const spinner={ position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      color:'#FFFFFF'
  }


        const fontColor={
           
        }

        const btn_back={
            background:'#FFFFFF',
            color:'#000000',       
        }
        return (
            <div>
                <AppNavbar />
                <div style={styling}>
                <Container className="mt-5">
                   {this.state.loaded ? (
                         <div>
                             <h2 className="text-center" style={fontColor}>Ajouter Document</h2><br/>
                         <Alert color="info">
                             <div>Ici vous pouvez uploader les cours/td/tp de vos matieres</div>
                         </Alert>
                         <Alert color="danger">
                             <div>Veuillez utilisé un fichier PDF!</div>
                         </Alert><br/>
                         <Row>
                             <Col xs={3}></Col>
                             <Col xs={7}>
                                 {this.state.msg ? <Alert color="warning">
                                     {this.state.msg}
                                 </Alert>:null}
                                 {this.state.success ? <Alert color="success">
                                     {this.state.success}
                                 </Alert>:null}
                                 <Form onSubmit={this.onSubmit}>
                                     <FormGroup>
                                         <Input type="select"  style={btn_back} name="matiere" onChange={this.onChange}>
                                             <option>---Choisissez la matiere---</option>
                                             {this.state.listMatiere.map((data)=>(
                                                 <option value={data._id}>{data.nom}</option>
                                             ))}
                                         </Input>
                                     </FormGroup>
                                     <FormGroup>
                                         <Input type="select" style={btn_back} name="type" onChange={this.onChange}>
                                             <option>---Type de document---</option>
                                            
                                                 <option value="Cours">Cours</option>
                                                 <option value="TD">TD</option>
                                                 <option value="TP">TP</option>
                                           
                                         </Input>
                                     </FormGroup>
                                     <FormGroup>
                                         <Input type="text" style={btn_back} name="nom" placeholder="Nom du docuement" onChange={this.onChange}/>
                                      </FormGroup>
                                     <FormGroup>
                                         <input type="file" style={btn_back} name="file" className="form-control" onChange={this.onChangeFile} />
                                     </FormGroup>
                                     <FormGroup>
                                         <Button type="submit"  style={btn_back} block>Upload</Button>
                                     </FormGroup>
                                 </Form>
                             </Col>
                         </Row>
                         </div>
                   ) :  <div style={spinner}><Spinner /></div>} 
                </Container>
                </div>
            </div>
        )
    }
}

const mapStateToProps=(state)=>({
    success:state.profReducer.success,
    error:state.error,
    user:state.profAuth.user
});

export default connect(mapStateToProps,{addDocument,sendNotification})(AddDocument);
