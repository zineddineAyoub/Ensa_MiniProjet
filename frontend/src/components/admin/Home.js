import React, { Component } from 'react'
import {Button} from 'reactstrap';
import {connect} from 'react-redux';
import {logout} from '../../actions/admin/authActions';
import {Redirect,Link} from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import SideBarUI from './SideBarUI';
import SideBar from './SideBar';
import Header from './header';
// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import Container from '@material-ui/core/Container';
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));



class Home extends Component {
    
    
    onLogout=()=>{
        this.props.logout();
    }
    render() {
       
        return (
        
              <div >
                   <Container maxWidth="xs">
       
        <SideBarUI/>
                <Link className="btn btn-danger" to="/admin/login" onClick={this.onLogout}>Logout</Link>
                <p> Welcome to the home page </p>
      </Container>
                  
                
                
            </div>
        )
    }
}

const mapStateToProps=(state)=>({

});

export default connect(mapStateToProps,{logout})(Home);
