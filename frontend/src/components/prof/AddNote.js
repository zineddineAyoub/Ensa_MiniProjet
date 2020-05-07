import React, { Component, Fragment } from 'react';
import {Container,Alert,Spinner, FormGroup,Form,Input,Button,Row,Col,Table,Modal,ModalHeader,ModalBody,ModalFooter} from 'reactstrap';
import axios from 'axios';
import AppNavbar from './AppNavbar';
import {connect} from 'react-redux';
import {EtudiantByNiveauFiliere,AjouterNote} from '../../actions/prof/profActions';

class AddNote extends Component {
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
    }
   
    componentWillMount(){
        console.log("hahah "+this.props.user);
        
        if(this.props.user)
        {
            console.log("it exist");
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
        console.log("hola");
       
        {this.props.users.map((data)=>(
            console.log("user"),
            
            console.log(data.nom)
            
        ))}

        const {users,user}=this.props;
        if(users!==prevProps.users){
            console.log("hola2"+this.props.users);
            
            this.setState({
                users
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
    onChange=(e)=>{
        this.state.users=[];
        this.setState({
            [e.target.name]:e.target.value,
        },()=>{
            axios.get(`http://localhost:5000/prof/NiveauFiliereByMatiere/${this.state.matiere}`)
            .then((res)=>{
                this.setState({
                    listFiliere:res.data,
                });
            });  
           
        });

        document.getElementById("select2").value = "";
        
    }

    onSubmitNote(){
        var oTable = document.getElementById('table');

//gets rows of table
        var rowLength = oTable.rows.length;

//loops through rows    
        for (var i = 1; i < rowLength; i++){

   //gets cells of current row
         var oCells = oTable.rows.item(i).cells;

   //gets amount of cells of current row
         var cellLength = oCells.length;

   //loops through each cell in current row
         for(var j = 0; j < cellLength; j++){
      /* get your cell info here */
      if(j==2)
      {
        console.log('Data are : '+document.getElementById(i).name+" "+document.getElementById(i).value);
        
        this.state.notes.push({matiere: this.state.matiere, etudiant:document.getElementById(i).name,note:document.getElementById(i).value,semestre:this.state.semestre});
      }
      
         }
        }
        console.log(this.state.notes);

        this.props.AjouterNote(this.state.notes)
    }

    onChange2=(e)=>{
        this.state.users=[];
        console.log([e.target.name]+" "+e.target.value);
        this.setState({filiereSelected:true,[e.target.name]:e.target.value});
       
    }

    onChange3=(e)=>{
        this.state.users=[];
        this.setState({
            semestre:e.target.value
          
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
            color:'#FFFFFF'
            
        }

        const color={
            color:'#FFFFFF'
        }
        
        const btn_back={
            background:'#E5E5BE',
            color:'#003973',
            
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
                                     <Input type="select" name="matiere" onChange={this.onChange}>
                                         <option value="">---Choisissez la matiere---</option>
                                         {this.state.listMatiere.map((data)=>(
                                             <option value={data._id}>{data.nom}</option>
                                         ))}
                                     </Input>
                                     
                                 </FormGroup>
                                 <FormGroup>
                                     <Input type="select" name="niveauFiliere" onChange={this.onChange2} id="select2" >
                                         <option value="">---Choisissez la filiere---</option>
                                         {this.state.listFiliere.map((data)=>(
                                             <option value={data.niveauFiliere._id}>{data.niveauFiliere.niveau} {data.niveauFiliere.filiere}</option>
                                         ))}
                                     </Input>
                                     
                                 </FormGroup>
                                 <FormGroup>
                                     <Input type="select" name="niveauFiliere" onChange={this.onChange3}>
                                         
                                         <option value="">---Choisissez le  Numero DS---</option>
                                        {this.state.filiereSelected ?(
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
                             <Table bordered id="table">
                                 <thead>
                                     <tr>
                                         <th>Nom</th>
                                         <th>Prenom</th>
                                         <th>Note</th>
                                     </tr>
                                 </thead>
                                 <tbody id="tbody">
                                     
                                     {this.state.users.map(

                                         (user)=>(
                                            this.state.counter=this.state.counter+1,
                                             <tr>
                                                 <td>{user.nom}</td>
                                                 <td>{user.prenom}</td>
                                                 <td><Input type="number" name={user._id} id={this.state.counter}  placeholder="Note"   /></td>
                                                 
                                             </tr>                                
                                     ))}
                                   
                                 </tbody>
                                
                          
                             </Table>
                             <Button style={btn_back}  onClick={()=>this.onSubmitNote()}>Edit</Button>
                             </Col>
                         </Row>
                         </div>
                       ) : 
                       <Spinner animation="border" role="status">
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
    success:state.profReducer.success,
    users:state.profReducer.users,
    error:state.error,
    user:state.profAuth.user,
});

export default connect(mapStateToProps,{EtudiantByNiveauFiliere,AjouterNote})(AddNote);
