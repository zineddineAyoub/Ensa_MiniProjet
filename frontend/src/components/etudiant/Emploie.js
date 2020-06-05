import React, { Component} from 'react';
import {Container,Alert,Spinner, FormGroup,Form,Input,Button,Row,Col,Table,Modal,ModalHeader,ModalBody,ModalFooter} from 'reactstrap';
import axios from 'axios';
import AppNavbar from './AppNavbar';
import {connect} from 'react-redux';

class Emploie extends Component {
    state={
        user:null,
        image:null,
        type:null,
        semestre:null,
        loaded:false,
        imageLoaded:false
    }

    componentWillMount(){
        
        if(this.props.user)
        {
            this.setState({
                niveauFiliere:this.props.user.niveauFiliere,
                loaded:true
            });
        }
       
    }

    componentDidUpdate(prevProps){
     
        const {user}=this.props;

        if(user!==prevProps.user && Object.keys(user).length !==0){
            this.setState({
                niveauFiliere:user.niveauFiliere,
                loaded:true
            });
        }
    }

    onChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        },()=>{
            const config={
                headers:{
                    'Content-type':'application/json'
                }
            }
            const {semestre,type,niveauFiliere}=this.state;
            const body=JSON.stringify({niveauFiliere,semestre,type});
            axios.post("http://localhost:5000/etudiant/getEmploie",body,config)
            .then((doc)=>{
                if(doc.data.length!==0){
                    this.setState({
                        image:doc.data[0].image,
                        imageLoaded:true
                    })
                }
                else{
                    this.setState({
                        image:null,
                        imageLoaded:false
                    })
                }
            });
        })
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
            <div>
                <AppNavbar />
                <div style={styling}>
                    <Container className="mt-5">
                        <div>
                            <h2 className="text-center">Emploie </h2><br/>
                            <Alert color="info">
                                <div>Ici vous pouvez consulter votre emploie !</div>
                            </Alert><br />
                            <Row>
                                <Col xs={6}>
                                    {this.state.loaded ? (
                                    <Form>
                                        <Row>
                                            <Col xs={8}>
                                                <FormGroup>
                                                    <Input type="select" name="semestre" onChange={this.onChange}>
                                                        <option value="0">---Choisissez le semestre---</option>
                                                        <option value="s1">Semestre 1</option>
                                                        <option value="s2">Semestre 2</option>
                                                    </Input>
                                                    
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={8}>
                                                <FormGroup>
                                                    <Input type="select" name="type" onChange={this.onChange}>
                                                        <option value="0">---Choisissez la type---</option>
                                                        <option value="cour">Cours</option>
                                                        <option value="ds">Ds</option>
                                                    </Input>
                                                    
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Form>):<Spinner color="primary" style={spinning}>
                                        </Spinner>}
                                </Col>
                                
                                <Col xs={6}>
                                    {this.state.imageLoaded ? (
                                      <div style={{marginLeft:"-100px"}}>
                                            <Alert color="success">
                                                <div>Lien pour voir l'image en gros 
                                                    <a href={`http://localhost:5000/emploie/${this.state.image}`} download target="_blank">
                                                        <strong> Ici</strong>
                                                    </a>
                                                </div>
                                            </Alert>

                                            <img src={`http://localhost:5000/emploie/${this.state.image}`} width="638px" height="350px" /><br />
                                      </div>  
                                    ):null}
                                </Col>
                            </Row>
                        </div>
                    </Container>
                </div>  
            </div>
        )
    }
}

const mapStateToProps=(state)=>({
    error:state.error,
    user:state.etudiantAuth.user,
});

export default connect(mapStateToProps)(Emploie);
