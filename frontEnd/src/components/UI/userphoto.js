import React, {useState} from 'react';

import logout from '../../logout';

import classes from './userphoto.module.css';
import photo from '../../assets/userPhoto/image.jfif'

const UserPhoto = (props) => {
    const [logOut, setlogOut] = useState(false);

    return ( 
        <div className={classes.dropdown}>
            <img alt="user" src={photo} className={classes.userPhoto}/>
            <div className={classes.dropdownContent}>
                <h1 className={classes.dropdownUsername}>{props.username}</h1>
                <hr />
                <p>My Profile</p>
                <p>Settings</p>
                <p onClick={() => setlogOut(true)}>Log Out</p>
                {logOut ? logout() : null}
            </div>
        </div>
    );
}
 
export default UserPhoto;