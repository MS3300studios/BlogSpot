import React, { Component } from 'react';

import classes from './userphoto.module.css';
import getToken from '../../getToken';

class UserPhoto extends Component {
    constructor(props){
        super(props);

        let token = getToken();
        let userData;
        let local = localStorage.getItem('userData');
        let session = sessionStorage.getItem('userData');
        if(local !== null){
            userData = JSON.parse(local);
        }
        else if(session !== null){
            userData = JSON.parse(session);
        }

        this.state = {
            token: token,
            userData: userData,
            logOut: false,
            nickname: userData.nickname,
            userId: userData.nickname,
            photo: null
        }

    }

    componentDidMount() {
        //getUserPhoto
    }


    render() { 
        return (
            <div className={classes.dropdown}>
            <img alt="user" src={userPhoto} className={classes.userPhoto}/>
            <div className={classes.dropdownContent}>
                <h1 className={classes.dropdownUsername}>{nickname}</h1>
                <hr />
                <Link to={"/user/profile/?id="+userId} className={classes.myProfileLink}><p>My Profile</p></Link>
                <p>Settings</p>
                <p onClick={() => setlogOut(true)}>Log Out</p>
                {logOut ? logout() : null}
            </div>
        </div>
        );
    }
}
 
export default UserPhoto;