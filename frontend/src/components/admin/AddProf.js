import React, { Component } from 'react';
import {Container,Alert, FormGroup,Form,Input,Button,Row,Col} from 'reactstrap';
import AppNavbar from './AppNavbar';
import {connect} from 'react-redux';
import {addProf} from '../../actions/admin/adminProfActions';

class AddProf extends Component {
    state={
        nom:null,
        prenom:null,
        cin:null,
        email:null,
        msg:null,
        success:null
    }

    onChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        });
    }

    componentDidUpdate(prevProps){
        const {error,success}=this.props;
        if(error!==prevProps.error){
            if(error.id=='ADD_PROF_FAIL'){
                this.setState({msg:error.msg.msg});
            }
            else{
                this.setState({msg:null})
            }
        }
        if(success!==prevProps.success && success==='ADD_PROF'){
            this.setState({
                success:'Prof ajouter avec succes',
                msg:null
            });
        }
    }

    onSubmit=(e)=>{
        e.preventDefault();
        const {nom,prenom,cin,email}=this.state;
        const body={
            nom,
            prenom,
            cin,
            email
        }
        this.props.addProf(body);
    }
    render() {
        return (
            <div>
                <AppNavbar />
                <Container className="mt-5">
                    <h2 className="text-center">Ajouter Un Professeur</h2><br/>
                    <Alert color="info">
                        <div>Vous pouvez ajouter un professeur directement ici !</div>
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
                                    <Input type="text" name="nom" placeholder="Entrer Name" onChange={this.onChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Input type="text" name="prenom" placeholder="Entrer Prenom" onChange={this.onChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Input type="text" name="cin" placeholder="Entrer CIN" onChange={this.onChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Input type="text" name="email" placeholder="Entrer Email" onChange={this.onChange} />
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
    success:state.adminProf.success,
    error:state.error
});

export default connect(mapStateToProps,{addProf})(AddProf);
