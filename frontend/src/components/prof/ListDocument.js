import React, { Component, Fragment } from 'react';
import {Container,Alert,Spinner,FormGroup,Form,Input,Button,Row,Col,Table,Modal,ModalHeader,ModalBody,ModalFooter, Label} from 'reactstrap';
import axios from 'axios';
import AppNavbar from './AppNavbar';
import {connect} from 'react-redux';
import {ListDocument,ModifierDocument,deleteDocument} from '../../actions/prof/profActions';
import {Link} from 'react-router-dom';
class ListNotes extends Component {
    state={
        editedUser:{},
        isOpenEdit:false,
        matiere:null,
        success:null,
        currentDelete:null,
        listMatiere:[],
        users:[],
        msg:null,
        isOpenDelete:false,
        loaded:false,    
        filiereSelected:false,
        exist:false,
        documents:[],
        document:{},
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

    toggleEdit=(document)=>{
        this.setState({
            isOpenEdit:!this.state.isOpenEdit,
            document:document
        })
    }

    toggleDelete=(id)=>{
        this.setState({
            isOpenDelete:!this.state.isOpenDelete,
            currentDelete:id
        })
        
        
    }

    validerSuppression=(id=>{
        this.props.deleteDocument(id);
        this.setState({
            isOpenDelete:!this.state.isOpenDelete
        })
    })

    onChangeModel=(e)=>
    {
        const currentDocument = this.state.document;
        console.log("old one" + currentDocument);
        const {name,value} = e.target;
      
        if(name=="Fichier")
        {
            currentDocument[name]=e.target.files[0]
        }

        else{
            currentDocument[name] = value;
        }
        

        this.setState({document:currentDocument});
        console.log("new one"+currentDocument);

    }

    validerModification=()=>{

        this.setState({
            isOpenEdit:!this.state.isOpenEdit
        });

        const document=this.state.document;
        let formData=new FormData();

        formData.append("nom",document.Nom);
        formData.append("type",document.Type);
        formData.append("_id",document._id);
        formData.append("file",document.Fichier);

        this.props.ModifierDocument(formData);
    }

 
    onChange=(e)=>{

        this.setState({
            matiere:e.target.value,
            documents:[]
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
                         <h2 className="text-center">La List des documents </h2><br/>
                         <Alert color="info">
                             <div>Ici vous pouvez Consulter, Modifier, Supprimer vos documents </div>
                         </Alert><br />
                         <Row>
                             
                             <Col xs={4}>
                                 <FormGroup>
                                     <Input type="select" name="matiere" onChange={this.onChange}>
                                         <option value="">---Choisissez la matiere---</option>
                                         {this.state.listMatiere.map((data)=>(
                                             <option value={data._id}>{data.nom}</option>
                                         ))}
                                     </Input>
                                     
                                 </FormGroup>
                                
                             </Col>
                            <Col xs={1}></Col>
                             <Col xs={7}>
                                                                             

                             <Table bordered id="table">
                                 <thead>
                                     <tr>
                                         <th>Nom</th>
                                         <th>Type</th>
                                         <th>Fichier</th>
                                         <th>Modifier</th>
                                         <th>Supprimer</th>
                                      </tr>
                                 </thead>
                                 <tbody id="tbody">
                                       
                                            
                                            <Fragment>
                                            
                                              
                                                 {this.state.documents.map((document)=>(
                                              console.log(document),
                                              
                                              
                                            <tr>
                                            <td>{document.Nom} </td>
                                            <td>{document.Type} </td>
                                          
                                            <td> <a style={{display: "table-cell"}}  target="_blank" href={"http://localhost:5000/Document/"+document.Type+"/"+document.Fichier} class="text-primary" download>Click to download</a>
                                            </td>
                                                <td>
                                                 <Button color="warning" onClick={()=>this.toggleEdit(document)} >Modifier</Button>
                                                 </td>

                                                 <td>
                                                 <Button color="danger" onClick={()=>this.toggleDelete(document._id)} >Supprimer</Button>
                                                 </td>
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
                                    
                            <ModalHeader toggle={()=>this.toggleEdit(null)}>Modifier document</ModalHeader>
                                <ModalBody>
                                 
                                 
                                <FormGroup >
                                <Label for="exampleSelectMulti">Nom Document</Label>
                                    <Input type="text" placeholder="note"  defaultValue={this.state.document.Nom} onChange={this.onChangeModel} name="Nom" />
                                </FormGroup>
                                </ModalBody>
                                <ModalBody>
                                <FormGroup>
                                <Label >Type Document</Label>
                                <Input type="select" defaultValue={this.state.document.Type} name="Type" onChange={this.onChangeModel}>
                                             <option>---Type de document---</option>
                                            
                                                 <option value="Cours">Cours</option>
                                                 <option value="TD">TD</option>
                                                 <option value="TP">TP</option>
                                           
                                         </Input>
                               </FormGroup>
                               </ModalBody>
                               <ModalBody>
                                <FormGroup>
                                <Label >Remplacer document</Label>
                                    <Input type="file" placeholder="note"  onChange={this.onChangeModel} name="Fichier" />
                                </FormGroup>
                               
                            
                                </ModalBody>
                            <ModalFooter>
                                <Button color="success" onClick={()=>this.validerModification()}>Valider</Button>{' '}
                                <Button color="secondary" onClick={()=>this.toggleEdit(null)}>Cancel</Button>
                            </ModalFooter>
                        </Modal>
                       ) : null}



                            {this.state.isOpenDelete ? (
                            <Modal isOpen={this.state.isOpenDelete} toggle={()=>this.toggleDelete(this.state.currentDelete)} >
                                    
                            <ModalHeader toggle={()=>this.toggleDelete(null)}>Etes vous sùr de vouloir supprimer ce document ! </ModalHeader>
                           
                            <ModalFooter>
                                <Button color="danger" onClick={()=>this.validerSuppression(this.state.currentDelete)}>Supprimer</Button>{' '}
                                <Button color="secondary" onClick={()=>this.toggleDelete(null)}>Cancel</Button>
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

export default connect(mapStateToProps,{ListDocument,ModifierDocument,deleteDocument})(ListNotes);
