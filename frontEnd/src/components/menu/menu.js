import React from 'react';

import { FaUserFriends } from 'react-icons/fa';
import { IoNotifications, IoChatbubbles } from 'react-icons/io5';
import classes from './menu.module.css';
import Logo from '../UI/logo';
import UserPhoto from '../UI/userphoto';

const menu = () => {
    return ( 
        <nav className={classes.Menu}>
            <Logo />
            <div className={classes.iconContainer}>
                <FaUserFriends size="2em" color="#0a42a4"/>
                <IoChatbubbles size="2em" color="#0a42a4"/>
                <IoNotifications size="2em" color="#0a42a4"/>
            </div>
            <UserPhoto/>
        </nav>
    );
}
 
export default menu;

//username cannot be longer than 21 characters!