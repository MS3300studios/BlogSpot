import React, { Component } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { MAIN_URI } from '../../config';

import { AiOutlineMenu } from 'react-icons/ai';
import { BsPeople, BsPeopleFill } from 'react-icons/bs';
import { IoChatbubbles, IoChatbubblesOutline } from 'react-icons/io5';
import Notifications from '../../containers/notifications/notifications';
import Logo from '../UI/logo';
import UserPhoto from '../UI/userphoto';
import getUserData from '../../getUserData';
import axios from 'axios';
import getToken from '../../getToken';
import getColor from '../../getColor';
import getMobile from '../../getMobile';
import logout from '../../logout';
import Button from '../UI/button';

import dropdownClasses from '../../components/UI/userphoto.module.css';
import classes from './menu.module.css';
import greenClasses from './greenClasses.module.css';
import blueClasses from './blueClasses.module.css';


const isMobile = getMobile();
const colorScheme = getColor();
let colorClasses = greenClasses;
if(colorScheme === "blue"){
    colorClasses = blueClasses;
}

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatPressed: false,
            redirectChat: false,
            peoplePressed: false,
            redirect: false,
            conversations: [],
            messageCount: 0,
            mobileMenuOpened: true,
            closingMobileMenu: false,
            userData: {}
        }
        
        this.data = getUserData();
        this.token = getToken();
    }

    componentDidMount(){
        this.props.socket.emit("online", {userId: this.data._id});

        axios({
            method: 'get',
            url: `${MAIN_URI}/lastReadMessages/countUnread`,
            headers: {'Authorization': this.token}
        })
        .then((res)=>{
            const temp = this.state.messageCount;
            this.setState({messageCount: temp+res.data.count})
        })
        .catch(error => {
            console.log(error);
        })

        axios({
            method: 'get',
            url: `${MAIN_URI}/conversations`,
            headers: {'Authorization': this.token},
        })
        .then((res)=>{
            if(res.status === 200){
                this.setState({conversations: res.data.conversations})
                res.data.conversations.forEach(conv => {
                    this.props.socket.emit('join', {name: this.data.name, conversationId: conv._id });
                })
            }
        })
        .catch(error => {
            console.log(error);
        })

        axios({
            method: 'get',
            url: `http://localhost:3001/users/getUser/${this.data._id}`,
            headers: {'Authorization': this.token}
        })
        .then((res)=>{
            if(res.status===200){
                this.setState({userData: res.data.user})
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })

        this.props.socket.on('message', message => {
            console.log('[menu.js] socket: message was sent')
            if(message.authorId !== this.data._id && this.props.location.pathname !== "/chat/" && this.props.location.pathname !== "/conversation/"){
                let msgCnt = this.state.messageCount;
                this.setState({messageCount: msgCnt+1});
            }
        })
    }

    componentWillUnmount(){
        this.state.conversations.forEach(conv => {
            this.props.socket.emit('leaveConversation', {conversationId: conv._id});
        })
    }

    render() { 
        return (
            <>
                {
                    isMobile ? (
                        <nav className={colorClasses.SmallMenu}>
                            <AiOutlineMenu 
                                size="2em" 
                                color="#0a42a4" 
                                className={this.state.mobileMenuOpened ? classes.menuIconTranslated : classes.menuIcon} 
                                onClick={() => {
                                    if(this.state.mobileMenuOpened){
                                        this.setState({closingMobileMenu: true}, () => {
                                            setTimeout(() => {
                                                this.setState({mobileMenuOpened: false, closingMobileMenu: false});
                                            }, 900);
                                        })
                                    }
                                    else this.setState({mobileMenuOpened: true});
                                }}
                            />
                            <Logo isMobile={isMobile} />
                            {
                                this.state.mobileMenuOpened ? (
                                    <div className={this.state.closingMobileMenu ? classes.closingBackdrop : classes.backdrop} onClick={() => {
                                        this.setState({closingMobileMenu: true}, () => {
                                            setTimeout(() => {
                                                this.setState({mobileMenuOpened: false, closingMobileMenu: false});
                                            }, 900);
                                        })
                                    }}>
                                        <div className={this.state.closingMobileMenu ? classes.closingMobileMenu : classes.mobileMenu}>
                                            <div className={classes.userDetailsContainer}>
                                                <UserPhoto userId={this.data._id} />
                                                <p>{this.state.userData.name+" "+this.state.userData.surname}</p>
                                            </div>
                                            <hr />
                                            <Link to={"/user/profile/?id="+this.data._id} className={dropdownClasses.myProfileLink}><p>My Profile</p></Link>
                                            <Link to="/user/activity" className={dropdownClasses.myProfileLink}><p>My activity</p></Link>
                                            <Link to="/settings" className={dropdownClasses.myProfileLink}><p>Settings</p></Link>
                                            <p>Chat</p>
                                            <p>Friends</p>
                                            <p>Notifications</p>
                                            <p onClick={() => this.setState({logOut: true})} className={dropdownClasses.logoutP}>Log Out</p>
                                            {this.state.logOut ? logout() : null}
                                            <hr />
                                            <Button>
                                                <Link to="/reporting/bug" style={{color: "white", textDecoration: "none"}}>
                                                    Zgłoś błąd
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                ) : null
                            }
                        </nav>
                    ) : (
                        <nav className={colorClasses.Menu}>
                            <Logo isMobile={isMobile} />
                            <div style={{display: "flex", alignItems: "center"}}>
                                <h2 style={{color: "white", marginRight: "10px"}}>BragSpot community testing v 1.0</h2>
                                <Button>
                                    <Link to="/reporting/bug" style={{color: "white", textDecoration: "none"}}>
                                        Zgłoś błąd
                                    </Link>
                                </Button>
                            </div>
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
                        </nav>  
                    ) 
                }
                {this.state.redirect ? <Redirect to="/user/friends/" /> : null}
                {this.state.redirectChat ? <Redirect to="/chat/" /> : null}
            </>
        );
    }
}

const mapStateToProps = socket => {
    return socket;
}

export default connect(mapStateToProps)(withRouter(Menu));