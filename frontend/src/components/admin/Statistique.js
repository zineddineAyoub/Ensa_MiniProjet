import React, { Component } from 'react';
import {Container,Alert, FormGroup,Form,Input,Button,Row,Col} from 'reactstrap';
import AppNavbar from './AppNavbar';
import {connect} from 'react-redux';
import axios from 'axios';
import {addStudent} from '../../actions/admin/adminEtudiantActions';

class Statistique extends Component {
    state={
        nom:null,
        prenom:null,
        cne:null,
        cin:null,
        email:null,
        niveauFiliere:null,
        listNiveau:[],
        msg:null,
        success:null
    }
    componentWillMount(){
        axios.get('http://localhost:5000/admin/getNiveauFiliere')
        .then((res)=>{
            this.setState({
                listNiveau:res.data
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
            if(error.id=='ADD_STUDENT_FAIL'){
                this.setState({msg:error.msg.msg});
            }
            else{
                this.setState({msg:null})
            }
        }
        if(success!==prevProps.success && success==='ADD_STUDENT'){
            this.setState({
                success:'Etudiant Enregistrer avec succes',
                msg:null
            });
        }
    }

    render() {
        return (
            <div>
                <AppNavbar />
                <Container className="mt-5">
                    <h2 className="text-center">Statistique</h2><br/>
                    <Alert color="info">
                        <div>Statistique selon chaque niveau et filière!</div>
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
                                        <option>---Choisissez le niveau---</option>
                                        {this.state.listNiveau.map((data)=>(
                                            <option value={data._id}>{data.niveau}{"/"+data.filiere}</option>
                                        ))}
                                    </Input>
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
    success:state.adminEtudiant.success,
    error:state.error
});

export default connect(mapStateToProps,{addStudent})(Statistique);
