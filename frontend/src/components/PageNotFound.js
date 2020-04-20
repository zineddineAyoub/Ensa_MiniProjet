import React, { Component } from 'react';
import icon from '../ressources/desert.jpg';
import {Link} from 'react-router-dom';

class PageNotFound extends Component {
    render() {
        const styling={
            "left":{
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
                justifyContent:'center',
                height:'100vh',
                width:'50%'
            },
            "title":{
                fontSize:'60px',
                fontWeight:'bold'
            },
            "container":{
                display:'flex',
                flexDirection:'row',
                height:'100vh',
                width:'100%'
            },
            "right":{
                height:'100vh',
                width:'50%'
            },
            "image":{
                maxWidth:'100%',
                height:'100vh'
            }
        }
        return (
            <div style={styling.container}>
                <div style={styling.left}>
                    <h1 style={styling.title} className="text-center">404 Not Found</h1><br/>
                    <h4 className="text-center">Désolé la page que vous êtes entrain de rechercher n'existe pas.</h4><br/>
                    <Link to="/"><button className="btn btn-danger">Go Home</button></Link>
                </div>
                <div style={styling.right}>
                    <img src={icon} style={styling.image} />
                </div>
            </div>
        )
    }
}

export default PageNotFound;
