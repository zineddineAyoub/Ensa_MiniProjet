import React, { Component } from 'react';
import AppNavbar from './AppNavbar';
import {connect} from 'react-redux';
import axios from 'axios';
import { Spinner, Container, Row, Card, CardBody, Col, CardTitle, CardText } from 'reactstrap';

class Notifications extends Component {
    state={
        notifs:[],
        loading:true
    }

    componentWillMount(){
        if(this.props.user)
        {
            axios.get(`http://localhost:5000/etudiant/getAllNotif/${this.props.user._id}`)
            .then(docs=>{
                console.log(docs.data);
                this.setState({
                    notifs:docs.data,
                    loading:false
                })
            }).catch(err=>{

            })
        }
    }
    componentDidUpdate(prevProps){
        const {user}=this.props;
        if(user!==prevProps.user && Object.keys(user).length !==0){
            if(user!==prevProps.user){
                axios.get(`http://localhost:5000/etudiant/getAllNotif/${user._id}`)
                .then(docs=>{
                    console.log(docs.data);
                    this.setState({
                        notifs:docs.data,
                        loading:false
                    })
                }).catch(err=>{

                })
            }
        }
    }
    render() {
        return (
            <div>
                <AppNavbar />
                <h3 className="mt-5 text-center">View All Notifications</h3>
                {this.state.loading ? (<div className="text-center mt-5"><Spinner color="primary"></Spinner></div>):(
                    <Container style={{marginTop:'40px'}}>
                        <Row>
                            {this.state.notifs.map(notif=>(
                                <Col xs={4} className="mt-3 mb-3">
                                    <Card>
                                        <CardTitle className="mt-3 ml-3">
                                            <p>
                                                <img style={{float:'left',height:'40px',width:'40px',borderRadius:'50%',margin: '0 20px 20px 15px'}} 
                                                src={`http://localhost:5000/photoProfile/prof/${notif.senderProf.image}`} />
                                                <p><strong>{notif.senderProf.nom +' '+ notif.senderProf.prenom}</strong></p>
                                            </p>
                                        </CardTitle>
                                        <hr style={{marginTop:'-28px'}} />
                                        <CardBody className="text-center">
                                            <CardText style={{marginTop:'-15px'}}>{notif.content}</CardText>
                                        </CardBody>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Container>
                )}
            </div>
        )
    }
}

const mapStateToProps=(state)=>({
    user:state.etudiantAuth.user
});

export default connect(mapStateToProps)(Notifications);
