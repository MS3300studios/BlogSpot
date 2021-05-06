import React, { Component } from 'react';

import axios from 'axios';
import logout from '../../logout';
import { Link } from 'react-router-dom';
import classes from './userphoto.module.css';
import getToken from '../../getToken';
import getUserData from '../../getUserData';

class UserPhoto extends Component {
    constructor(props){
        super(props);

        let token = getToken();
        let userData = getUserData();

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
        let getData = new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url: `http://localhost:3001/users/getUserPhoto/${this.state.userData._id}`,
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
        return (
            <div className={classes.dropdown}>
            <img alt="user" src={this.state.photo} className={classes.userPhoto}/>
            <div className={classes.dropdownContent}>
                <h1 className={classes.dropdownUsername}>{this.state.nickname}</h1>
                <hr />
                <Link to={"/user/profile/?id="+this.state.userData._id} className={classes.myProfileLink}><p>My Profile</p></Link>
                <p>Settings</p>
                <p onClick={() => this.setState({logOut: true})}>Log Out</p>
                {this.state.logOut ? logout() : null}
            </div>
        </div>
        );
    }
}
 
export default UserPhoto;