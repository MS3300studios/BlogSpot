import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios'; 

import Flash from '../../../components/UI/flash';
import classes from './registration.module.css';
import defaultUserPhoto from '../../../assets/gfx/defaultUserPhoto.png';
import Button from '../../../components/UI/button';

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
        }
        
        this.photosubmit.bind(this);
        this.submitUser.bind(this);
        this.inputHandler.bind(this);
        this.flash.bind(this);
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

    photosubmit = (e) => {
        var reader = new FileReader();
        var data;
        console.log(e.target.files)
        if(e.target.files.length>0){
            reader.readAsDataURL(e.target.files[0]);
            let execute = new Promise(function(resolve, reject) {
                reader.onloadend = function() {
                    data = reader.result;
                    resolve(data);
                }
            });
        
            execute.then((b64string)=>{
                this.setState({
                    photoPreview: URL.createObjectURL(e.target.files[0]),
                    photo: b64string
                });
            })
        }
    }

    submitUser = (e) => {
        e.preventDefault();
        if(this.state.name && this.state.surname && this.state.email && this.state.password && this.state.nickname){
            let userData = {
                name: this.state.name,
                surname: this.state.surname,
                email: this.state.email,
                password: this.state.password,
                nickname: this.state.nickname,
                photoString: this.state.photo
            }
            
            axios.post('http://localhost:3001/users/register', userData)
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
        else{
            this.setState({readyForSubmission: false});
            this.flash("fill in all the inputs");
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
            <div className={classes.RegistrationContainer}>
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
                    <input type="file" className={classes.InputPhoto} onChange={this.photosubmit}/>
                    <div className={classes.imgContainer}>
                        <img src={this.state.photoPreview} alt="default"/>
                    </div>
                    <div className={classes.buttonContainer}>
                        <Button clicked={this.submitUser} disabled={!this.state.readyForSubmission}>Register</Button>
                    </div>
                </form>
                <label className={classes.labelLogin}>Alredy have an account?</label>
                <Link to="/login" className={classes.loginLink}>Log in here</Link>
                {this.state.redirectToLogin ? <Redirect to="/login" /> : null}
            </div> 
            {flash}
           </React.Fragment>
        );
    }
}




export default Registration;