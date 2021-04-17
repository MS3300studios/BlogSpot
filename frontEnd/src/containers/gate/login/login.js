import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import classes from './login.module.css';
import * as actionTypes from '../../../store/actions';
import {connect} from 'react-redux'
import Button from '../../../components/UI/button';

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: null,
            password: null,
            readyForSubmission: false
        }

        this.loginHandler.bind(this);
        this.onChangeHandler.bind(this);
        this.flash.bind(this);
    }

    onChangeHandler = (e, type) => {
        switch (type) {
            case "email":
                this.setState({email: e.target.value})
                break;
            case "password":
                this.setState({password: e.target.value})
                break;
            default:
                break;
        }
        if(this.state.email!=="" && this.state.password!==""){
            this.setState({readyForSubmission: true});
         }
        else{
            this.setState({readyForSubmission: false});
        }
    }

    loginHandler = () => {
        const loginData = {
            email: this.state.email,
            password: this.state.password
        }
        axios.post('http://localhost:3001/users/register', loginData)
            .then(res => {
                if(res.status===200){
                    console.log(res);
                    this.props.redux_store_token(res.token);
                }
                else{
                    // this.flash("An error ocurred, try again")
                }
            })

    }

    flash = (message) => {
        this.setState({flashMessage: message});
        
        setTimeout(()=>{
            this.setState({flashNotClosed: false});
        }, 2000)

        setTimeout(()=>{
            this.setState({flashMessage: ""});
        }, 3000);
    
        setTimeout(()=>{
            this.setState({flashNotClosed: true});
        }, 3000);
    }

    render() { 
        return (
            <div className={classes.LoginContainer}>
                <form className={classes.Form}>
                    <h1>Log in</h1>
                    <label className={classes.labelEmail}>email:</label>
                    <input type="email" placeholder="enter your email" className={classes.inputEmail} />
                    <label className={classes.labelPassword}>Password:</label>
                    <input type="password" placeholder="enter your password" className={classes.inputPassword} />
                    <p className={classes.keepLoggedinP}>Keep me logged in</p>
                    <label className={classes.switch}>
                        <input type="checkbox" />
                        <span className={[classes.slider,classes.round].join(" ")}></span>
                    </label>
                    <div className={classes.buttonContainer}>
                        <Button disabled={this.state.readyForSubmission} clicked={this.loginHandler}>Log In</Button>
                    </div>
                </form>
                <label className={classes.labelNoAccount}>Don't have an account yet?</label>
                <Link to="/register" className={classes.registerLink}>Register here</Link>
            </div>
        );
    }
}
 

const mapDispatchToProps = dispatch => {
    return {
        redux_store_token: (token) => dispatch({type: actionTypes.STORE_TOKEN, data: token}),
    }
}

export default connect(null, mapDispatchToProps)(Login);