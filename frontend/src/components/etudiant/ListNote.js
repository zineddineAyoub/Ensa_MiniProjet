import React, { Component, Fragment } from 'react';
import {Container,Alert,Spinner, FormGroup,Form,Input,Button,Row,Col,Table,Modal,ModalHeader,ModalBody,ModalFooter} from 'reactstrap';
import axios from 'axios';
import AppNavbar from './AppNavbar';
import {connect} from 'react-redux';
import {ListNote} from '../../actions/etudiant/etudiantActions';

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
        matiereSelected:false,
        semestre:0,
        exist:false,
        usersFiltered:[],
        emptylist:false,
        editing:false,
        noButton:true,
        editButtons:[],
        counters:[],
        popoverOpen:false,
    }
   
    componentWillMount(){
       
        if(this.props.user)
        {
            axios.get(`http://localhost:5000/etudiant/getMatiere/${this.props.user.niveauFiliere}`)
            .then((res)=>{
                this.setState({
                    listMatiere:res.data,
                    loaded:true,   
                });

                console.log("myy matieres"+this.state.listMatiere);
                
            });
        }
       
       
    }
    componentDidUpdate(prevProps){
     
        const {users,user,success,error}=this.props;

        if(error!==prevProps.error){
            if(error.id==='LIST_NOTE_FAIL'){
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

        if(success!==prevProps.success && success==='LIST_NOTE'){
            this.setState({
                success:'List Found!',

                msg:null
            });
        }

        if(success==='LIST_NOTE' && Object.keys(users).length==0)
        {
            console.log("greaate bitches");
            
            this.state.emptylist=true;
            
        }

        if(users!==prevProps.users  && Object.keys(users).length !==0 ){
            // this.state.emptylist=false
             console.log("USER CHANGED ===>"+this.props.users);
                 this.setState({
                     users,//:this.state.usersFiltered,
                     exist:true,
                     emptylist:false  
                 });  
         }
 
         else if(users!==prevProps.users && Object.keys(users).length ==0)
         {
             console.log("USER CHANGED ===>"+this.props.users);
                 this.setState({
                     users,//:this.state.usersFiltered,
                     exist:true,
                     emptylist:true    
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

    onChange=(e)=>{
        this.state.users=[];
        this.setState({
            [e.target.name]:e.target.value,
            matiereSelected:true
        });
    }



    onChange3=(e)=>{
        this.state.users=[];
        this.setState({
            semestre:e.target.value,
            niveauFiliere:this.props.user.niveauFiliere,
            emptylist:false
        },()=>{   
            const body={
               niveauFiliere:this.state.niveauFiliere,
               matiere:this.state.matiere,
             semestre:this.state.semestre
            }
            this.props.ListNote(body);
        });
    }

  
    render() {
      

        const styling={
            background: 'linear-gradient(to top, #97aba4, #003973)',
            height:'100vh',
            display:'flex',
            color:'#FFFFFF'
            
        }

        const color={
            color:'#FFFFFF'
        }
      
        const spinner={ position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        color:'#FFFFFF'
    }

        
        const table={
            background : '#FFFFFF'
        } 

        return (
            <div >
                <AppNavbar />
                <div style={styling}>
                <Container className="mt-5">
                   
                       {this.state.loaded ? (
                           <div>
                         <h2 className="text-center" >Affichage des notes des étudiants </h2><br/>
                         <Alert color="info">
                             <div>Ici vous pouvez Consulter, Modifier la note des étudiants </div>
                         </Alert><br />
                         <Row>
                             
                             <Col xs={4}>
                                 <FormGroup>
                                     <Input type="select" name="matiere" onChange={this.onChange}>
                                         <option value="">---Choisissez la matiere---</option>
                                         {this.state.listMatiere.map((data)=>(
                                             <option value={data.matiere._id}>{data.matiere.nom}</option>
                                         ))}
                                     </Input>
                                     
                                 </FormGroup>
                                 <FormGroup>
                                     <Input type="select" name="niveauFiliere" onChange={this.onChange3} id="select3">
                                         
                                         <option value="">---Choisissez le Numero DS---</option>
                                        {this.state.matiereSelected ?(
                                            <Fragment>
                                            <option value="1"> DS 1</option>
                                            <option value="2"> DS 2</option>
                                            <option value="3"> TP </option>
                                            </Fragment>
                                            
                                        ): 
                                        <span></span>
                                        }
                                        
                                        
                                     </Input>
                                     
                                 </FormGroup>
                             </Col>
                        
                         
                         
                             <Col xs={1}></Col>
                             <Col xs={7}>
                             {this.state.emptylist ? (
                             <Alert color="warning">
                             <div>Cette liste des notes n'existe pas !  </div>
                         </Alert>
                         ) :
                         null
                         }                                                   

                             <Table bordered id="table" style={table} className="text-center">
                                 <thead>
                                     <tr>
                                         <th>Nom</th>
                                         <th>Prenom</th>
                                         <th>Note</th>
                                       </tr>
                                 </thead>
                                 <tbody id="tbody">
                                        {!this.state.emptylist ? (
                                            
                                            <Fragment>
                                              
                                                 {this.state.users.map((user)=>(
                                              
                                            <tr>
                                            <td>{user.etudiant.nom} </td>
                                            <td>{user.etudiant.prenom} </td>
                                          
                                            <td>{user.note}</td>
                                                     </tr>  
                                                     
                                              ))}
                                              
                                            </Fragment>
                                        ) : 
                                        null
                                        }
                                 </tbody>
                                
                             </Table>
                            
    
                             </Col>
                         </Row>
                         
                         </div>
                       ) : 
                       <div style={spinner}><Spinner /></div>
                      
                       }

                       {this.state.isOpenEdit ? (
                            <Modal isOpen={this.state.isOpenEdit} >
                                    
                            <ModalHeader toggle={()=>this.toggleEdit(null)}>{this.state.editedUser.etudiant.nom} {this.state.editedUser.etudiant.prenom}</ModalHeader>
                                <ModalBody>
                                  <input type="Number" placeholder="note" defaultValue={this.state.editedUser.note} onChange={this.editNote} name="note"/>
                                </ModalBody>
                            <ModalFooter>
                                <Button color="success" onClick={()=>this.validerModification()}>Valider</Button>{' '}
                                <Button color="secondary" onClick={()=>this.toggleEdit(null)}>Cancel</Button>
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
    success:state.etudiantReducer.success,
    users:state.etudiantReducer.users,
    error:state.error,
    user:state.etudiantAuth.user,
});

export default connect(mapStateToProps,{ListNote})(ListNotes);
