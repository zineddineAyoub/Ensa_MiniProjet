import React, { Component } from 'react';
import AppNavbar from './AppNavbar';
import {Container,Spinner, CardBody, CardText,Card,Row,Col,Alert} from 'reactstrap';
import axios from 'axios';

class FeedBacks extends Component {
    state={
        feedbacks:[],
        isLoading:true
    }
    componentWillMount(){
        axios.get('http://localhost:5000/admin/getFeedBacks')
        .then(feed=>{
            console.log(feed.data)
            this.setState({
                feedbacks:feed.data,
                isLoading:false
            });
        }).catch(err=>{
            console.log(err);
        });
    }
    render() {
        return (
            <div>
                <AppNavbar />
                <Container className="mt-5">
                    <h2 className="text-center">FeedBacks des utilisateurs</h2><br/>
                    <Alert color="info">
                        <div>Ici vous pouvez Visualiser visualiser les feedbacks des utilisateurs!</div>
                    </Alert><br />
                    {this.state.isLoading ? <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}><Spinner color="primary" /></div> : null}
                    <Row>
                        {this.state.feedbacks.map((feed)=>(
                            <Col xs={4}>
                                <Card>
                                    <CardBody>
                                        <CardText><strong>Email : </strong>{feed.email}</CardText>
                                        <CardText><strong>Description : </strong>{feed.description}</CardText>
                                    </CardBody>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>
        )
    }
}

export default FeedBacks;