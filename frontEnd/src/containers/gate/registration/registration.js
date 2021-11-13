import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios'; 
import { MAIN_URI } from '../../../config';

import ReCAPTCHA from "react-google-recaptcha";
import Flash from '../../../components/UI/flash';
import defaultUserPhoto from '../../../assets/gfx/defaultUserPhoto.png';
import Button from '../../../components/UI/button';
import DropZone from '../../PhotoForm/dropZone';

import ImageTooBigWarning from '../../../components/imageTooBigWarning';
import classes from './registration.module.css';
import registrationGreen from './registrationGreen.module.css';
import registrationBlue from './registrationBlue.module.css';
import getColor from '../../../getColor';
import getMobile from '../../../getMobile';

let colorClasses = registrationGreen;
const colorScheme = getColor();
if(colorScheme === "blue"){
    colorClasses = registrationBlue;
}

class Registration extends Component {
    constructor(props){
        super(props);
        this.state = { 
            name: "",
            surname: "",
            email: "",
            password: "",
            nickname: "",
            photo: defaultUserPhoto,
            photoPreview: defaultUserPhoto,
            readyForSubmission: false,
            flashMessage: "",
            flashNotClosed: true,
            redirectToLogin: false,
            showCaptcha: false,
            captchaVerified: false,
            imageTooBig: false
        }
        
        this.photosubmit.bind(this);
        this.submitUser.bind(this);
        this.inputHandler.bind(this);
        this.flash.bind(this);
        this.PasswordCorrect.bind(this);
        this.EmailCorrect.bind(this);
        this.captchaVerify.bind(this);

        this.isMobile = getMobile();
    }    

    inputHandler = (e, type) => {
        switch (type) {
            case "name":
                this.setState({name: e.target.value})
                break;
            case "surname":
                this.setState({surname: e.target.value})
                break;
            case "email":
                this.setState({email: e.target.value})
                break;
            case "password":
                this.setState({password: e.target.value})
                break;
            case "nickname":
                this.setState({nickname: e.target.value})
                break;
            default:
                break;
        }
        if(this.state.name!=="" && this.state.surname!=="" && this.state.email!=="" && this.state.password!=="" && this.state.nickname!==""){
            this.setState({readyForSubmission: true});
        }
        else{
            this.setState({readyForSubmission: false});
        }
    }

    photosubmit = (files) => {
        this.setState({imageTooBig: false});
        
        var reader = new FileReader();
        var data;
        if(files.length>0){
            if(Math.round(files[0].size/1024) > 500){
                this.setState({imageTooBig: true});
                return;
            }

            reader.readAsDataURL(files[0]);
            let execute = new Promise(function(resolve, reject) {
                reader.onloadend = function() {
                    data = reader.result;
                    resolve(data);
                }
            });
        
            execute.then((b64string)=>{
                this.setState({
                    photoPreview: URL.createObjectURL(files[0]),
                    photo: b64string
                });
            })
        }
    }

    PasswordCorrect = (password) => {
        let character;
        let foundUpperCase = false;
        let foundNumber = false;
        for(let i = 0; i<=password.length-1; i++){
            character = password.charAt(i);
            if(!isNaN(character)){
                foundNumber = true;
            }
            if(character === character.toUpperCase()){
                foundUpperCase = true;
            }
        }

        if(foundNumber && foundUpperCase && password.length >= 8){
            return true;
        }
        else return false;
    }

    EmailCorrect = (email) => {
        let character;
        let foundAt = false;
        let foundDot = false;
        for(let i = 0; i<=email.length-1; i++){
            character = email.charAt(i);
            if(character === "@"){
                foundAt = true;
            }
            if(character === "."){
                foundDot = true;
            }
        }

        if(foundAt && foundDot){
            return true;
        }
        else return false;
    }

