import React, { Component } from 'react';
import {Container,Alert, FormGroup,Form,Input,Button,Row,Col} from 'reactstrap';
import axios from 'axios';
import AppNavbar from './AppNavbar';
import {connect} from 'react-redux';
import {addStudents} from '../../actions/admin/adminEtudiantActions';
import {clearSuccess} from '../../actions/admin/authActions';

class AddStudents extends Component {
    state={
        niveauFiliere:"erreur",
        success:null,
        msg:null,
        file:null,
        listNiveau:[],
    }

    componentWillMount(){
        this.state.clearSuccess();
    }
    componentWillMount(){
        console.log(this.state.listNiveau);
        axios.get('http://localhost:5000/admin/getNiveauFiliere')
        .then((res)=>{
            this.setState({
                listNiveau:res.data
            });
        });
    }

    onChangeImage=(e)=>{
        this.setState({
            file:e.target.files[0]
        });
    }

    onChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        });
    }
    componentDidUpdate(prevProps){
        const {error,success}=this.props;
        if(error!==prevProps.error){
            if(error.id=='ADD_STUDENTS_FAIL'){
                this.setState({
                    msg:error.msg.msg,
                    success:null
                });
            }
            else{
                this.setState({msg:null})
            }
        }
        if(success!==prevProps.success && success==='ADD_STUDENTS'){
            this.setState({
                success:'Tout les étudiants enregistré avec succés',
                msg:null
            });
        }
    }

    onSubmit=(e)=>{
        e.preventDefault();
        const file=this.state.file;
        const {niveauFiliere}=this.state;
        let formData=new FormData();
        formData.append("niveauFiliere",niveauFiliere);
        formData.append("file",file);
        this.props.addStudents(formData);
    }
    render() {
        return (
            <div>
                <AppNavbar />
                <Container className="mt-5">
                    <h2 className="text-center">Ajouter les étudiants</h2><br/>
                    <Alert color="info">
                        <div>Ici vous pouvez uploader tous les étudiants avec un fichier!</div>
                    </Alert>
                    <Alert color="warning">
                        <div>Veuillez utilisé un fichier csv!</div>
                    </Alert><br/>
                    <Row>
                        <Col xs={3}></Col>
                        <Col xs={7}>
                            {this.state.msg ? <Alert color="danger">
                                {this.state.msg}
                            </Alert>:null}
                            {this.state.success ? <Alert color="success">
                                {this.state.success}
                            </Alert>:null}
                            <Form onSubmit={this.onSubmit}>
                                <FormGroup>
                                    <Input type="select" name="niveauFiliere" onChange={this.onChange}>
                                        <option value="erreur">---Choisissez le niveau---</option>
                                        {this.state.listNiveau.map((data)=>(
                                            <option value={data._id}>{data.niveau}{"/"+data.filiere}</option>
                                        ))}
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <input type="file" className="form-control" onChange={this.onChangeImage} />
                                </FormGroup>
                                <FormGroup>
                                    <Button type="submit" color="primary" block>Upload</Button>
                                </FormGroup>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

const mapStateToProps=(state)=>({
    success:state.adminEtudiant.success,
    error:state.error
});

export default connect(mapStateToProps,{addStudents,clearSuccess})(AddStudents);
