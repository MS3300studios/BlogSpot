import React, { Component } from 'react';
import getToken from '../../../getToken';
import getUserData from '../../../getUserData';
import axios from 'axios';
import DropZone from '../../PhotoForm/dropZone';
import {Link} from 'react-router-dom';

import classes from './editUserProfile.module.css';

import photo from '../../../assets/gfx/UserPhoto.png';

class EditUserProfile extends Component {
    constructor(props) {
        super(props);

        let token = getToken();
        let userData = getUserData();

        this.state = {
            token: token,
            userData: userData,

            photo: photo,
            photoPreview: photo,
            newName: userData.name,
            newSurname: userData.surname,
            newNickname: userData.nickname,
            newBio: userData.bio,
            
            flashMessage: "",
            flashNotClosed: true,
            readyForSubmission: true
        }
        this.photosubmit.bind(this);
        this.inputHandler.bind(this);
        this.flash.bind(this);
    }

    componentDidMount(){
        axios({
            method: 'get',
            url: `http://localhost:3001/users/getUserPhoto/${this.state.userData._id}`,
            headers: {'Authorization': this.state.token}
        })
        .then((res)=>{
            this.setState({photo: res.data.photo, photoPreview: res.data.photo});
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
        var reader = new FileReader();
        var data;
        if(files.length>0){
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

    render() { 
        return (
            <>
            <div className={classes.center}>
                <div className={classes.mainContainer}>
                    <div className={classes.imgContainer}>
                        <img src={this.state.photo} alt="your profile"/>
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
                </div>
            </div>
            <div className={classes.centerBtnSave}>
                <Link to='/'>
                    <button className={classes.cancelBtn}>cancel</button>
                </Link>
                <button>save changes</button>
            </div>
            </>
        );
    }
}
 
export default EditUserProfile;