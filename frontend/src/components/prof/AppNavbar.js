import React, { Component,Fragment } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
  } from 'reactstrap';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {logout} from '../../actions/prof/authActions';
import ExampleComponent from "react-rounded-image";

class AppNavbar extends Component {
    state={
        isOpen:false,
        user:{},
        loaded:false,
    }

    toggle=()=>{
        this.setState({
            isOpen:!this.state.isOpen
        });
    }
    onLogout=()=>{
        this.props.logout();
    }

    componentWillMount()
    {
        if(this.props.user)
        {
            this.state.user = this.props.user;
            this.state.loaded = true;
        }
    }


    componentDidUpdate(prevProps){
        const {user}=this.props;
     
        if(user!==prevProps.user && Object.keys(user).length !==0){
            this.setState({
                user:user,
                loaded:true
            });   
        }
        
    }

    render() {
        return (
            <div>
                {this.state.loaded ? ( 
                    <Navbar color="primary" dark light expand="sm">
                    <NavbarBrand href="/prof/home">Professeur</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <Link to="/prof/home" style={{textDecoration:'none'}}><NavLink>Home</NavLink></Link>
                            </NavItem>
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav caret>
                                    Gestion Document
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <Link style={{textDecoration:'none'}} to="/prof/AddDocument">
                                        <DropdownItem>
                                            Ajouter Document
                                        </DropdownItem>
                                    </Link>
                                    <Link style={{textDecoration:'none'}} to="/prof/listDocument">
                                        <DropdownItem>
                                            List Document
                                        </DropdownItem>
                                    </Link>
                                   
                                </DropdownMenu>
                            </UncontrolledDropdown>
                               
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav caret>
                                    Gestion Note
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <Link style={{textDecoration:'none'}} to="/prof/ajouterNote">
                                        <DropdownItem>
                                            Ajouter Note
                                        </DropdownItem>
                                    </Link>
                                    <Link style={{textDecoration:'none'}} to="/prof/listNote">
                                        <DropdownItem>
                                            List Note
                                        </DropdownItem>
                                    </Link>
                                  
                                </DropdownMenu>
                            </UncontrolledDropdown>
                          
                        </Nav>
                        <Nav navbar>
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav >
                                <ExampleComponent 
                                roundedColor="#FFFFFF"
                                imageWidth="40"
                                imageHeight="40"
                                roundedSize="2"
                                image={ require(`../../../../public/photoProfile/prof/${this.state.user.image}`)} />
                                </DropdownToggle>


                                <DropdownMenu right>
                                
                                <Link to="/prof/AfficherProfile"  style={{textDecoration:'none'}}>
                                        <DropdownItem>
                                            Profile
                                        </DropdownItem>
                                    </Link>
                                    <Link to="/prof/login" onClick={this.onLogout} style={{textDecoration:'none'}}>
                                        <DropdownItem>
                                        Logout
                                        </DropdownItem>
                                    </Link>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>
                    </Collapse>
                </Navbar>
    
                 
                             
                ): 
                
                null
                
                }   
            </div>
        )
    }
}

const mapStateToProps=(state)=>({

    user:state.profAuth.user

});

export default connect(mapStateToProps,{logout})(AppNavbar);