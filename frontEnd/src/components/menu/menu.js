import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import io from 'socket.io-client';

import { BsPeople, BsPeopleFill } from 'react-icons/bs';

import { IoChatbubbles, IoChatbubblesOutline } from 'react-icons/io5';
import Notifications from '../../containers/notifications/notifications';
import classes from './menu.module.css';
import Logo from '../UI/logo';
import UserPhoto from '../UI/userphoto';
import getUserData from '../../getUserData';
import axios from 'axios';
import getToken from '../../getToken';


class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatPressed: false,
            redirectChat: false,
            peoplePressed: false,
            redirect: false,
            conversations: [],
            messageCount: 0
        }
        
        this.data = getUserData();
        this.token = getToken();
        this.socket = io('http://localhost:3001');
    }

    componentDidMount(){
        this.socket.emit("online", {userId: this.data._id});

        axios({
            method: 'get',
            url: `http://localhost:3001/conversations`,
            headers: {'Authorization': this.token},
        })
        .then((res)=>{
            if(res.status === 200){
                this.setState({conversations: res.data.conversations})
                res.data.conversations.forEach(conv => {
                    this.socket.emit('join', {name: this.data.name, conversationId: conv._id });
                })
            }
        })
        .catch(error => {
            console.log(error);
        })

        this.socket.on('message', message => {
            if(message.authorId !== this.data._id && this.props.location.pathname !== "/chat/" && this.props.location.pathname !== "/conversation/"){
                let msgCnt = this.state.messageCount;
                this.setState({messageCount: msgCnt+1});
            }
        })
    }

    componentWillUnmount(){
        this.state.conversations.forEach(conv => {
            this.socket.emit('leaveConversation', {conversationId: conv._id});
        })
    }

    render() { 
        return (
            <nav className={classes.Menu}>
                <Logo />
                <div className={classes.iconContainer}>
                    <div className={classes.otherIcons}>
                        <div
                            className={classes.friendsIcon}
                            onMouseDown={()=>{
                                this.setState({peoplePressed: true, redirect: true});
                            }}
                            onMouseUp={()=>{
                                this.setState({peoplePressed: false, redirect: false});
                            }} 
                        >                            
                            {this.state.peoplePressed ? <BsPeople size="2em" color="#0a42a4"/> : <BsPeopleFill size="2em" color="#0a42a4"/>}
                        </div>
                        <div
                            className={classes.friendsIcon}
                            onMouseDown={()=>{
                                this.setState({messageCount: 0, chatPressed: true, redirectChat: true});
                            }}
                            onMouseUp={()=>{
                                this.setState({chatPressed: false, redirectChat: false});
                            }} 
                        >                            
                            {
                                this.state.chatPressed ? (
                                    <>
                                        {this.state.messageCount<1 ? null : (
                                            <div className={classes.notificationNumber}>{this.state.messageCount}</div>
                                        )}
                                        <IoChatbubblesOutline size="2em" color="#0a42a4"/>
                                    </>
                                ) : (
                                    <>
                                        {this.state.messageCount<1 ? null : (
                                            <div className={classes.notificationNumber}>{this.state.messageCount}</div>
                                        )}
                                        <IoChatbubbles size="2em" color="#0a42a4"/>
                                    </>
                                )
                            }   
                        </div>
                    </div>
                    <Notifications />        
                </div>
                <UserPhoto userId={this.data._id} dropdown/>
                {this.state.redirect ? <Redirect to="/user/friends/" /> : null}
                {this.state.redirectChat ? <Redirect to="/chat/" /> : null}
            </nav>
        );
    }
}

export default withRouter(Menu);
//username cannot be longer than 21 characters!


/*
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
        })
*/