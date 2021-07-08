import React, { Component } from 'react';
import classes from './userphoto.module.css';

import axios from 'axios';
import logout from '../../logout';
import getToken from '../../getToken';
import getUserData from '../../getUserData';

class UserPhoto extends Component {
    constructor(props){
        super(props);

        let token = getToken();
        let userData = getUserData();
        
        let userId = userData._id; //load user profile photo by default
        if(props.userId){
            userId = props.userId;
        }

        this.state = {
            token: token,
            userData: userData,
            logOut: false,
            nickname: userData.nickname,
            userId: userId,
            photo: null
        }
    }

    componentDidMount() {
        let getData = new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url: `http://localhost:3001/users/getUserPhoto/${this.state.userId}`,
                headers: {'Authorization': this.state.token},
            }).then((res) => {
                resolve(res.data.photo);
            })
            .catch(error => {
                reject(error);
            })
        })

        getData.then((photo)=>{
            this.setState({photo: photo});
        })
    }

    render() { 
        let userPhotoClasses = classes.userPhoto;
        if(this.props.small){
            userPhotoClasses = classes.smallUserPhoto;
        }
        if(this.props.smallPhotoCommentForm){
            userPhotoClasses = classes.smallPhotoCommentForm;
        }

        let dropdown = null;
        if(this.props.dropdown){
            dropdown = (
                <div className={classes.dropdownContent}>
                    <h1 className={classes.dropdownUsername}>{this.state.nickname}</h1>
                    <hr />
                    <a href={"/user/profile/?id="+this.state.userData._id} className={classes.myProfileLink}><p>My Profile</p></a>
                    <p>Settings</p>
                    <p onClick={() => this.setState({logOut: true})}>Log Out</p>
                    {this.state.logOut ? logout() : null}
                </div>
            );
        }

        return (
            <div className={classes.dropdown}>
                <img alt="user" src={this.state.photo} className={userPhotoClasses}/>
                {dropdown}
            </div>
        );
    }
}
 
export default UserPhoto;


// <Link to={"/user/profile/?id="+this.state.userData._id} className={classes.myProfileLink}><p>My Profile</p></Link>
