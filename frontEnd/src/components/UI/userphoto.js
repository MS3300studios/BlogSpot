import React, { Component } from 'react';
import classes from './userphoto.module.css';
import {Link} from 'react-router-dom';

import axios from 'axios';
import logout from '../../logout';
import getToken from '../../getToken';
import getUserData from '../../getUserData';
import Spinner from './spinner';

// import io from 'socket.io-client';
import OnlineIcon from './onlineIcon';

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
            photo: null,
            loading: false,
            conversations: []
        }

        // this.socket = io('http://localhost:3001');
    }

    componentDidMount() {
        /*if(this.props.dropdown){ //only in the menu do we want to signal that the user is online
            this.socket.emit("online", {userId: this.state.userData._id});

            axios({
                method: 'get',
                url: `http://localhost:3001/conversations`,
                headers: {'Authorization': this.state.token},
            })
            .then((res)=>{
                if(res.status === 200){
                    this.setState({conversations: res.data.conversations})
                    res.data.conversations.forEach(conv => {
                        this.socket.emit('join', {name: this.state.userData.name, conversationId: conv._id });
                    })
                }
            })
            .catch(error => {
                console.log(error);
            })

        }
        
        this.socket.on('message', message => {
            console.log(message)
        })*/

        this.setState({loading: true});
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
            this.setState({photo: photo, loading: false});
        })
    }

    // componentWillUnmount(){
    //     this.state.conversations.forEach(conv => {
    //         this.socket.emit('leaveConversation', {conversationId: conv._id});
    //     })
    // }

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
                    <Link to="/user/activity" className={classes.myProfileLink}><p>My activity</p></Link>
                    <Link to="/settings" className={classes.myProfileLink}><p>Settings</p></Link>
                    <p onClick={() => this.setState({logOut: true})}>Log Out</p>
                    {this.state.logOut ? logout() : null}
                </div>
            );
        }

        return (
            <div className={classes.dropdown}>
                {this.state.loading ? <Spinner small darkgreen /> : <img alt="user" src={this.state.photo} className={userPhotoClasses}/>}
                <div className={classes.onlineIconPositioner}>
                    <OnlineIcon online={this.props.userId} hide={this.props.hideOnlineIcon}/>
                </div>
                {dropdown}
            </div>
        );
    }
}
 
export default UserPhoto;