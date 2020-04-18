import React, { Component } from 'react'
import AppNavbar from './AppNavbar';
import {Container,Card,CardBody,CardTitle,CardText,Row,Col} from 'reactstrap';
import {connect} from 'react-redux';
import {logout} from '../../actions/admin/authActions';
import {Redirect,Link} from 'react-router-dom';

class Home extends Component {
    onLogout=()=>{
        this.props.logout();
    }
    render() {
        return (
            <div>
                <AppNavbar />
                <Container className="mt-3"><br />
                    <h2 className="text-center">Hello Admin</h2>
                    <Row className="mt-5">
                        <Col xs={3}></Col>
                        <Col xs={6}>
                            <div>
                                <Card style={{boxShadow:"10px 10px 8px 10px #888888"}}>
                                    <CardBody>
                                        <CardTitle className="text-center"><strong>Ressouces for csv uploads</strong></CardTitle>
                                        <CardText>
                                            <br />
                                            <p><a href="http://localhost:5000/files/Etudiant_Data_Example.csv" class="text-primary">Etudiant Data Example</a></p>
                                            <p><a href="http://localhost:5000/files/Prof_Data_Example.csv" class="text-primary">Prof Data Example</a></p>
                                            <p><a href="http://localhost:5000/files/Matiere_Data_Example.csv" class="text-primary">Matiere Data Example</a></p>
                                        </CardText>
                                    </CardBody>
                                </Card>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

const mapStateToProps=(state)=>({

});

export default connect(mapStateToProps,{logout})(Home);
