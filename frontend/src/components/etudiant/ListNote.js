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
                users,
                exist:true,
                
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



    onChange3=(e)=>{
        this.state.users=[];
        this.setState({
            semestre:e.target.value,
        },()=>{   
            const body={
                etudiant:this.state.user._id,
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
      
        const spinning={
           
            display:'flex',
            alignItems:"center",
            justifyContent:"center"
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
                                     <Input type="select" name="semestre"  id="select3">
                                         
                                         <option value="">---Choisissez le Numero DS---</option>
                                        
                                            <Fragment>
                                            <option value="1"> DS 1</option>
                                            <option value="2"> DS 2</option>
                                            <option value="3"> TP </option>
                                            </Fragment>
                                            
                                     </Input>
                                     
                                 </FormGroup>
                             </Col>
                        
                         
                         
                             <Col xs={1}></Col>
                             <Col xs={7}>
                                                                                

                             <Table bordered id="table">
                                 <thead>
                                     <tr>
                                         <th>Matiere</th>
                                         <th>DS1</th>
                                         <th>DS2</th>
                                         <th></th>
                                      
                                        
                                     </tr>
                                 </thead>
                                 <tbody id="tbody">
                                               
                                            <Fragment>
                                              
                                                 {this.state.listMatiere.map((matiere)=>(
                                            
                                            <tr>
                                            <td>{matiere.matiere.nom} </td>
                                         
                                               
                                                     </tr>  
                                                     
                                              ))}
                                              
                                            </Fragment>
                                       
                                 </tbody>
                                
                             </Table>
                            
    
                             </Col>
                         </Row>
                         
                         </div>
                       ) : 
                       <Spinner animation="border" role="status" style={spinning}>
                       <span className="sr-only">Loading...</span>
                      </Spinner>
                      
                       }
          
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
