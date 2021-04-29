import React from 'react';

import { FaUserFriends } from 'react-icons/fa';
import { IoNotifications, IoChatbubbles } from 'react-icons/io5';
import classes from './menu.module.css';
import Logo from '../UI/logo';
import UserPhoto from '../UI/userphoto';

const Menu = () => {
    return ( 
        <nav className={classes.Menu}>
            <Logo />
            <div className={classes.iconContainer}>
                <div className={classes.otherIcons}>
                    <FaUserFriends size="2em" color="#0a42a4"/>
                    <IoChatbubbles size="2em" color="#0a42a4"/>  
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
            <UserPhoto/>
        </nav>
    );
}
 
export default Menu;

//username cannot be longer than 21 characters!