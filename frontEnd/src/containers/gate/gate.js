import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import getColor from '../../getColor';
import { MAIN_URI } from '../../config';

import greenStyles from './gateGreen.module.css';
import blueStyles from './gateBlue.module.css';

import Flash from '../../components/UI/flash';
import Button from '../../components/UI/button';

import GoogleLogin from 'react-google-login';

import manLeftGreen from '../../assets/gfx/manLeft.png';
import manRightGreen from '../../assets/gfx/manRight.png';
import manLeftBlue from '../../assets/gfx/manLeftBlue.png';
import manRightBlue from '../../assets/gfx/manRightBlue.png';
import speechLeftGreen from '../../assets/gfx/speechLeft.png';
import speechLeftBlue from '../../assets/gfx/speechLeftBlue.png';
import speechRightGreen from '../../assets/gfx/speechRight.png';
import speechRightBlue from '../../assets/gfx/speechRightBlue.png';
import BlogSpotLogoGreen from '../../assets/gfx/BlogSpotLogo.png';
import BlogSpotLogoBlue from '../../assets/gfx/BlogSpotLogoBlue.png';

const colorScheme = getColor();
let classes = greenStyles;
let manLeft = manLeftGreen;
let manRight = manRightGreen;
let speechLeft = speechLeftGreen;
let speechRight = speechRightGreen;
let BlogSpotLogo = BlogSpotLogoGreen;

if(colorScheme === "blue"){
    manLeft = manLeftBlue;
    manRight = manRightBlue;
    speechLeft = speechLeftBlue;
    speechRight = speechRightBlue;
    BlogSpotLogo = BlogSpotLogoBlue;
    classes = blueStyles;
}

class Gate extends Component {
    state = {
        flashMessage: "",
        flashNotClosed: true
    }

    handleGoogleFailure = (res) => {
        this.flash(res.error)
    }

    responseGoogle = (response) => {
        axios.post(`${MAIN_URI}/users/findByGoogleId`, {googleId: `google${response.profileObj.googleId}`}).then(resp => {
            if(resp.data.user){
                //log in user
                axios.post(`${MAIN_URI}/users/login`, {email: response.profileObj.email, password: `google${response.profileObj.googleId}`})
                .then(res => {
                    if(res.status===200){
                        localStorage.setItem('token', res.data.token);
                        let userData = JSON.parse(res.data.userData);
                        userData.password = "";
                        let userDataJSON = JSON.stringify(userData)  
                        localStorage.setItem('userData', userDataJSON);
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
            else{
                //user does not exist, register user:
                let userData = {
                    name: response.profileObj.givenName,
                    surname: response.profileObj.familyName,
                    email: response.profileObj.email,
                    password: `google${response.profileObj.googleId}`,
                    nickname: response.profileObj.name,
                    photoString: response.profileObj.imageUrl
                }
        
                axios.post(`${MAIN_URI}/users/register`, userData)
                .then((res)=>{
                    if(Object.keys(res.data).includes("error")){
                        let taken = Object.keys(res.data.error.keyValue)[0]
                        if(taken==="email"){
                            this.flash("email already taken");
                        }
                        else if(taken==="nickname"){
                            this.flash("nickname already taken");
                        }
                    }
                    if(res.status === 201){
                        //do login stuff
                    }
                }).catch( error => {
                    if(error.status === 413){
                        this.flash("Profile picture size is too big, maximum image size is 10mb");
                    }
                })
            }

        }).catch(err => console.log(err));
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
        let flash = null;
        if(this.state.flashMessage && this.state.flashNotClosed){
            flash = <Flash>{this.state.flashMessage}</Flash>
        }
        else if(this.state.flashMessage && this.state.flashNotClosed === false){
            flash = <Flash close>{this.state.flashMessage}</Flash>
        }

        return (
            <React.Fragment>
                <div className={classes.gateWelcomeH1}>
                    <h1>Welcome to Bragspot!</h1>
                </div>
                <div className={classes.flexCenter}>
                    <div className={classes.imgsContainer}>
                        <img src={manLeft} className={classes.manLeft} alt="failed to load" />
                        <img src={manRight} className={classes.manRight} alt="failed to load" />
                        <img src={speechRight} className={classes.speechRight} alt="failed to load" />
                        <img src={speechLeft} className={classes.speechLeft} alt="failed to load" />
                        <img src={BlogSpotLogo} className={classes.BlogSpotLogo} alt="failed to load" />
                    </div>
                    <div className={classes.cardContainer_gate}>
                        <div className={classes.card}>
                            <h1>Your first time here?</h1>
                            <div className={classes.buttonContainer}>
                                {
                                    this.props.isBanned ? (
                                        <Button disabled>register</Button>
                                    ) : (
                                        <Link to="/register"><Button>register</Button></Link>
                                    )
                                }
                            </div>
                        </div>
                        <div className={classes.card}>
                            <h1>Visiting us again?</h1>
                            <div className={classes.buttonContainer}>
                                {
                                    this.props.isBanned ? (
                                        <Button disabled>login</Button>
                                    ) : (
                                        <Link to="/login"><Button>login</Button></Link>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classes.googleBanner}>
                    <GoogleLogin 
                        clientId="663202900382-uprlid8mck8lndd4ur1d9dujnobt5q8h.apps.googleusercontent.com"
                        buttonText="Sign in with Google"
                        onSuccess={this.responseGoogle}
                        onFailure={this.handleGoogleFailure}
                        cookiePolicy={'single_host_origin'}
                    />
                </div>
                {flash}
            </React.Fragment>
        );
    }
}
 
export default Gate;