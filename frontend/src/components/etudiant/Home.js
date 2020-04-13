import React, { Component } from 'react'
import {Button} from 'reactstrap';
import {connect} from 'react-redux';
import {logout} from '../../actions/etudiant/authActions';
import {Redirect,Link} from 'react-router-dom';

class Home extends Component {
    onLogout=()=>{
        this.props.logout();
    }
    render() {
        return (
            <div>
                <Container maxWidth="xs">
                Home Etudiant<br />
                <Link className="btn btn-danger" to="/etudiant/login" onClick={this.onLogout}>Logout</Link>
                </Container>
            </div>
        )
    }
}

const mapStateToProps=(state)=>({

});

export default connect(mapStateToProps,{logout})(Home);
