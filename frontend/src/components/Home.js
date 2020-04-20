import React, { Component } from 'react';
import {
    Container,
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavbarText,
    NavItem,
    NavLink
  } from 'reactstrap';

import {Link} from 'react-router-dom';

class Home extends Component {
    state={
        isOpen:false
    }
    toggle=()=>{
        this.setState({
            isOpen:!this.state.isOpen
        });
    }
    render() {
        return (
            <div>
                
            </div>
        )
    }
}

export default Home;