    submitUser = () => {
        if(this.state.nickname.length > 21){
            this.flash("The nickname should be no longer than 21 characters")
        }

        if(this.PasswordCorrect(this.state.password)===false || this.EmailCorrect(this.state.email)===false){
            this.flash("the password should have at least 8 characters, have one digit and upper case letter in it");
        }
        else if(this.PasswordCorrect(this.state.password) && this.EmailCorrect(this.state.email)){
            const userData = {
                name: this.state.name,
                surname: this.state.surname,
                email: this.state.email,
                password: this.state.password,
                nickname: this.state.nickname,
                photoString: this.state.photo
            }     

            axios.post(`${MAIN_URI}/users/register`, userData)
                .then((res)=>{
                    if(Object.keys(res.data).includes("error")){
                        let taken = Object.keys(res.data.error.keyValue)[0]
                        if(taken==="email"){
                            this.setState({readyForSubmission: false});
                            this.flash("email already taken");
                        }
                        else if(taken==="nickname"){
                            this.setState({readyForSubmission: false});
                            this.flash("nickname already taken");
                        }
                    }
                    if(res.status === 201){
                        this.setState({redirectToLogin: true});
                    }
                }).catch( error => {
                    console.log(error);
                    if(error.status === 413){
                        this.setState({readyForSubmission: false});
                        this.flash("Image size too big, maximum image size is 10mb");
                    }
                })   
        }
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

    captchaVerify = (response) => {
        if(response) this.setState({captchaVerified: true}) 
        else{
            return null;
        }
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
            {
                this.state.imageTooBig ? (
                    <ImageTooBigWarning />
                ) : null
            }
            {
                this.isMobile ? (
                    <div className={colorClasses.RegistrationContainer} style={{overflowX: "hidden", width: "unset"}}>
                        <form className={classes.MobileForm}>
                            <h1 style={{marginLeft: "0px"}}>Register</h1>
                            <label>Name:</label><br />
                            <input type="text" placeholder="type your name here" onChange={(e)=> this.inputHandler(e,"name")}/>
                            <br /><label>Surname:</label><br />
                            <input type="text" placeholder="type your surname here" onChange={(e)=> this.inputHandler(e,"surname")}/>
                            <br /><label>E-mail:</label><br />
                            <input type="email" placeholder="type your E-mail here" onChange={(e)=> this.inputHandler(e,"email")}/>
                            <br /><label>Password:</label><br />
                            <input type="password" placeholder="type your Password here" onChange={(e)=> this.inputHandler(e,"password")}/>
                            <br /><label>Nickname:</label><br />
                            <input type="text" placeholder="this will be the name linked to your posts" onChange={(e)=> this.inputHandler(e,"nickname")}/>
                            <br /><label>Your photo:</label><br />
                            <div style={{marginLeft: "90px", marginTop: "10px"}}>
                                <img src={this.state.photoPreview} alt="default"/>
                            </div>
                            <div style={{marginTop: "10px", marginLeft: "40px", width: "70%"}}>
                                <DropZone photoSubmit={this.photosubmit}/>
                            </div>
                            {
                                this.state.showCaptcha ? (
                                    <div className={classes.center}>
                                        <ReCAPTCHA
                                            sitekey="6LeJ1F0cAAAAAAdyLblJwWcVJ7IayxS8hOtLDOtl"
                                            onChange={this.captchaVerify}
                                            theme='light'
                                        />
                                    </div>
                                ) : null
                            }
                            <div style={{marginLeft: "120px"}}>
                                <Button clicked={(e)=>{
                                    e.preventDefault();
                                    this.submitUser();
                                    if(this.state.showCaptcha === false) this.setState({showCaptcha: true})
                                    else if(this.state.captchaVerified===true){
                                    }
                                }} disabled={!(this.state.name!=="" && this.state.surname!=="" && this.state.email!=="" && this.state.password!=="" && this.state.nickname!=="")}>Register</Button>
                            </div>
                            <div style={{marginLeft: "10px"}}>
                                <p>When you click register, you agree to the <br /> <Link to="/termsAndConditions">terms and conditions</Link> of BragSpot</p>
                            </div>
                        </form>
                        <hr style={{margin: "-10px 0px -10px 0px"}} />
                        <div className={classes.bottomLabel}>
                            <label className={classes.labelLogin}>Already have an account?</label> <br />
                            <Link to="/login" className={classes.loginLink}>Log in here</Link>
                        </div>
                    </div>
                ) : (
                    <div className={colorClasses.RegistrationContainer}>
                        <form className={classes.Form}>
                            <h1>Register</h1>
                            <label>Name:</label>
                            <input type="text" placeholder="type your name here" className={classes.InputName} onChange={(e)=> this.inputHandler(e,"name")}/>
                            <label>Surname:</label>
                            <input type="text" placeholder="type your surname here" className={classes.InputSurname} onChange={(e)=> this.inputHandler(e,"surname")}/>
                            <br />
                            <label>E-mail:</label>
                            <input type="email" placeholder="type your E-mail here" className={classes.InputEmail} onChange={(e)=> this.inputHandler(e,"email")}/>
                            <label>Password:</label>
                            <input type="password" placeholder="type your Password here" className={classes.InputPassword} onChange={(e)=> this.inputHandler(e,"password")}/>
                            <label>Nickname:</label>
                            <input type="text" placeholder="this will be the name linked to your posts" className={classes.InputNick} onChange={(e)=> this.inputHandler(e,"nickname")}/>
                            <label>Your photo:</label>
                            <div style={{marginTop: "110px", marginLeft: "40px"}}>
                                <DropZone photoSubmit={this.photosubmit}/>
                            </div>
                            <div className={classes.imgContainer}>
                                <img src={this.state.photoPreview} alt="default"/>
                            </div>
                            {
                                this.state.showCaptcha ? (
                                    <div className={classes.center}>
                                        <ReCAPTCHA
                                            sitekey="6LeJ1F0cAAAAAAdyLblJwWcVJ7IayxS8hOtLDOtl"
                                            onChange={this.captchaVerify}
                                            theme='light'
                                        />
                                    </div>
                                ) : null
                            }
                            <div className={[classes.buttonContainer, classes.center].join(" ")}>
                                <Button clicked={(e)=>{
                                    e.preventDefault();
                                    this.submitUser();
                                    if(this.state.showCaptcha === false) this.setState({showCaptcha: true})
                                    else if(this.state.captchaVerified===true){
                                    }
                                }} disabled={!this.state.readyForSubmission}>Register</Button>
                            </div>
                            <div className={classes.consentContainer}>
                                <p>When you click register, you agree to the <Link to="/termsAndConditions">terms and conditions</Link> of BragSpot</p>
                            </div>
                        </form>
                        <hr style={{margin: "-10px 0px -10px 0px"}} />
                        <div className={classes.bottomLabel}>
                            <label className={classes.labelLogin}>Already have an account?</label> <br />
                            <Link to="/login" className={classes.loginLink}>Log in here</Link>
                        </div>
                    </div> 
                )
            }
            {flash}
            {this.state.redirectToLogin ? <Redirect to="/login" /> : null}
           </React.Fragment>
        );
    }
}




export default Registration;