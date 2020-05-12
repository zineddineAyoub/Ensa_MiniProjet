import React, { Component } from 'react'
import {Button} from 'reactstrap';
import {Alert} from 'reactstrap';
import {Form,Input,Label,FormGroup} from 'reactstrap';
import AppNavbar from './AppNavbar';
import {Container} from 'reactstrap';
import {connect} from 'react-redux';
import {EditPass} from '../../actions/prof/profActions';
import {Redirect,Link} from 'react-router-dom';



class ChangePassword extends Component {
    
    state={
        success:null,
        msg:null,
        ancPass:null,
        nvPass:null,
        cnfPass:null,
        user:{},
        guide1:null,
        guide2:null,
        guide3:null
  
    }

    
    onChange=(e)=>{
        
        this.setState({
            [e.target.name]:e.target.value,
            user:this.props.user,
            
        });
        

           console.log(this.state.user.password);
    }

    onKeyUp=(e)=>{
        //teste sur les les champs
        if(!this.state.ancPass || !this.state.nvPass || !this.state.cnfPass)
        { this.setState({
                guide1:"Veuillez repmlir tous les champs"
            });
       } else {
        this.setState({
            guide1:null
        });
       }
       //teste sur l'ancien pass
        if(this.state.ancPass!=this.state.user.password)
        { this.setState({
                guide2:"Ancien Mot de passe incorrecte" 
            });
        } else {
            this.setState({
                guide2:null
            });
           }
       //tester sur la correspondance
       
        if(this.state.nvPass!=this.state.cnfPass)
                { this.setState({
                        guide3:"Mots de passes ne sont pas identiques"
                    });
                } else if(this.state.nvPass==this.state.cnfPass){
                    this.setState({
                        guide3:null
                    });
                }
    }

    onSubmit=(e)=>{
        

        const body = {
            password:this.state.nvPass,
        }

        this.props.EditPass(body,this.state.user._id);
    }

    componentDidUpdate(prevProps){
        const {error,success}=this.props;
        if(error!==prevProps.error){
            if(error.id==='PROF_EDIT_PASS_FAIL'){
                this.setState({
                    msg:error.msg.msg,
                    success:null,
                    
                });
            }
            else{
                this.setState({msg:null})
            }
        }
        if(success!==prevProps.success && success==='PROF_EDIT_PASS'){
            this.setState({
                success:'Mot de passe modifié avec succes',
                msg:null
            });
        }
    }

    render() {
        return (
            <div>
                <AppNavbar />
                 <Container className="col-sm-12 col-md-6 offset-md-3">
                    <br/>
                    {this.state.msg ? <Alert color="danger"> {this.state.msg} </Alert>:null}
                    {this.state.success ? <Alert color="success"> {this.state.success} </Alert>:null}

                    <Alert color="success">
                        Vous pouvez changer votre mot de passe ici !
                    </Alert>

                    <Alert color="danger"  style={{display: this.state.guide1 ? 'block' : 'none' }} >
                    {this.state.guide1}
                    </Alert>

                    <Alert color="danger" style={{display: this.state.guide2 ? 'block' : 'none' }} >
                    {this.state.guide2} 
                    </Alert>

                    <Alert color="danger" style={{display: this.state.guide3 ? 'block' : 'none' }} >
                    {this.state.guide3} 
                    </Alert>

                    <Form onSubmit={this.onSubmit}>

                    <FormGroup>
                        
                        <Input type="password" name="ancPass" placeholder="Ancien mot de passe" onChange={this.onChange} onKeyUp={this.onKeyUp}/>
                    </FormGroup>

                    <FormGroup>
                        
                        <Input type="password" name="nvPass" id="nvPass" placeholder="Nouveau mot de passe" onChange={this.onChange} onKeyUp={this.onKeyUp}/>
                    </FormGroup>

                    <FormGroup>
                        
                        <Input type="password" name="cnfPass" id="cnfPass" placeholder="Confirmez mot de passe" onChange={this.onChange} onKeyUp={this.onKeyUp}/>
                    </FormGroup>

                        <Button onClick={()=>this.onSubmit()} id="myBtn" color="primary"
                        disabled={!this.state.ancPass || !this.state.nvPass || !this.state.cnfPass || this.state.user.password!=this.state.ancPass || this.state.nvPass!=this.state.cnfPass}>Valider</Button>
                        
                    </Form>

                 </Container>
            </div>
        )
    }
}

const mapStateToProps=(state)=>({
    error:state.error,
    success:state.profReducer.success,
    user:state.profAuth.user,
});

export default connect(mapStateToProps,{EditPass})(ChangePassword);
