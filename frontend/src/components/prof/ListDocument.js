import React, { Component, Fragment } from 'react';
import {Container,Alert,Spinner,FormGroup,Form,Input,Button,Row,Col,Table,Modal,ModalHeader,ModalBody,ModalFooter} from 'reactstrap';
import axios from 'axios';
import AppNavbar from './AppNavbar';
import {connect} from 'react-redux';
import {ListDocument} from '../../actions/prof/profActions';
import {Link} from 'react-router-dom';
class ListNotes extends Component {
    state={
        editedUser:{},
        isOpenEdit:false,
        matiere:null,
        success:null,
        listMatiere:[],
        users:[],
        msg:null,
        isOpenDelete:false,
        loaded:false,
        listFiliere:[],
        niveauFiliere:null,
        notes:[],
        counter:0,
        filiereSelected:false,
        semestre:0,
        exist:false,
        usersFiltered:[],
        emptylist:false,
        editing:false,
        noButton:true,
        editButtons:[],
        counters:[],
        popoverOpen:false,
        documents:[],
    }
   
    componentWillMount(){
        console.log("hahah "+this.props.user);
        
        if(this.props.user)
        {
            console.log("it exist"+this.props.user._id);
            axios.get(`http://localhost:5000/prof/afficherMatieres/${this.props.user._id}`)
            .then((res)=>{
                this.setState({
                    listMatiere:res.data,
                    loaded:true
                });
            });
        }
       
    }
    componentDidUpdate(prevProps){
     
        const {users,user,success,error}=this.props;

        if(error!==prevProps.error){
            if(error.id==='LIST_DOCUMENT_FAIL'){
                this.setState({
                    msg:error.msg.msg,
                    success:null,
                    exist:false
                });
            }
            else{
                this.setState({msg:null})
            }
        }

        if(success!==prevProps.success && success==='LIST_DOCUMENT'){
            this.setState({
                success:'List Found!',

                msg:null
            });
        }


        if(users!==prevProps.users  && Object.keys(users).length !==0 ){
        
            
            this.setState({
               documents:users,
               
                
            });   
        }
        if(user!==prevProps.user && Object.keys(user).length !==0){
            axios.get(`http://localhost:5000/prof/afficherMatieres/${this.props.user._id}`)
            .then((res)=>{
                this.setState({
                    listMatiere:res.data,
                    loaded:true
                });
            });  
        }
    }

    toggleEdit=(user)=>{
        this.setState({
            isOpenEdit:!this.state.isOpenEdit,
            editedUser:user
        })
    }

    editNote=(e)=>
    {
        const currentState = this.state.editedUser;
        console.log("old one" + currentState);
        const {name,value} = e.target;
        currentState[name] = value;
       
        
        this.setState({editedUser:currentState});
        console.log("new one"+currentState);

    }

    validerModification=()=>{

        this.setState({
            isOpenEdit:!this.state.isOpenEdit
        });

        
        const body = {
            _id:this.state.editedUser._id,
            note:this.state.editedUser.note
        }

        this.props.EditNote(body);        

    }

 
    onChange=(e)=>{
        this.setState({
            matiere:e.target.value,
        },()=>{
            this.props.ListDocument(this.state.matiere);
        });
    }

  
    render() {
        return (
            <div>
                <AppNavbar />
                <Container className="mt-5">
                   
                       {this.state.loaded ? (
                           <div>
                         <h2 className="text-center">Affichage des notes des étudiants </h2><br/>
                         <Alert color="info">
                             <div>Ici vous pouvez Consulter, Modifier la note des étudiants </div>
                         </Alert><br />
                         <Row>
                             <Col xs={3}></Col>
                             <Col xs={5}>
                                 <FormGroup>
                                     <Input type="select" name="matiere" onChange={this.onChange}>
                                         <option value="">---Choisissez la matiere---</option>
                                         {this.state.listMatiere.map((data)=>(
                                             <option value={data._id}>{data.nom}</option>
                                         ))}
                                     </Input>
                                     
                                 </FormGroup>
                                
                              
                             </Col>
                         </Row>
                         
                         <Row>
                             <Col xs={2}></Col>
                             <Col xs={7}>
                             {this.state.emptylist ? (
                             <Alert color="warning">
                             <div>La liste des notes n'existe pas !  </div>
                         </Alert>
                         ) :
                         null
                         }                                                   

                             <Table bordered id="table">
                                 <thead>
                                     <tr>
                                         <th>Nom</th>
                                         <th>Type</th>
                                         <th>Fichier</th>
                                        
                                     </tr>
                                 </thead>
                                 <tbody id="tbody">
                                       
                                            
                                            <Fragment>
                                            
                                              
                                                 {this.state.documents.map((document)=>(
                                              console.log(document),
                                              
                                              
                                            <tr>
                                            <td>{document.Nom} </td>
                                            <td>{document.Type} </td>
                                          
                                            <td> <a href='/Document/Cours/Cm0.pdf'>Click to download</a>
                                            </td>
                                                
                                                 <Button color="warning" onClick={()=>this.toggleEdit()} >Modifier</Button>
                                                 
                                                     </tr>  
                                                     
                                              ))}
                                              
                                            </Fragment>
                                       
                                 </tbody>
                                
                             </Table>
                            
    
                             </Col>
                         </Row>
                         
                         </div>
                       ) : 
                       <Spinner animation="border" role="status">
                       <span className="sr-only">Loading...</span>
                      </Spinner>
                      
                       }

                       {this.state.isOpenEdit ? (
                            <Modal isOpen={this.state.isOpenEdit} >
                                    
                            <ModalHeader toggle={()=>this.toggleEdit(null)}></ModalHeader>
                                <ModalBody>
                                  <input type="Number" placeholder="note"  onChange={this.editNote} name="note"/>
                                </ModalBody>
                            <ModalFooter>
                                <Button color="success" onClick={()=>this.validerModification()}>Valider</Button>{' '}
                                <Button color="secondary" onClick={()=>this.toggleEdit(null)}>Cancel</Button>
                            </ModalFooter>
                        </Modal>
                       ) : null}

                               
                </Container>
            </div>
        )
    }
}

const mapStateToProps=(state)=>({
    success:state.profReducer.success,
    users:state.profReducer.users,
    error:state.error,
    user:state.profAuth.user,
});

export default connect(mapStateToProps,{ListDocument})(ListNotes);
