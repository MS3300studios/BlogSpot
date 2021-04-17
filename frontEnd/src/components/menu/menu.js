import React from 'react';

import classes from './menu.module.css';
import Logo from '../UI/logo';
import UserPhoto from '../UI/userphoto';

const menu = () => {
    return ( 
        <nav className={classes.Menu}>
            <Logo />
            <UserPhoto username="Alice Wonderfell" />
        </nav>
    );
}
 
export default menu;

//username cannot be longer than 21 characters!