import React, { Component } from 'react';
import {Container,Alert, FormGroup,Form,Input,Button,Row,Col} from 'reactstrap';
import AppNavbar from './AppNavbar';
import {connect} from 'react-redux';
import axios from 'axios';
import {Bar, Line, Pie} from 'react-chartjs-2';
import {addStudent} from '../../actions/admin/adminEtudiantActions';

class Statistique extends Component {
    state={
        user:null,
        chartData:{
            labels:[],
            datasets:[
                {
                    label:'Stats',
                    data:[],
                    backgroundColor:[
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)',
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(255, 160, 150, 0.6)',
                        'rgba(255, 180, 168, 0.6)',
                        'rgba(255, 115, 159, 0.6)'    
                    ]
                }
            ]
        }
    }

    componentWillMount(){
        axios.get('http://localhost:5000/admin/FiliereStats/etudiant')
            .then((docs)=>{
                console.log(docs);
                this.setState(prevState =>{
                    let chartData=Object.assign({},prevState.chartData);
                    chartData.labels=docs.data[0].labels;
                    chartData.datasets[0].data=docs.data[0].data;
                    return { chartData }
                },()=>{
                    console.log(this.state.chartData)
                })
            })
    }

    onChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        },()=>{
            axios.get(`http://localhost:5000/admin/FiliereStats/`+this.state.user)
            .then((docs)=>{
                console.log(docs);
                this.setState(prevState =>{
                    let chartData=Object.assign({},prevState.chartData);
                    chartData.labels=docs.data[0].labels;
                    chartData.datasets[0].data=docs.data[0].data;
                    return { chartData }
                },()=>{
                    console.log(this.state.chartData)
                })
            })
        });
    }


    render() {
        return (
            <div>
                <AppNavbar />
                <Container className="mt-3">
                    <Alert color="info">
                        <div>Statistique selon les étudiants et professeur selon les filières et niveaux.</div>
                    </Alert>
                    <Row>
                        <Col xs={3}></Col>
                        <Col xs={7}>
                        <Input type="select" name="user" onChange={this.onChange}>
                            <option value="etudiant">Etudiant</option>
                            <option value="professeur">Professeur</option>
                        </Input>
                        </Col>
                    </Row>
                    <Row>
                        <Bar
                            data={this.state.chartData}
                            options={{
                                legend:{
                                    display:false,
                                },
                            }}
                            width={500}
                            height={200}
                        />
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
