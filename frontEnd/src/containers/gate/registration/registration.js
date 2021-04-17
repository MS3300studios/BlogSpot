import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios'; 
import convertBase64 from '../../../convertFileToBase64';

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
            redirectToLogin: false
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
    
    photosubmit = async (e) => {
        const photo64 = await convertBase64(e.target.files[0]);
        this.setState({
            photoPreview: URL.createObjectURL(e.target.files[0]),
            photo: photo64
        });

    }

    submitUser = (e) => {
        e.preventDefault();
        if(this.state.name && this.state.surname && this.state.email && this.state.password && this.state.nickname){
            let name = this.state.name;
            let surname = this.state.surname;
            let email = this.state.email;
            let password = this.state.password;
            let nickname = this.state.nickname;
            // let photo = this.state.photo;
            // let userData = {
            //     name: name,
            //     surname: surname,
            //     email: email,
            //     password: password,
            //     nickname: nickname,
            //     photo: photo
            // }
            let userData = {
                name: name,
                surname: surname,
                email: email,
                password: password,
                nickname: nickname,
            }
            axios.post('http://localhost:3001/users/register', userData)
                    .then((res)=>{
                        console.log(res.status)
                        if(res.data==="both"){
                            this.setState({readyForSubmission: false});
                            this.flash("email and nickname already taken");
                        }
                        else if(res.data==="email"){
                            this.setState({readyForSubmission: false});
                            this.flash("email already taken");
                        }
                        else if(res.data==="nickname"){
                            this.setState({readyForSubmission: false});
                            this.flash("nickname already taken");
                        }
                        else if(res.status === 201){
                            console.log('res status 201 in React, user registered with success')
                            //redirect to login page
                            console.log('i will redirect the user to login page now')
                            this.setState({redirectToLogin: true});
                        }
                    }).catch( error => {
                        if(error.response.status === 413){
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
                <label className={classes.labelLogin}>Don't have an account yet?</label>
                <Link to="/login" className={classes.loginLink}>Log in here</Link>
                {this.state.redirectToLogin ? <Redirect to="/login"/> : null}
            </div> 
            {flash}
           </React.Fragment>
        );
    }
}




export default Registration;