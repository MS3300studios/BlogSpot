import React, { Component } from 'react';
import {Link, Redirect} from 'react-router-dom';
import getToken from '../../../getToken';
import getUserData from '../../../getUserData';
import getMobile from '../../../getMobile';

import axios from 'axios';
import DropZone from '../../PhotoForm/dropZone';
import Flash from '../../../components/UI/flash';
import { MAIN_URI } from '../../../config';
import ImageTooBigWarning from '../../../components/imageTooBigWarning';

import classes from './editUserProfile.module.css';
import Spinner from '../../../components/UI/spinner';

class EditUserProfile extends Component {
    constructor(props) {
        super(props);

        let token = getToken();
        let userData = getUserData();

        this.state = {
            token: token,
            userData: userData,

            photo: null,
            photoPreview: null,
            newName: userData.name,
            newSurname: userData.surname,
            newNickname: userData.nickname,
            newBio: userData.bio,
            
            flashMessage: "",
            flashNotClosed: true,
            readyForSubmission: true,
            loading: true,
            loadingSave: false,
            redirectToDashboard: false,
            imageTooBig: false
        }
        this.photosubmit.bind(this);
        this.inputHandler.bind(this);
        this.flash.bind(this);
        this.saveChangedData.bind(this);

        this.isMobile = getMobile(); 
    }

