import React, { Component } from 'react';
import {Container,Alert, FormGroup,Form,Input,Button,Row,Col} from 'reactstrap';
import axios from 'axios';
import AppNavbar from './AppNavbar';
import {connect} from 'react-redux';
import {addEmploie} from '../../actions/admin/adminEtudiantActions';
import {clearSuccess} from '../../actions/admin/authActions';

class AddStudents extends Component {
    state={
        niveauFiliere:null,
        type:null,
        success:null,
        msg:null,
        file:null,
        semsetre:null,
        listNiveau:[]
    }
    componentWillMount(){
        this.props.clearSuccess();
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
            if(error.id=='ADD_EMPLOIE_FAIL'){
                this.setState({
                    msg:error.msg.msg,
                    success:null
                });
            }
            else{
                this.setState({msg:null})
            }
        }
        if(success!==prevProps.success){
            this.setState({
                success:'Etudiant enregistré avec succes',
                msg:null
            });
        }
    }
    onSubmit=(e)=>{
        e.preventDefault();
        const image=this.state.file
        const {type,niveauFiliere,semestre}=this.state;
        let formData=new FormData();
        formData.append("image",image);
        formData.append("semestre",semestre);
        formData.append("type",type);
        formData.append("niveauFiliere",niveauFiliere);
        this.props.addEmploie(formData);
    }
    render() {
        return (
            <div>
                <AppNavbar />
                <Container className="mt-5">
                    <h2 className="text-center">Ajouter Emploie</h2><br/>
                    <Alert color="info">
                        <div>Ici vous pouvez uploader les images des emplois du temp des cours ou ds selon le niveau!</div>
                    </Alert>
                    <Alert color="warning">
                        <div>Veuillez utilisé un fichier image!</div>
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
                                    <Input type="select" name="type" onChange={this.onChange}>
                                        <option>---Choisissez le type d'emploie---</option>
                                        <option value="cour">Cour</option>
                                        <option value="ds">Ds</option>
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Input type="select" name="semestre" onChange={this.onChange}>
                                        <option>---Choisissez le semestre---</option>
                                        <option value="s1">Semestre 1</option>
                                        <option value="s2">Semestre 2</option>
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Input type="select" name="niveauFiliere" onChange={this.onChange}>
                                        <option>---Choisissez le niveau---</option>
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

export default connect(mapStateToProps,{addEmploie,clearSuccess})(AddStudents);
