import React from 'react';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';

import { BsPeople, BsPeopleFill } from 'react-icons/bs';

import { IoNotifications, IoChatbubbles, IoChatbubblesOutline } from 'react-icons/io5';
import classes from './menu.module.css';
import Logo from '../UI/logo';
import UserPhoto from '../UI/userphoto';
import getUserData from '../../getUserData';

let data = getUserData();

const Menu = () => {
    //chat 
    const [chatPressed, setchatPressed] = useState(false);
    const [redirectChat, setredirectChat] = useState(false);
    //friends
    const [peoplePressed, setpeoplePressed] = useState(false);
    const [redirect, setredirect] = useState(false);

    return ( 
        <nav className={classes.Menu}>
            <Logo />
            <div className={classes.iconContainer}>
                <div className={classes.otherIcons}>
                    <div
                        className={classes.friendsIcon}
                        onMouseDown={()=>{
                            setpeoplePressed(true);
                            setredirect(true);
                        }}
                        onMouseUp={()=>{
                            setpeoplePressed(false);
                            setredirect(false);
                        }} 
                    >                            
                        {peoplePressed ? <BsPeople size="2em" color="#0a42a4"/> : <BsPeopleFill size="2em" color="#0a42a4"/>}
                    </div>
                    <div
                        className={classes.friendsIcon}
                        onMouseDown={()=>{
                            setchatPressed(true);
                            setredirectChat(true);
                        }}
                        onMouseUp={()=>{
                            setchatPressed(false);
                            setredirectChat(false);
                        }} 
                    >                            
                        {chatPressed ? <IoChatbubblesOutline size="2em" color="#0a42a4"/> : <IoChatbubbles size="2em" color="#0a42a4"/>}
                    </div>
                </div>
                <div className={classes.dropdown}>
                    <div className={classes.center}><IoNotifications size="2em" color="#0a42a4"/><div className={classes.notificationNumber}>6</div></div> 
                    <div className={classes.dropdownContent}>
                        <p>notification</p>
                        <hr />
                        <p>notification</p>
                        <hr />
                        <p>notification</p>
                        <hr />
                        <p>notification</p>
                        <hr />
                        <p>notification</p>
                        <hr />
                        <p>notification</p>
                    </div>                    
                </div>          
            </div>
            <UserPhoto userId={data._id} dropdown/>
            {redirect ? <Redirect to="/user/friends/" /> : null}
            {redirectChat ? <Redirect to="/chat/" /> : null}
        </nav>
    );
}
 
export default Menu;

//username cannot be longer than 21 characters!