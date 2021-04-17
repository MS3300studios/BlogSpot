import React from 'react';

import classes from './userphoto.module.css';
import photo from '../../assets/userPhoto/image.jfif'

const userPhoto = (props) => {
    return ( 
        <div className={classes.dropdown}>
            <img alt="user" src={photo} className={classes.userPhoto}/>
            <div className={classes.dropdownContent}>
                <h1 className={classes.dropdownUsername}>{props.username}</h1>
                <hr />
                <p>My Profile</p>
                <p>Settings</p>
                <p>Log Out</p>
            </div>
        </div>
    );
}
 
export default userPhoto;