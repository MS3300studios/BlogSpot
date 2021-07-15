import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import getToken from '../../getToken';
import getUserData from '../../getUserData'

import classes from './photoForm.module.css';
import addYourPhoto from '../../assets/gfx/addyourphoto.png';
import Button from '../../components/UI/button';
import Flash from '../../components/UI/flash';
import Spinner from '../../components/UI/spinner';

class PhotoForm extends Component {
    constructor(props) {
        super(props);

        let token = getToken();
        let userData = getUserData();

        this.state = {
            token: token,
            userData: userData,
            description: "",
            photo: null,
            likes: [],
            dislikes: [],
            comments: [],
            photoPreview: null,
            flashMessage: "",
            flashNotClosed: true,
            sending: false,
            redirect: false
        }
        this.inputDesc.bind(this);
        this.photosubmit.bind(this);
        this.sendData.bind(this);
        this.flash.bind(this);
    }

    inputDesc = (e) => {
        this.setState({description: e.target.value});
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

    photosubmit = (e) => {
        var reader = new FileReader();
        var data;
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

    sendData = () => {
        if(!this.state.photo){
            this.flash('you need to add a photo!');
        }
        else{
            this.setState({sending: true});
            axios({
                method: 'post',
                url: `http://localhost:3001/photo/new`,
                headers: {'Authorization': this.state.token},
                data: {
                    authorId: this.state.userData._id,
                    description: this.state.description,
                    photoString: this.state.photo, 
                }
            })
            .then((res)=>{
                this.flash('photo added!');
                this.setState({sending: false});
                setTimeout(()=>{
                    this.setState({redirect: true});
                },1000)
            })
            .catch(error => {
                console.log(error);
                if(error.status === 403){
                    console.log('picture is too large')
                }
            })
        }
    }

    render() { 
        let photoSrc;
        this.state.photoPreview ? photoSrc=this.state.photoPreview : photoSrc=addYourPhoto;

        let flash = null;
        if(this.state.flashMessage && this.state.flashNotClosed){
            flash = <Flash>{this.state.flashMessage}</Flash>
        }
        else if(this.state.flashMessage && this.state.flashNotClosed === false){
            flash = <Flash close>{this.state.flashMessage}</Flash>
        }

        return (
            <React.Fragment>
                <div className={classes.formContainer}>
                    <div className={classes.center}>
                        <h1>Adding Photo</h1>
                    </div>
                    <div className={classes.center}>
                        <textarea onChange={this.inputDesc} placeholder="   add your description here..."/>
                    </div>
                    <br />
                    <div className={classes.center}>
                        <label>Choose your photo:</label>
                    </div>
                    <div className={classes.center}>
                        <input type="file" accept="image/png, image/jpeg" className={classes.InputPhoto} onChange={this.photosubmit}/>
                    </div>
                    <div className={[classes.imgContainer, classes.center].join(" ")}>
                        <img src={photoSrc} alt="default"/>
                    </div>
                    <div className={classes.center}>
                        <Button btnType="Continue" clicked={this.sendData}>{this.state.sending ? <Spinner small /> : <p>Send</p>}</Button>
                        <Button btnType="Cancel" clicked={()=>this.setState({redirect: true})}>Cancel</Button>
                    </div>
                </div>
                {flash}
                {this.state.redirect ? <Redirect to="/myActivity" /> : null}
            </React.Fragment>
        );
    }
}
 
export default PhotoForm;