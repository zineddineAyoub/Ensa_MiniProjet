import React, { Component } from 'react';
import '../ressources/home.css';
import {
    Container,
    Navbar,
    NavbarBrand,
    Nav,
    NavbarText,
    NavLink,
    Input,
    Row,
    Col,
    Card,
    CardBody,
    CardImg,
    CardTitle,
    CardText,
    Button,
    FormGroup,
    Form,
    Alert
  } from 'reactstrap';

import etudiantIcon from '../ressources/studentIcon.svg';
import profIcon from '../ressources/teacherIcon.svg';
import {Link} from 'react-router-dom';
import icon from '../ressources/ensa1.jpeg';
import axios from 'axios';
import $ from 'jquery';

class Home extends Component {
    state={
        year:new Date().getFullYear(),
        email:null,
        description:null,
        success:null,
        msg:null
    }

    onChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value,
            success:null,
            msg:null
        });
    }

    componentWillMount(){
        $(window).scroll(function(){
            $('.nav').toggleClass('scrolled',$(this).scrollTop()>600);
        });
    }

    onSubmit=(e)=>{
        e.preventDefault();
        const {email,description}=this.state;
        console.log(email);
        console.log(description);
        const config={
            headers:{
                'Content-type':'application/json'
            }
        }
        const body=JSON.stringify({email,description});
        axios.post('http://localhost:5000/admin/sendFeedBack',body,config)
        .then(()=>{
            this.setState({
                success:'Email envoyé avec succés',
                msg:null
            });
        }).catch(err=>{
            this.setState({
                msg:err.response.data.msg,
                success:null
            },console.log(this.state.msg));
        });

    }
    render() {
        return (
            <div>
                <div className="navigation">
                    <Navbar expand="md" className="nav">
                        <Container>
                            <NavbarBrand href="/" className="logo">ENSAS</NavbarBrand>
                            <Nav className="mr-auto" navbar>
                            </Nav>
                            <Link to="/prof/login"><NavbarText className="links">Login Professeur</NavbarText></Link>
                            <span className="seperator"></span>
                            <Link to="/etudiant/login"><NavbarText className="links">Login Etudiant</NavbarText></Link>
                        </Container>
                    </Navbar>
                </div>
                <div className="imageContainer">
                     <img src={icon} className="image" />
                </div>
                <div className="textContainer">
                    <h2 className="globalTitle">Ecole Nationales des Sciences Appliquées</h2>
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
                                            <Link to="/prof/login"><Button color="danger">Page login</Button></Link>
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
                                            <CardTitle className="text-center cardTitle">Envoie message au admin</CardTitle>
                                            <CardText className="text-center mt-4"><p>Entrer une description a envoyé au admin.</p></CardText><br />
                                            {this.state.msg ? <Alert color="danger">
                                                {this.state.msg}
                                            </Alert>:null}
                                            {this.state.success ? <Alert color="success">
                                                {this.state.success}
                                            </Alert>:null}
                                            <Form onSubmit={this.onSubmit}>
                                                <FormGroup>
                                                    <Input type="email" name="email" placeholder="Entrer Email" onChange={this.onChange} />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Input type="textarea" name="description" placeholder="Entrer Description" onChange={this.onChange} />
                                                </FormGroup>
                                                <FormGroup className="text-center">
                                                    <Button type="submit" color="warning" className="mt-2 feedBack">Envoyer</Button>
                                                </FormGroup>
                                            </Form>
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
