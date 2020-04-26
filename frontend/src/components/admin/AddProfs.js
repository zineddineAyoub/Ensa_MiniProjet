import React, { Component } from 'react';
import {Container,Alert, FormGroup,Form,Input,Button,Row,Col} from 'reactstrap';
import AppNavbar from './AppNavbar';
import {connect} from 'react-redux';
import {addProfs} from '../../actions/admin/adminProfActions';
import {clearSuccess} from '../../actions/admin/authActions';

class AddProfs extends Component {
    state={
        success:null,
        msg:null,
        file:null
    }

    componentWillMount(){
        this.props.clearSuccess();
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
            if(error.id=='ADD_PROFS_FAIL'){
                this.setState({
                    msg:error.msg.msg,
                    success:null
                });
            }
            else{
                this.setState({msg:null})
            }
        }
        if(success!==prevProps.success && success==='ADD_PROFS'){
            this.setState({
                success:'Tout les professeurs enregistré avec succés',
                msg:null
            });
        }
    }

    onSubmit=(e)=>{
        e.preventDefault();
        const file=this.state.file;
        let formData=new FormData();
        formData.append("file",file);
        this.props.addProfs(formData);
    }
    render() {
        return (
            <div>
                <AppNavbar />
                <Container className="mt-5">
                    <h2 className="text-center">Ajouter les professeurs</h2><br/>
                    <Alert color="info">
                        <div>Ici vous pouvez uploader tous les professeurs avec un fichier!</div>
                    </Alert>
                    <Alert color="warning">
                        <div><strong>Important: </strong>Quand vous uploader le csv des profs vous devez reuploader le fichier de matière! </div>
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
    success:state.adminProf.success,
    error:state.error
});

export default connect(mapStateToProps,{addProfs,clearSuccess})(AddProfs);
