import React, { Component } from 'react';
import {Container,Alert, FormGroup,Form,Input,Button,Row,Col,Table,Modal,ModalHeader,ModalBody,ModalFooter} from 'reactstrap';
import axios from 'axios';
import AppNavbar from './AppNavbar';
import {connect} from 'react-redux';
import {listStudent,deleteStudent} from '../../actions/admin/adminEtudiantActions';

class ListStudents extends Component {
    state={
        niveauFiliere:null,
        success:null,
        listNiveau:[],
        users:[],
        msg:null,
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
        const {users}=this.props;
        if(users!==prevProps.users){
            this.setState({
                users
            });   
        }
    }
    onChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value,
        },()=>{
            const {niveauFiliere}=this.state;
            const body={
                niveauFiliere
            }
            this.props.listStudent(body);
        });
    }

    deleteEtudiant=(id)=>{
        this.props.deleteStudent(id);
        this.setState({
            isOpenDelete:!this.state.isOpenDelete
        })
    }

    render() {
        return (
            <div>
                <AppNavbar />
                <Container className="mt-5">
                    <h2 className="text-center">List Etudiants</h2><br/>
                    <Alert color="info">
                        <div>Ici vous pouvez Visualiser les étudiants selon chaque niveau!</div>
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
                                    <th>Nom</th>
                                    <th>Prenom</th>
                                    <th>Email</th>
                                    <th>CNE</th>
                                    <th>CIN</th>
                                    <th>Niveau</th>
                                    <th>Filiere</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.users.map((user)=>(
                                        <tr>
                                            <td>{user.nom}</td>
                                            <td>{user.prenom}</td>
                                            <td>{user.email}</td>
                                            <td>{user.cne}</td>
                                            <td>{user.cin}</td>
                                            <td>{user.niveauFiliere.niveau}</td>
                                            <td>{user.niveauFiliere.filiere}</td>
                                            <td><Button color="danger" onClick={()=>this.toggleDelete(user._id)}>Delete</Button></td>
                                        </tr>                                
                                ))}
                                <Modal isOpen={this.state.isOpenDelete} toggle={()=>this.toggleDelete(this.state.currentDelete)}>
                                    <ModalHeader toggle={()=>this.toggleDelete(this.state.currentDelete)}>Confirmation</ModalHeader>
                                        <ModalBody>
                                            T'es sure de supprimer cet étudiant?
                                        </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" onClick={()=>this.deleteEtudiant(this.state.currentDelete)}>Delete</Button>{' '}
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
    success:state.adminEtudiant.success,
    users:state.adminEtudiant.users,
    error:state.error
});

export default connect(mapStateToProps,{listStudent,deleteStudent})(ListStudents);
