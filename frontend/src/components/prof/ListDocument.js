import React, { Component, Fragment } from 'react';
import {Container,Alert,Spinner,FormGroup,Form,Input,Button,Row,Col,Table,Modal,ModalHeader,ModalBody,ModalFooter, Label,Card,CardBody} from 'reactstrap';
import axios from 'axios';
import AppNavbar from './AppNavbar';
import {connect} from 'react-redux';
import {ListDocument,ModifierDocument,deleteDocument} from '../../actions/prof/profActions';
import {getComments,postComment} from '../../actions/commentActions';
import {Link} from 'react-router-dom';
import ExampleComponent from "react-rounded-image";
class ListDocuments extends Component {
    state={
        editedUser:{},
        isOpenEdit:false,
        matiere:null,
        success:null,
        currentDelete:null,
        currentCommentaire:null,
        listMatiere:[],
        users:[],
        msg:null,
        isOpenDelete:false,
        isOpenCommentaire:false,
        loaded:false,    
        filiereSelected:false,
        exist:false,
        documents:[],
        document:{},
        comments:[],
        comment:null,
        test:'lol'
    }
   
    componentWillMount(){
        
        if(this.props.user)
        {
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
     
        const {users,user,success,error,comments}=this.props;

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
        console.log(Object.keys(comments).length)
        console.log("9dima "+Object.keys(prevProps.comments).length)
        if(comments!==prevProps.comments && Object.keys(comments).length !==0){
            console.log(comments);
            this.setState({
                comments
            })
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

    toggleCommentaire=(id)=>{
        this.setState({
            isOpenCommentaire:!this.state.isOpenCommentaire,
            currentCommentaire:id,
            comments:[]
        },()=>{
            this.props.getComments(this.state.currentCommentaire);
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
        const {name,value} = e.target;
      
        if(name=="Fichier")
        {
            currentDocument[name]=e.target.files[0]
        }

        else{
            currentDocument[name] = value;
        }
        

        this.setState({document:currentDocument});

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

    onChangeComment=(e)=>{
        console.log(e.target.value)
        this.setState({
            comment:e.target.value
        });
    }

    onSubmit=(e)=>{
        e.preventDefault();
        const message=this.state.comment;
        const document=this.state.currentCommentaire;
        const type="prof";
        const idSender=this.props.user._id;
        const body={
            message,
            type,
            document,
            idSender
        }
        this.props.postComment(body);
        this.setState({
            comment:''
        })
    }

  
    render() {

        const styling={
            background: 'linear-gradient(to top, #97aba4, #003973)',
            color:"#FFFFFF",
             display:'flex',
             height:"100vh"
            
        }

        const height = {
            overflowY:'',
            height:"60vh",
            width:"100vh"
        }

        const table={
            background : '#FFFFFF',
        
        }
        
        const spinner={ position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      color:'#FFFFFF'
  }


        return (
            <div >
                <AppNavbar />
                <div style={styling}>
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
                                         <option value="0">---Choisissez la matiere---</option>
                                         {this.state.listMatiere.map((data)=>(
                                             <option value={data._id}>{data.nom}</option>
                                         ))}
                                     </Input>
                                     
                                 </FormGroup>
                                
                             </Col>
                            <Col xs={1}></Col>
                             <Col xs={7}>
                                            
                            {!this.state.documents? (
                                    height.overflowY='scroll'
                            ): 
                            null
                            }
                                                                         
                              <div style={height}>
                             <Table bordered id="table" style={table}>
                                 <thead>
                                     <tr>
                                         <th>Nom</th>
                                         <th>Type</th>
                                         <th>Fichier</th>
                                         <th>Modifier</th>
                                         <th>Supprimer</th>
                                         <th>Commentaire</th>
                                      </tr>
                                 </thead>
                                 <tbody id="tbody">
                                       
                                            
                                            <Fragment>
                                                 {this.state.documents.map((document)=>(
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
                                                 <td>
                                                    <Button color="primary" onClick={()=>this.toggleCommentaire(document._id)} >Commentaire</Button>
                                                 </td>
                                                     </tr>  
                                                     
                                              ))}
                                              
                                            </Fragment>
                                       
                                 </tbody>
                                
                             </Table>
                             </div>
                            
    
                             </Col>
                         </Row>
                         
                         </div>
                       ) : 
                       <div style={spinner}><Spinner /></div>
                      
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

                        {this.state.isOpenCommentaire ? (
                            <Modal isOpen={this.state.isOpenCommentaire} toggle={()=>this.toggleCommentaire(this.state.currentCommentaire)} >
                                    
                                <ModalHeader toggle={()=>this.toggleCommentaire(null)}>Liste de commentaire</ModalHeader>
                                <ModalBody style={{height:'400px',overflowY:'scroll'}}>
                                    {this.state.comments.map(comment=>(
                                                <Row>
                                                    {comment.prof ? (
                                                        <p style={{width:'100%'}}><img style={{float:'left',height:'50px',width:'50px',borderRadius:'50%',margin: '0 20px 20px 15px'}} src={`http://localhost:5000/photoProfile/prof/${comment.prof.image}`} />
                                                            <p>
                                                                <b>{comment.prof.nom +' '+comment.prof.prenom}</b>{'    '}
                                                                <i>{comment.postDate}</i>
                                                                <br/>
                                                                <p>
                                                                {comment.message}
                                                                </p>
                                                            </p>
                                                        </p>
                                                    ):null}
                                                    {comment.etudiant ? (
                                                        <p style={{width:'100%'}}><img style={{float:'left',height:'50px',width:'50px',borderRadius:'50%',margin: '0 20px 20px 15px'}} src={`http://localhost:5000/photoProfile/etudiant/${comment.etudiant.image}`} />
                                                            <p>
                                                                <b>{comment.etudiant.nom +' '+comment.etudiant.prenom}</b>{'    '}
                                                                <i>{comment.postDate}</i>
                                                                <br/>
                                                                <p>
                                                                {comment.message}
                                                                </p>
                                                            </p>
                                                        </p>
                                                    ):null}
                                                </Row>
                                    ))}
                                </ModalBody>
                                <ModalFooter>
                                    <Form onSubmit={this.onSubmit}>
                                        <Row>
                                            <Col xs={10} style={{marginLeft:'-15px'}}>
                                                <Input type="text" placeholder="Commenter ici!" name="comment" value={this.state.comment} onChange={this.onChangeComment} />
                                            </Col>
                                            <Col xs={1} style={{marginLeft:'-27px'}}>
                                                <Button color="primary">Send</Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </ModalFooter>
                            </Modal>
                       ) : null}              
                </Container>
                </div>
            </div>
        )
    }
}

const mapStateToProps=(state)=>({
    success:state.profReducer.success,
    users:state.profReducer.users,
    error:state.error,
    user:state.profAuth.user,
    comments:state.comment.comments
});

export default connect(mapStateToProps,{ListDocument,ModifierDocument,deleteDocument,getComments,postComment})(ListDocuments);
