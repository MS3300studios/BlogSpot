import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import classes from './login.module.css';
import Button from '../../../components/UI/button';
import Flash from '../../../components/UI/flash';

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: null,
            password: null,
            readyForSubmission: false,
            keepLoggedIn: false,
            flashMessage: "",
            flashNotClosed: true
        }

        this.loginHandler.bind(this);
        this.onChangeHandler.bind(this);
        this.keepLoggedHandler.bind(this);
        this.flash.bind(this);
        this.handleEnterKey.bind(this);
        this.autoLogin.bind(this);
    }

    handleEnterKey = (e) => {
        if(e.key === "Enter"){
            if(this.state.readyForSubmission){
                this.loginHandler(e);
            }
            else{
                this.flash('fill in all the inputs');
            }
        }
    }   

    keepLoggedHandler = () => {
        let keepLoggedIn = !this.state.keepLoggedIn;
        this.setState({keepLoggedIn: keepLoggedIn});
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
        if(this.state.email!=="" && this.state.password!=="" && 
            this.state.email!==" " && this.state.password!==" " &&
            this.state.email!==null && this.state.password!==null){
            this.setState({readyForSubmission: true});
         }
        // else{
        //     this.setState({readyForSubmission: false});
        // }
    }

    loginHandler = (e) => {     
        e.preventDefault();
        const loginData = {
            email: this.state.email,
            password: this.state.password
        }
        // console.log(loginData);
        axios.post('http://localhost:3001/users/login', loginData)
            .then(res => {
                if(res.status===200){
                    if(this.state.keepLoggedIn){
                        localStorage.setItem('token', res.data.token);
                        let userData = JSON.parse(res.data.userData);
                        userData.password = "";
                        let userDataJSON = JSON.stringify(userData)  
                        localStorage.setItem('userData', userDataJSON);
                    }
                    else{
                        sessionStorage.setItem('token', res.data.token);
                        let userData = JSON.parse(res.data.userData);
                        userData.password = "";
                        let userDataJSON = JSON.stringify(userData)                    
                        sessionStorage.setItem('userData', userDataJSON);
                    }
                    window.location.reload();
                }
                else{
                    this.flash("An error ocurred, try again");
                }
            })
            .catch(error => {
                console.log(error);
                this.flash("wrong email or password");
            });

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

    autoLogin = (loginData) => {
        axios.post('http://localhost:3001/users/login', loginData)
            .then(res => {
                if(res.status===200){
                    if(this.state.keepLoggedIn){
                        localStorage.setItem('token', res.data.token);
                        let userData = JSON.parse(res.data.userData);
                        userData.password = "";
                        let userDataJSON = JSON.stringify(userData)  
                        localStorage.setItem('userData', userDataJSON);
                    }
                    else{
                        sessionStorage.setItem('token', res.data.token);
                        let userData = JSON.parse(res.data.userData);
                        userData.password = "";
                        let userDataJSON = JSON.stringify(userData)                    
                        sessionStorage.setItem('userData', userDataJSON);
                    }
                    window.location.reload();
                }
                else{
                    this.flash("An error ocurred, try again");
                }
            })
            .catch(error => {
                console.log(error);
                this.flash("wrong email or password");
            });
    }

    render() {

        let flash = null;
        if(this.state.flashMessage && this.state.flashNotClosed){
            flash = <Flash>{this.state.flashMessage}</Flash>
        }
        else if(this.state.flashMessage && this.state.flashNotClosed === false){
            flash = <Flash close>{this.state.flashMessage}</Flash>
        }
        return (
            <div className={classes.LoginContainer}>
                <div className={classes.Form}>
                    <h1>Log in</h1>
                    <label className={classes.labelEmail}>email:</label>
                    <input onChange={(e) => {this.onChangeHandler(e, "email")}} type="email" placeholder="enter your email" className={classes.inputEmail} />
                    <label className={classes.labelPassword}>Password:</label>
                    <input onChange={(e) => {this.onChangeHandler(e, "password")}} type="password" placeholder="enter your password" className={classes.inputPassword} onKeyDown={this.handleEnterKey}/>
                    <p className={classes.keepLoggedinP}>Keep me logged in</p>
                    <label className={classes.switch}>
                        <input type="checkbox" onChange={this.keepLoggedHandler} />
                        <span className={[classes.slider,classes.round].join(" ")}></span>
                    </label>
                    <div className={classes.buttonContainer}>
                        <Button disabled={!this.state.readyForSubmission} clicked={this.loginHandler}>Log In</Button>
                    </div>
                {flash}
                </div>
                <label className={classes.labelNoAccount}>Don't have an account yet?</label>
                <Link to="/register" className={classes.registerLink}>Register here</Link>
                <button onClick={()=>this.autoLogin({email: "jennysan@test.pl", password: "jennysan11111A"})}
                style={{backgroundColor: "black"}}>
                    auto login Jenny
                </button>
                <button onClick={()=>this.autoLogin({email: "johndoe@test.pl", password: "johndoe11111A"})}
                style={{backgroundColor: "black"}}>
                    auto login John
                </button>
            </div>
        );
    }
}
 
export default Login;