    componentDidMount(){
        axios({
            method: 'get',
            url: `${MAIN_URI}/users/getUserPhoto/${this.state.userData._id}`,
            headers: {'Authorization': this.state.token}
        })
        .then((res)=>{
            this.setState({photo: res.data.photo, photoPreview: res.data.photo, loading: false});
        })
        .catch(error => {
            console.log(error);
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

    inputHandler = (e, type) => {
        switch (type) {
            case "name":
                this.setState({newName: e.target.value})
                break;
            case "surname":
                this.setState({newSurname: e.target.value})
                break;
            case "bio":
                this.setState({newBio: e.target.value})
                break;
            case "nickname":
                this.setState({newNickname: e.target.value})
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

    saveChangedData = () => {
        this.setState({loadingSave: true});
        let whatWasChanged = {
            name: false,
            surname: false,
            nickname: false,
            bio: false
        }
        if(this.state.userData.name !== this.state.newName) whatWasChanged.name = true;
        if(this.state.userData.surname !== this.state.newSurname) whatWasChanged.surname = true;
        if(this.state.userData.nickname !== this.state.newNickname) whatWasChanged.nickname = true;
        if(this.state.userData.bio !== this.state.newBio) whatWasChanged.bio = true;

        if(this.state.newNickname.length > 21){
            this.flash('Your nickname cannot be longer than 21 characters');
            this.setState({loadingSave: false});
        }
        else{
            if(
                this.state.newName !== "" &&
                this.state.newSurname !== "" &&
                this.state.newNickname !== "" &&
                this.state.newBio !== "" 
            ){  
                axios({
                    method: 'post',
                    url: `${MAIN_URI}/users/edit/all`,
                    headers: {'Authorization': this.state.token},
                    data: {
                        wasChanged: whatWasChanged,
                        name: this.state.newName,
                        surname: this.state.newSurname,
                        nickname: this.state.newNickname,
                        bio: this.state.newBio,
                        photo: this.state.photo,
                    }
                })
                .then((res)=>{
                    this.setState({loadingSave: false});
    
                    this.flash("changes were saved, redirecting...")
                    let newUserData = {
                        bio: this.state.newBio,
                        createdAt: this.state.userData.createdAt,
                        debugpass: this.state.userData.debugpass,
                        email: this.state.userData.email,
                        name: this.state.newName,
                        nickname: this.state.newNickname,
                        password: this.state.userData.password,
                        photo: this.state.userData.photo,
                        surname: this.state.newSurname,
                        updatedAt: this.state.userData.updatedAt,
                        __v: this.state.userData.__v,
                        _id: this.state.userData._id
                    }
    
                    let jsonData = JSON.stringify(newUserData);
    
                    let local = localStorage.getItem('userData')
                    if(local){
                        console.log('clearing local')
                        localStorage.clear();
                        sessionStorage.clear();
                        localStorage.setItem('token', this.state.token);
                        localStorage.setItem('userData', jsonData);
                    }
                    else{
                        localStorage.clear();
                        sessionStorage.clear();
                        sessionStorage.setItem('token', this.state.token);
                        sessionStorage.setItem('userData', jsonData);
                    }
    
                    setTimeout(()=>{
                        this.setState({redirectToDashboard: true})
                    }, 1500)
                })
                .catch(error => {
                    console.log(error);
                })
            }
            else{
                this.flash("you need to fill every input!");
            }
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

        const center = {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
        }

        return (
            <>
            {
                this.state.imageTooBig ? (
                    <ImageTooBigWarning />
                ) : null
            }
            <div className={classes.center}>
                {
                    this.isMobile ? (
                        <div className={classes.smallMainContainer} style={{boxSizing: "border-box"}}>
                            <div className={classes.smallImgContainer}>
                                {
                                    this.state.loading ? 
                                    <div style={{marginTop: "-20px"}}><Spinner small/></div> : 
                                    <img src={this.state.photo} alt="your profile" className={classes.smallImg}/>
                                }
                            </div>
                            <div className={classes.center}>
                                <DropZone photoSubmit={this.photosubmit}/>
                            </div>
                            <div className={classes.smallFormContainer}>
                                <div style={center}>
                                    <label>Name:</label>
                                    <input 
                                        type="text" 
                                        value={this.state.newName}
                                        onChange={(e)=> this.inputHandler(e,"name")}/>
                                </div>
                                <div style={center}>
                                    <label>Surname:</label>
                                    <input 
                                        type="text" 
                                        value={this.state.newSurname}
                                        onChange={(e)=> this.inputHandler(e,"surname")}/>
                                </div>
                                <div style={center}>
                                    <label>Nickname:</label>
                                    <input 
                                        type="text" 
                                        value={this.state.newNickname}
                                        onChange={(e)=> this.inputHandler(e,"nickname")}/>
                                </div>
                                <div>
                                    <label>Bio:</label>
                                </div>
                                <div>
                                    <textarea 
                                        onChange={(e)=> this.inputHandler(e,"bio")}
                                        value={this.state.newBio}>
                                    </textarea>
                                </div>
                            </div>
                            <div className={classes.centerBtnSave} style={this.isMobile ? {width: "unset", height: "unset", marginTop: "20px", backgroundColor: "unset"} : null}>
                                <Link to='/'>
                                    <button className={classes.cancelBtn}>cancel</button>
                                </Link>
                                <button onClick={this.saveChangedData}>{this.state.loadingSave ? <Spinner small darkgreen/> : "save changes"}</button>
                            </div>
                        </div>
                    ) : (
                        <div className={classes.mainContainer}>
                            <div className={classes.imgContainer}>
                                {this.state.loading ? <div style={{marginTop: "-20px"}}><Spinner small/></div> : <img src={this.state.photo} alt="your profile"/>}
                                <div className={classes.center}>
                                    <DropZone photoSubmit={this.photosubmit}/>
                                </div>
                            </div>
                            <div className={classes.rightSide}>
                                <div className={classes.center}>
                                    <form>
                                        <div className={classes.inputContainer}>
                                            <label>Name:</label>
                                            <input 
                                                type="text" 
                                                className={classes.InputName} 
                                                value={this.state.newName}
                                                onChange={(e)=> this.inputHandler(e,"name")}/>
                                        </div>
                                        <div className={classes.inputContainer}>
                                            <label>Surname:</label>
                                            <input 
                                                type="text" 
                                                className={classes.InputSurname} 
                                                value={this.state.newSurname}
                                                onChange={(e)=> this.inputHandler(e,"surname")}/>
                                        </div>
                                        <div className={classes.inputContainer}>
                                            <label>Nickname:</label>
                                            <input 
                                                type="text" 
                                                className={classes.InputNick} 
                                                value={this.state.newNickname}
                                                onChange={(e)=> this.inputHandler(e,"nickname")}/>
                                        </div>
                                        <div className={classes.textareaLabel}>
                                            <label>Bio:</label>
                                        </div>
                                        <div className={classes.positionTextarea}>
                                            <textarea 
                                                className={classes.textarea} 
                                                onChange={(e)=> this.inputHandler(e,"bio")}
                                                value={this.state.newBio}>
                                            </textarea>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className={classes.centerBtnSave} style={this.isMobile ? {width: "unset", height: "unset", marginTop: "20px", backgroundColor: "unset"} : null}>
                                <Link to='/'>
                                    <button className={classes.cancelBtn}>cancel</button>
                                </Link>
                                <button onClick={this.saveChangedData}>{this.state.loadingSave ? <Spinner small darkgreen/> : "save changes"}</button>
                            </div>
                        </div>
                    )
                }
            </div>
            {flash}
            {this.state.redirectToDashboard ? <Redirect to={"/user/profile/?id="+this.state.userData._id} /> : null}
            </>
        );
    }
}
 
export default EditUserProfile;