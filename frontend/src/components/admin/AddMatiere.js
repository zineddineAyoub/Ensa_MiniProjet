import React, { Component } from 'react';
import {Container,Alert, FormGroup,Form,Input,Button,Row,Col,CustomInput,Spinner} from 'reactstrap';
import AppNavbar from './AppNavbar';
import {connect} from 'react-redux';
import axios from 'axios';
import {addMatiere} from '../../actions/admin/adminMatiereActions';
import {clearSuccess} from '../../actions/admin/authActions';

class AddMatiere extends Component {
    state={
        nom:null,
        niveauFiliere:[],
        prof:null,
        msg:null,
        success:null,
        profs:[],
        listNiveau:[],
        loading:true
    }

    componentWillMount(){
        this.props.clearSuccess();
        axios.get('http://localhost:5000/admin/getNiveauFiliere')
        .then((res)=>{
            this.setState({
                listNiveau:res.data,
                loading:false
            });
        })
        axios.get('http://localhost:5000/admin/allProf')
        .then((doc)=>{
            this.setState({
                profs:doc.data
            });
        })
    }
    onChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        });
    }

    componentDidUpdate(prevProps){
        const {error,success}=this.props;
        if(error!==prevProps.error){
            if(error.id=='ADD_MATIERE_FAIL'){
                this.setState({
                    msg:error.msg.msg,
                    success:null
                });
            }
            else{
                this.setState({msg:null})
            }
        }
        if(success!==prevProps.success && success==='ADD_MATIERE'){
            this.setState({
                success:'Matière ajouter avec succes',
                msg:null
            });
        }
    }

    onSubmit=(e)=>{
        e.preventDefault();
        const {nom,prof,niveauFiliere}=this.state;
        const body={
            nom,
            prof,
            niveauFiliere
        }
        this.props.addMatiere(body);
    }
    onChangeCheck=(e)=>{
        console.log(e.target.checked);
        if(e.target.checked){
            this.state.niveauFiliere.push(e.target.value);
            this.setState({
                niveauFiliere:this.state.niveauFiliere
            },()=>{
                console.log(this.state.niveauFiliere)
            });
        }
        else{
            this.state.niveauFiliere=this.state.niveauFiliere.filter(doc=>doc!==e.target.value)
            this.setState({
                niveauFiliere:this.state.niveauFiliere
            },()=>{
                console.log(this.state.niveauFiliere)
            })
        }
    }
    render() {
        return (
            <div>
                <AppNavbar />
                <Container className="mt-5">
                    <h2 className="text-center">Ajouter Une Matière</h2><br/>
                    <Alert color="info">
                        <div>Vous pouvez ajouter une matière directement ici !</div>
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
                            {this.state.loading ? <div className="text-center"><Spinner size="md" color="primary" /></div>:null }
                            <Form onSubmit={this.onSubmit}>
                                <FormGroup>
                                    {this.state.listNiveau.map((data)=>(
                                        <CustomInput type="checkbox" id={data._id} onChange={this.onChangeCheck} value={data._id} label={data.niveau+"/"+data.filiere} />
                                    ))}
                                </FormGroup>
                                <FormGroup>
                                    <Input type="select" name="prof" onChange={this.onChange}>
                                        <option>---Choisissez le professeur---</option>
                                        {this.state.profs.map((data)=>(
                                            <option value={data._id}>{data.nom}</option>
                                        ))}
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Input type="text" name="nom" placeholder="Entrer Nom Matière" onChange={this.onChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Button type="submit" color="primary" block>Submit</Button>
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
    success:state.adminMatiere.success,
    error:state.error
});

export default connect(mapStateToProps,{addMatiere,clearSuccess})(AddMatiere);
