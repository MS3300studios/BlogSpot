import React, {useState, useEffect} from 'react';

import { Link } from 'react-router-dom';
import logout from '../../logout';

import classes from './userphoto.module.css';
import photo from '../../assets/userPhoto/image.jfif'

const UserPhoto = (props) => {
    let userData;
    let getUserData = () => {
        let local = localStorage.getItem('userData');
        let session = sessionStorage.getItem('userData');
        if(local !== null){
            userData = JSON.parse(local);
        }
        else if(session !== null){
            userData = JSON.parse(session);
        }
    }

    const [logOut, setlogOut] = useState(false);
    const [nickname, setNickname] = useState();

    useEffect(() => {
        getUserData();
        setNickname(userData.nickname);
    });

    return ( 
        <div className={classes.dropdown}>
            <img alt="user" src={photo} className={classes.userPhoto}/>
            <div className={classes.dropdownContent}>
                <h1 className={classes.dropdownUsername}>{nickname}</h1>
                <hr />
                <p><Link to="/myProfile" className={classes.myProfileLink}>My Profile</Link></p>
                <p>Settings</p>
                <p onClick={() => setlogOut(true)}>Log Out</p>
                {logOut ? logout() : null}
            </div>
        </div>
    );
}
 
export default UserPhoto;