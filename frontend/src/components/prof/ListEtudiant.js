import React, { Component, Fragment } from 'react';
import {Container,Alert,Spinner, FormGroup,Form,Input,Button,Row,Col,Table,Modal,ModalHeader,ModalBody,ModalFooter} from 'reactstrap';
import axios from 'axios';
import AppNavbar from './AppNavbar';
import {connect} from 'react-redux';
import icon from '../../ressources/icons8-more-info-64.png';
import {EtudiantByNiveauFiliere,AjouterNote} from '../../actions/prof/profActions';
import ExampleComponent from "react-rounded-image";
import {Link} from 'react-router-dom';

class ListEtudiant extends Component {
    state={
        matiere:null,
        success:null,
        listMatiere:[],
        users:[],
        msg:null,
        isOpenDelete:false,
        currentDelete:null,
        loaded:false,
        listFiliere:[],
        niveauFiliere:null,
        notes:[],
        counter:0,
        filiereSelected:false,
        semestre:0,
        listNiveau:[]
    }
   
    componentWillMount(){
        console.log("hahah "+this.props.user);
        
        if(this.props.user)
        {
            console.log("it exist");
            axios.post(`http://localhost:5000/prof/afficherNiveauFiliere/${this.props.user._id}`)
            .then((res)=>{
                 this.setState({
                    listNiveau:res.data,
                    loaded:true
                });
             });
        }
       
    }
    componentDidUpdate(prevProps){
        console.log("hola");
        const {error,success}=this.props;
        {this.props.users.map((data)=>(
            console.log("user"),
            
            console.log(data.nom)
            
        ))}

        if(success!==prevProps.success && success==='AJOUTER_NOTE'){
            this.setState({
                success:'Note Ajouter Avec Succées',
                msg:null
            });
        }

        const {users,user}=this.props;
        if(users!==prevProps.users){
            console.log("hola2"+this.props.users);
            
            this.setState({
                users
            });   
        }
        if(user!==prevProps.user && Object.keys(user).length !==0){
            axios.post(`http://localhost:5000/prof/afficherNiveauFiliere/${this.props.user._id}`)
            .then((res)=>{
                 this.setState({
                    listNiveau:res.data,
                    loaded:true
                });
             }); 
        }
    }
    onChange=(e)=>{
        this.state.users=[];
        this.setState({
            niveauFiliere:e.target.value
          
        },()=>{
            
           console.log(`http://localhost:5000/prof/EtudiantByNiveauFiliere/${this.state.niveauFiliere}`);
           
            this.props.EtudiantByNiveauFiliere(this.state.niveauFiliere)
           
        });
      
        
    }

    render() {
        const styling={
            background: 'linear-gradient(to top, #97aba4, #003973)',
            height:'100vh',
            display:'flex',
            color:'#FFFFFF',
           
        }

        const color={
            fullwidth:"false"   
        }

        const table={
            background : '#FFFFFF'
        }
        
        const btn_back={
            background:'#FFFFFF',
            color:'#003973',
            
        }

        const spinner={ position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      color:'#FFFFFF'
  }

        return (
            <div>
                <AppNavbar />
                <div style={styling}>
                <Container className="mt-5">
                   
                       {this.state.loaded ? (
                           <div>
                         <h2 className="text-center" >Ajouter les notes d'un module </h2><br/>
                         <Alert color="info">
                             <div>Ici vous pouvez Affecter à chaque étudiant sa propre note ! </div>
                         </Alert><br />
                         <Row>
                             
                             <Col xs={4}>
                             
                                 <FormGroup>
                                     <Input type="select" name="matiere" onChange={this.onChange} id="select1">
                                         <option value="">---Choisissez le niveau---</option>
                                         {this.state.listNiveau.map((data)=>(
                                             console.log(data),
                                             
                                             <option value={data.niveauFiliere._id}>{data.niveauFiliere.niveau} {data.niveauFiliere.filiere}</option>
                                         ))}
                                     </Input>
                                     
                                 </FormGroup>
                               
                             </Col>
                         
                             <Col xs={1}></Col>
                             <Col xs={7}>
                             {this.state.success ? <Alert color="success">
                                {this.state.success}
                            </Alert>:null}
                             <Table bordered id="table" style={table} className="text-center">
                                 <thead>
                                     <tr>
                                         <th>Photo</th>
                                         <th >Nom</th>
                                         <th>Prenom</th>
                                         <th>Voir Profile</th>
                                         
                                     </tr>
                                 </thead>
                                 <tbody id="tbody">
                                     
                                     {this.state.users.map(

                                         (user)=>(
                                            this.state.counter=this.state.counter+1,
                                             <tr>
                                                 <td>
                                                     <div className="d-flex justify-content-center" >
                                                     <ExampleComponent 
                                roundedColor="#FFFFFF"
                                imageWidth="70"
                                imageHeight="70"
                                roundedSize="2"
                                image={ require(`../../../../public/photoProfile/etudiant/${user.image}`)} />
                               
                                                     </div>
                                                 
                                                 </td>
                                                 <td className="fas fa-weight">{user.nom}</td>
                                                 <td>{user.prenom}</td>
                                                 <td> <Link to={`/prof/AfficherProfileEtudiant/${user._id}`}   style={{textDecoration:'none'}}>
                                                 <img  src={icon}  alt="fireSpot"/>  </Link>
                                  </td>
                                                 </tr>                                
                                     ))}
                                   
                                 </tbody>
                                
                          
                             </Table>
                             </Col>
                         </Row>
                         </div>
                       ) : 
                       <div style={spinner}><Spinner /></div>
                       }
                   
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
});

export default connect(mapStateToProps,{EtudiantByNiveauFiliere,AjouterNote})(ListEtudiant);
