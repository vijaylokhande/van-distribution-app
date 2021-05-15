import React, { Component } from 'react';
import { BrowserRouter } from "react-router-dom";
import { Spinner , Form , Col , Row ,Button} from 'react-bootstrap';
import { IN_PROGRESS, SET_LOGIN_USER } from '../constants/ActionConstants';
import { LOGIN } from '../constants/AppConstants';
import { connect } from "react-redux";
import { postCall } from '../service/RestClient';

class Auth extends Component {

    constructor(props){
        super();

        this.state ={
            username:"",
            password:""
        }
    }


    doLogin = (event) => {

        event.preventDefault();

        this.props.setInProgress(true);

        const data={
            username:this.state.username,
            password:this.state.password
        };


        postCall(LOGIN, data).then(res => {
            if (res.status === 200) {
        
                this.props.setLoginUser(res.data);
                this.props.setInProgress(false);
            }
            else {
                this.props.setInProgress(false);
            }
        })
            .catch(exp => {
                this.props.setInProgress(false);
                console.log(exp);
            });
    };


    handleChange=(event)=>{
        this.setState({[event.target.id]: event.target.value});
    }

    render() {
        return (
            <div>
                <BrowserRouter>
                    <div>
                        <br/>
                        <form onSubmit={this.doLogin}>
                        <label>User Name</label> <br/>
                        <input type="text" data-test="username" value={this.state.username} id="username" onChange={this.handleChange} /><br/>
                        <label>Password</label> <br/>
                        <input type="password" data-test="password" value={this.state.password} id="password" onChange={this.handleChange } /><br/><br/>
                        <input type="submit" value="Log In" data-test="submit" />
                        </form>

                         
                    </div>
                    {
                        this.props.inProgress ?
                            <div id="bd" className="bd">
                                <Spinner animation="border" variant="warning" className="center-pos" ><span className="sr-only">Loading...</span></Spinner>
                            </div>
                            : null
                    }
                </BrowserRouter>
            </div>
        );
    }
}
const mapDispatchToProps = (dispatch) => ({
    setInProgress: flag => dispatch({ type: IN_PROGRESS, payload: flag }),
    setLoginUser: data => dispatch({ type: SET_LOGIN_USER, payload: data })
});
const mapStateToProps = (state) => ({
    inProgress: state.config.inProgress,
    loginUser: state.auth.loginUser
});
export default connect(mapStateToProps, mapDispatchToProps)(Auth);
