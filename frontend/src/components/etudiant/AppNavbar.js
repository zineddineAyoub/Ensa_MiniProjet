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
    Row,
    Button
  } from 'reactstrap';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {logout} from '../../actions/etudiant/authActions';
import ExampleComponent from "react-rounded-image";
import axios from 'axios';
import '../../ressources/etudiant.css';


class AppNavbar extends Component {
    state={
        isOpen:false,
        user:null,
        loaded:false,
        color:"white",
        notifs:[],
        counter:1
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
            axios.get(`http://localhost:5000/etudiant/getNotifNotViewed/${this.props.user._id}`)
                .then((notifs)=>{
                    console.log("this is the length :"+notifs.data.length);
                    if(notifs.data.length!==0){
                        this.setState({
                            color:'red',
                            notifs:notifs.data,
                            user:this.props.user,
                            loaded:true,
                        })
                    }
                    else{
                        this.setState({
                            user:this.props.user,
                            loaded:true
                        })
                    }
                }).catch(err=>{
                    console.log(err);
                })
        }

    }


    componentDidUpdate(prevProps){
        const {user}=this.props;
     
        if(user!==prevProps.user && Object.keys(user).length !==0){
            if(user!==prevProps.user){
                console.log(user._id);
                axios.get(`http://localhost:5000/etudiant/getNotifNotViewed/${user._id}`)
                .then((notifs)=>{
                    console.log("this is the length :"+notifs.data.length);
                    if(notifs.data.length!==0){
                        this.setState({
                            color:'red',
                            notifs:notifs.data,
                            user:this.props.user,
                            loaded:true,
                        })
                    }
                    else{
                        this.setState({
                            user:this.props.user,
                            loaded:true
                        })
                    }
                }).catch(err=>{
                    console.log(err);
                })
                
            } 
        }
        
    }

    onClick=()=>{
        if(this.state.counter%2===0){
            axios.put(`http://localhost:5000/etudiant/modifNotif/${this.state.user._id}`)
            .then(()=>{
                this.setState({
                    color:"white",
                    notifs:[],
                    counter:this.state.counter+1
                })
            })
        }
        else{
            this.setState({
                counter:this.state.counter+1
            })
        }
    }

    render() {

        const styling={
           
            background: '#1A2980',  /* fallback for old browsers */
            background: '-webkit-linear-gradient(to right, #1A2980 , #26D0CE )',  /* Chrome 10-25, Safari 5.1-6 */
            background: 'linear-gradient(to right, #1A2980 , #26D0CE )', /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */


            background: '#003973',  /* fallback for old browsers */
            background: '-webkit-linear-gradient(to top, #003973,#003973)',  /* Chrome 10-25, Safari 5.1-6 */
            background: 'linear-gradient(to top, #003973,#003973)', /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

            color:'#E5E5BE',

        }

        

        return (
            <div>
                    <Navbar color="primary" dark light expand="sm" style={styling}>
                    <NavbarBrand href="/prof/home">Etudiant</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <Link to="/etudiant/home" style={{textDecoration:'none'}}><NavLink>Home</NavLink></Link>
                            </NavItem>
                            
                            <NavItem>
                                <Link to="/etudiant/listDocument" style={{textDecoration:'none'}}><NavLink>Mes Documents</NavLink></Link>
                            </NavItem>

                            <NavItem>
                                <Link to="/etudiant/listNote" style={{textDecoration:'none'}}><NavLink>Mes Notes</NavLink></Link>
                            </NavItem>
                            <NavItem>
                                <Link to="/etudiant/emploie" style={{textDecoration:'none'}}><NavLink>Emploie</NavLink></Link>
                            </NavItem>
                           
                        </Nav>
                        {this.state.loaded ? ( 
                        <Nav navbar>
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav >
                                    <span onClick={this.onClick}><i className="fa fa-bell fa-lg" style={{color:this.state.color}}></i></span>
                                </DropdownToggle>
                                <DropdownMenu right style={{width:'400px',height:'500px',overflowY:'scroll'}}>
                                    {this.state.notifs.map(notif=>(
                                        <DropdownItem>
                                            <Row>
                                                    <p style={{width:'100%',paddingTop:'10px'}}><img style={{float:'left',height:'40px',width:'40px',borderRadius:'50%',margin: '0 20px 20px 15px'}} src={`http://localhost:5000/photoProfile/prof/${notif.senderProf.image}`} />
                                                        <p>
                                                            <b>{notif.senderProf.nom +' '+notif.senderProf.prenom}</b>{'    '}
                                                            <i>{notif.postDate}</i>
                                                            <br/>
                                                            <p>
                                                            {notif.content}
                                                            </p>
                                                        </p>
                                                    </p>
                                            </Row>
                                        </DropdownItem>
                                    ))}
                                    <DropdownItem style={{marginTop:"300px"}} className="hoverBack">
                                        <hr />
                                        <div className="text-center"><Link to="/etudiant/notifications">All Notifications</Link></div>
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>):null}
                        {this.state.loaded ? ( 
                        <Nav navbar>
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav  >
                                <ExampleComponent 
                                roundedColor="#FFFFFF"
                                imageWidth="40"
                                imageHeight="40"
                                roundedSize="2"
                                image={ require(`../../../../public/photoProfile/etudiant/${this.state.user.image}`)} />
                                </DropdownToggle>


                                <DropdownMenu right>
                                
                                    <Link to="/etudiant/AfficherProfile"  style={{textDecoration:'none'}}>
                                        <DropdownItem>
                                            Profile
                                        </DropdownItem>
                                    </Link>
                                    <Link to="/etudiant/login" onClick={this.onLogout} style={{textDecoration:'none'}}>
                                        <DropdownItem>
                                        Logout
                                        </DropdownItem>
                                    </Link>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>):null}
                    </Collapse>
                </Navbar>  
            </div>
        )
    }
}

const mapStateToProps=(state)=>({
    user:state.etudiantAuth.user
});

export default connect(mapStateToProps,{logout})(AppNavbar);