import React, { Component } from 'react';
import {Container,Alert, FormGroup,Form,Input,Button,Row,Col,Table,Modal,ModalHeader,ModalBody,ModalFooter} from 'reactstrap';
import axios from 'axios';
import AppNavbar from './AppNavbar';
import {connect} from 'react-redux';
import {listMatiere,deleteMatiere} from '../../actions/admin/adminMatiereActions';

class ListMatieres extends Component {
    state={
        niveauFiliere:null,
        success:null,
        listNiveau:[],
        matieres:[],
        msg:null,
        niveau:null,
        filiere:null,
        isOpenDelete:false,
        currentDelete:null
    }
    toggleDelete=(id)=>{
        this.setState({
            isOpenDelete:!this.state.isOpenDelete,
            currentDelete:id
        })
    }
    componentWillMount(){
        axios.get('http://localhost:5000/admin/getNiveauFiliere')
        .then((res)=>{
            this.setState({
                listNiveau:res.data,
            });
        });
    }
    componentDidUpdate(prevProps){
        const {matieres}=this.props;
        if(matieres!==prevProps.matieres){
            this.setState({
                matieres
            });   
        }
    }
    onChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value,
        },()=>{
            const {niveauFiliere}=this.state;
            axios.get(`http://localhost:5000/admin/getNiveauFiliere/${niveauFiliere}`)
            .then(res=>{
                this.setState({
                    niveau:res.data.niveau,
                    filiere:res.data.filiere
                });
            });
            const body={
                niveauFiliere
            }
            this.props.listMatiere(body);
        });
    }

    onDeleteMatiere=(id)=>{
        this.props.deleteMatiere(id);
        //console.log(id);
        this.setState({
            isOpenDelete:!this.state.isOpenDelete
        })
    }

    render() {
        return (
            <div>
                <AppNavbar />
                <Container className="mt-5">
                    <h2 className="text-center">List Matières</h2><br/>
                    <Alert color="info">
                        <div>Ici vous pouvez Visualiser les matières selon chaque niveau!</div>
                    </Alert><br />
                    <Row>
                        <Col xs={3}></Col>
                        <Col xs={7}>
                            <FormGroup>
                                <Input type="select" name="niveauFiliere" onChange={this.onChange}>
                                    <option value="">---Choisissez le niveau---</option>
                                    {this.state.listNiveau.map((data)=>(
                                        <option value={data._id}>{data.niveau}{"/"+data.filiere}</option>
                                    ))}
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Table bordered>
                            <thead>
                                <tr>
                                    <th>Nom Matiere</th>
                                    <th>Niveau</th>
                                    <th>Filiere</th>
                                    <th>Nom Professeur</th>
                                    <th>Prenom Professeur</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.matieres.map((matiere)=>(
                                        <tr>
                                            <td><strong>{matiere.matiere.nom}</strong></td>
                                            <td>{matiere.niveauFiliere.niveau}</td>
                                            <td>{matiere.niveauFiliere.filiere}</td>
                                            <td>{matiere.matiere.prof.nom}</td>
                                            <td>{matiere.matiere.prof.prenom}</td>
                                            <td><Button color="secondary">Edit</Button></td>
                                            <td><Button color="danger" onClick={()=>this.toggleDelete(matiere.matiere._id)}>Delete</Button></td>
                                        </tr>                                
                                ))}
                                <Modal isOpen={this.state.isOpenDelete} toggle={()=>this.toggleDelete(this.state.currentDelete)}>
                                    <ModalHeader toggle={()=>this.toggleDelete(this.state.currentDelete)}>Confirmation</ModalHeader>
                                    <ModalBody>
                                        T'es sure de supprimer cette matière?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" onClick={()=>this.onDeleteMatiere(this.state.currentDelete)}>Delete</Button>{' '}
                                        <Button color="secondary" onClick={()=>this.toggleDelete(null)}>Cancel</Button>
                                    </ModalFooter>
                                </Modal>
                            </tbody>
                        </Table>
                    </Row>
                </Container>
            </div>
        )
    }
}

const mapStateToProps=(state)=>({
    success:state.adminMatiere.success,
    matieres:state.adminMatiere.matieres,
    error:state.error
});

export default connect(mapStateToProps,{listMatiere,deleteMatiere})(ListMatieres);
