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
import {logout} from '../../actions/admin/authActions';

class AppNavbar extends Component {
    state={
        isOpen:false
    }

    toggle=()=>{
        this.setState({
            isOpen:!this.state.isOpen
        });
    }
    onLogout=()=>{
        this.props.logout();
    }
    render() {
        return (
            <div>
                <Navbar color="dark" dark light expand="sm">
                <NavbarBrand href="/admin/home">Admin</NavbarBrand>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav className="mr-auto" navbar>
                        <NavItem>
                            <Link to="/admin/home" style={{textDecoration:'none'}}><NavLink>Home</NavLink></Link>
                        </NavItem>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                Gestion Etudiant
                            </DropdownToggle>
                            <DropdownMenu right>
                                <Link style={{textDecoration:'none'}} to="/admin/addStudents">
                                    <DropdownItem>
                                        Ajouter etudiants
                                    </DropdownItem>
                                </Link>
                                <Link style={{textDecoration:'none'}} to="/admin/addStudent">
                                    <DropdownItem>
                                        Ajouter un etudiant
                                    </DropdownItem>
                                </Link>
                                <Link style={{textDecoration:'none'}} to="/admin/listStudents">
                                    <DropdownItem>
                                        List Etudiants
                                    </DropdownItem>
                                </Link>
                                <Link style={{textDecoration:'none'}} to="/admin/searchStudent">
                                    <DropdownItem>
                                        Recherche Un Etudiant
                                    </DropdownItem>
                                </Link>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                Gestion Professeur
                            </DropdownToggle>
                            <DropdownMenu right>
                                <Link style={{textDecoration:'none'}} to="/admin/addProfs">
                                    <DropdownItem>
                                        Ajouter Professeurs
                                    </DropdownItem>
                                </Link>
                                <Link style={{textDecoration:'none'}} to="/admin/addProf">
                                    <DropdownItem>
                                        Ajouter Un Professeur
                                    </DropdownItem>
                                </Link>
                                <Link style={{textDecoration:'none'}} to="/admin/listProfs">
                                    <DropdownItem>
                                        List Professeurs
                                    </DropdownItem>
                                </Link>
                                <Link style={{textDecoration:'none'}} to="/admin/SearchProf">
                                    <DropdownItem>
                                        Recherche Un Professeur
                                    </DropdownItem>
                                </Link>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                Gestion Matière
                            </DropdownToggle>
                            <DropdownMenu right>
                                <Link style={{textDecoration:'none'}} to="/admin/addMatieres">
                                    <DropdownItem>
                                        Ajouter Matières
                                    </DropdownItem>
                                </Link>
                                <Link style={{textDecoration:'none'}} to="/admin/addMatiere">
                                    <DropdownItem>
                                        Ajouter Une Matière
                                    </DropdownItem>
                                </Link>
                                <Link style={{textDecoration:'none'}} to="/admin/listMatieres">
                                    <DropdownItem>
                                        Lister Les Matières
                                    </DropdownItem>
                                </Link>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <NavItem>
                            <Link to="/admin/emploie" style={{textDecoration:'none'}}>
                                <NavLink>Emploie</NavLink>
                            </Link>
                        </NavItem>
                        <NavItem>
                            <Link to="/admin/feedbacks" style={{textDecoration:'none'}}>
                                <NavLink>Feedbacks</NavLink>
                            </Link>
                        </NavItem>
                        <NavItem>
                            <Link to="/admin/statistiques" style={{textDecoration:'none'}}>
                                <NavLink>Statistiques</NavLink>
                            </Link>
                        </NavItem>
                    </Nav>
                    <Nav navbar>
                        <NavItem>
                            <Link to="/admin/login" onClick={this.onLogout} style={{textDecoration:'none'}}>
                                <NavLink>Logout</NavLink>
                            </Link>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
            </div>
        )
    }
}

const mapStateToProps=(state)=>({

});

export default connect(mapStateToProps,{logout})(AppNavbar);