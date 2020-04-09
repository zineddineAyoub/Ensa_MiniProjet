import React, { Component } from 'react'
import {Button} from 'reactstrap';
import {connect} from 'react-redux';
import {logout} from '../../actions/admin/authActions';
import {Redirect,Link} from 'react-router-dom';

class Home extends Component {
    onLogout=()=>{
        this.props.logout();
    }
    render() {
        return (
            <div>
                Home Admin<br />
                <Link className="btn btn-danger" to="/admin/login" onClick={this.onLogout}>Logout</Link>
            </div>
        )
    }
}

const mapStateToProps=(state)=>({

});

export default connect(mapStateToProps,{logout})(Home);
