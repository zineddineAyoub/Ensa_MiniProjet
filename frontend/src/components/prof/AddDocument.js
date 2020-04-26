import React, { Component } from 'react';
import {Container,Alert,Spinner, FormGroup,Form,Input,Button,Row,Col} from 'reactstrap';
import axios from 'axios';
import AppNavbar from './AppNavbar';
import {connect} from 'react-redux';
import {addDocument} from '../../actions/prof/profActions';

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
            this.setState({
                success:'Le document a été enregistré avec succée',
                msg:null,
                nom:null,
                type:null,
                file:null,
        
            });
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
        return (
            <div>
                <AppNavbar />
                <Container className="mt-5">
                   {this.state.loaded ? (
                         <div>
                             <h2 className="text-center">Ajouter Document</h2><br/>
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
                                         <Input type="select" name="matiere" onChange={this.onChange}>
                                             <option>---Choisissez le niveau---</option>
                                             {this.state.listMatiere.map((data)=>(
                                                 <option value={data._id}>{data.nom}</option>
                                             ))}
                                         </Input>
                                     </FormGroup>
                                     <FormGroup>
                                         <Input type="select" name="type" onChange={this.onChange}>
                                             <option>---Type de document---</option>
                                            
                                                 <option value="Cours">Cours</option>
                                                 <option value="TD">TD</option>
                                                 <option value="TP">TP</option>
                                           
                                         </Input>
                                     </FormGroup>
                                     <FormGroup>
                                         <Input type="text" name="nom" placeholder="Nom du docuement" onChange={this.onChange}/>
                                      </FormGroup>
                                     <FormGroup>
                                         <input type="file" name="file" className="form-control" onChange={this.onChangeFile} />
                                     </FormGroup>
                                     <FormGroup>
                                         <Button type="submit" color="primary" block>Upload</Button>
                                     </FormGroup>
                                 </Form>
                             </Col>
                         </Row>
                         </div>
                   ) : <Spinner animation="border" role="status">
                   <span className="sr-only">Loading...</span>
                  </Spinner>} 
                </Container>
            </div>
        )
    }
}

const mapStateToProps=(state)=>({
    success:state.profReducer.success,
    error:state.error,
    user:state.profAuth.user
});

export default connect(mapStateToProps,{addDocument})(AddDocument);
