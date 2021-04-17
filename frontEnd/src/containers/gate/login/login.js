import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import classes from './login.module.css';
// import connect from react-redux -> get the option to save data in store (not get data from store)
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
            // .then() -> store the token on redux (it will be used to make requests later in the app)

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
 
export default Login;