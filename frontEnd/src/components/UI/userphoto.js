import React, {useState, useEffect} from 'react';
import axios from 'axios';

import getToken from '../../getToken';
import { Link } from 'react-router-dom';
import logout from '../../logout';

import classes from './userphoto.module.css';
// import User from '../../../../models/user';
// import photo from '../../assets/userPhoto/image.jfif'

const UserPhoto = (props) => {
    let token = getToken();
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
    const [userId, setuserId] = useState();
    // const [userphoto, setuserphoto] = useState();


    useEffect(() => {
        getUserData();
        setNickname(userData.nickname);
        setuserId(userData._id); 
    });


    let userPhoto;
    axios({
        method: 'get',
        url: `http://localhost:3001/users/getUserPhoto/${userData._id}`,
        headers: {'Authorization': token},
    }).then((res) => {
        userPhoto = res.data.photo;
    })
    .catch(error => {
        console.log(error);
    })



    // let getData = new Promise((resolve, reject) => {
    //     axios({
    //         method: 'get',
    //         url: `http://localhost:3001/users/getUserPhoto/${userData._id}`,
    //         headers: {'Authorization': token},
    //     }).then((res) => {
    //         resolve(res.data.photo);
    //     })
    //     .catch(error => {
    //         reject(error);
    //     })
    // })

    // let userPhoto;
    // getData.then((photo)=>{
    //     userPhoto = photo;
    // })

    return ( 
        <div className={classes.dropdown}>
            <img alt="user" src={userPhoto} className={classes.userPhoto}/>
            <div className={classes.dropdownContent}>
                <h1 className={classes.dropdownUsername}>{nickname}</h1>
                <hr />
                <Link to={"/user/profile/?id="+userId} className={classes.myProfileLink}><p>My Profile</p></Link>
                <p>Settings</p>
                <p onClick={() => setlogOut(true)}>Log Out</p>
                {logOut ? logout() : null}
            </div>
        </div>
    );
}
 
export default UserPhoto;