import React, { Component } from 'react';
import '../ressources/home.css';
import {
    Container,
    Navbar,
    NavbarBrand,
    Nav,
    NavbarText,
    NavLink,
    Row,
    Grid,
    Col,
    Card,
    CardBody,
    CardImg,
    CardTitle,
    CardText,
    Button
  } from 'reactstrap';

import etudiantIcon from '../ressources/studentIcon.svg';
import profIcon from '../ressources/teacherIcon.svg';
import {Link} from 'react-router-dom';
import icon from '../ressources/background.jpg';

class Home extends Component {
    state={
        year:new Date().getFullYear()
    }
    render() {
        return (
            <div>
                <div className="navigation">
                    <Navbar color="dark" dark expand="md">
                        <Container>
                            <NavbarBrand href="/">ENSAS</NavbarBrand>
                            <Nav className="mr-auto" navbar>
                            </Nav>
                            <Link to="/prof/login"><NavbarText className="links">Login Professeur</NavbarText></Link>
                            <span className="seperator"></span>
                            <Link to="/etudiant/login"><NavbarText>Login Etudiant</NavbarText></Link>
                        </Container>
                    </Navbar>
                </div>
                <div className="imageContainer">
                     <img src={icon} className="image" />
                </div>
                <div className="textContainer">
                    <h2 className="globalTitle">Ecole National de Science appliqué</h2>
                    <h4 className="globalsubTitle">Platforme de gestion de relation professeur étudiant.</h4>
                </div>
                <div className="container">
                    <h2 className="text-center title">Options d'authentification</h2>
                    <div className="authContainer">
                        <Row>
                            <Col xs={6}>
                                <Card>
                                    <div className="text-center">
                                        <CardImg style={{height:"150px",width:"150px",marginTop:"15px"}} src={etudiantIcon} />
                                    </div>
                                    <CardBody>
                                        <CardTitle className="text-center cardTitle">Authentification Etudiant</CardTitle>
                                        <CardText className="text-center"><p>Click sur le button pour se rediriger vers la portail de login des étudiants</p></CardText>
                                        <div className="text-center">
                                            <Link to="/etudiant/login"><Button color="primary">Page login</Button></Link>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col xs={6}>
                                <Card>
                                    <div className="text-center">
                                        <CardImg style={{height:"150px",width:"150px",marginTop:"15px"}} src={profIcon} />
                                    </div>
                                    <CardBody>
                                        <CardTitle className="text-center cardTitle">Authentification Professeur</CardTitle>
                                        <CardText className="text-center"><p>Click sur le button pour se rediriger vers la portail de login des professeurs</p></CardText>
                                        <div className="text-center">
                                            <Link to="/prof/login"><Button color="primary">Page login</Button></Link>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
                <hr className="line" />
                <h2 className="text-center title">Contact</h2>
                <div className="info">
                    <Container>
                        <Row>
                            <Col xs={6}>
                                <Card>
                                    <div className="contact">
                                    <Card style={{height:"400px"}}>
                                        <CardBody>
                                            <CardTitle className="text-center cardTitle">Contact Informations</CardTitle>
                                            <CardText className="text-center"><p>Click sur le button pour se rediriger vers la portail de login des étudiants</p></CardText>
                                        </CardBody>
                                    </Card>
                                </div>
                                </Card>
                            </Col>
                            <Col xs={6}>
                                <CardBody id="map"></CardBody>
                            </Col>
                        </Row>
                    </Container>
                </div>

                <div className="footer">
                    ENSAS-Ecole National Des Sciences Appliqué-{this.state.year}
                </div>
            </div>
        )
    }
}

export default Home;
