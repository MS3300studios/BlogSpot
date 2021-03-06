import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from '../../../components/UI/button';
import Flash from '../../../components/UI/flash';
import getColor from '../../../getColor';
import { MAIN_URI } from '../../../config';
import getMobile from '../../../getMobile';

import classes from './login.module.css';
import greenClasses from './greenClasses.module.css';
import blueClasses from './blueClasses.module.css';

const colorScheme = getColor();
let colorClasses = greenClasses;
if(colorScheme === "blue"){
    colorClasses = blueClasses;
}

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: null,
            password: null,
            readyForSubmission: false,
            keepLoggedIn: false,
            flashMessage: "",
            flashNotClosed: true,
        }

        this.loginHandler.bind(this);
        this.onChangeHandler.bind(this);
        this.keepLoggedHandler.bind(this);
        this.flash.bind(this);
        this.handleEnterKey.bind(this);
        this.autoLogin.bind(this);
        this.isMobile = getMobile();
    }

    componentDidMount(){
        if(this.state.email !== "" && this.state.password !== "") this.setState({readyForSubmission: true});
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
    }

    loginHandler = (e) => {     
        e.preventDefault();
        const loginData = {
            email: this.state.email,
            password: this.state.password
        }
        axios.post(`${MAIN_URI}/users/login`, loginData)
            .then(res => {
                if(res.status===200 && !res.data.error){
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
                    window.location.replace(MAIN_URI);
                }
                else if(res.data.error === "user is banned") this.flash("this account is banned, to resolve this issue contact server admin at mikistrus@gmail.com")
                else{
                    this.flash("An error ocurred, try again");        
                }
            })
            .catch(error => {
                console.log(error);
                switch (error.message) {
                    case "Request failed with status code 401":
                        this.flash("wrong email or password");
                        break;
                
                    case "Request failed with status code 404":
                        this.flash("no user with this email was found");
                        break;
                
                    default:
                        this.flash("an error ocurred, try again later");
                        break;
                }
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
        axios.post(`${MAIN_URI}/users/login`, loginData)
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
                    window.location.replace("https://bragspot.herokuapp.com/");
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
            <div className={colorClasses.LoginContainer} style={this.isMobile ? {width: "unset", overflowX: "hidden"} : null}>
                {
                    this.isMobile ? (
                        <div className={classes.Form}>
                            <h1 style={{position: "unset"}}>Log in</h1>
                            <label>email</label><br />  
                            <input onChange={(e) => {this.onChangeHandler(e, "email")}} type="email" placeholder="enter your email"/>
                            <label>Password:</label>
                            <input onChange={(e) => {this.onChangeHandler(e, "password")}} type="password" placeholder="enter your password" onKeyDown={this.handleEnterKey}/>
                            <p className={classes.keepLoggedinP} style={{position: "unset"}}>Keep me logged in</p>
                            <label className={classes.switch} style={{position: "absolute", top: "320px"}}>
                                <input type="checkbox" onChange={this.keepLoggedHandler} />
                                <span className={[classes.slider,classes.round].join(" ")}></span>
                            </label>
                            <div className={classes.buttonContainer} style={{position: "unset", marginTop: "30px"}}>
                                <Button disabled={!this.state.readyForSubmission} clicked={this.loginHandler}>Log In</Button>
                            </div>
                        </div>
                    ) : (
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
                        </div>
                        )
                    }
                    
                    <label className={classes.labelNoAccount} style={this.isMobile ? {marginLeft: "-15px", marginTop: "10px"} : null}>Don't have an account yet?</label>
                    <Link to="/register" className={classes.registerLink}>Register here</Link>
                {flash}
            </div>
        );
    }
}
 
export default Login;