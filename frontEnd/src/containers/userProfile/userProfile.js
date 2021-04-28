import React, { Component } from 'react';
import axios from 'axios';

import classes from './userProfile.module.css';
import photoFiller from '../../assets/userPhoto/image.jfif';
// import Like from '../../components/UI/like';
import { FaUserFriends } from 'react-icons/fa';
import { AiFillPlusCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { BiPhotoAlbum, BiPaperPlane } from 'react-icons/bi';


class UserProfile extends Component {
    constructor(props){
        super(props);

        //getting token
        let token;
        let local = localStorage.getItem('token');
        let session = sessionStorage.getItem('token');
        if(local !== null){
            token = local;
        }
        else if(session !== null){
            token = session;
        }


        let userData = {};
        let userId;
        let userLogged = false;

        if(props.location.pathname === "/myProfile"){
            userLogged = true;
            let local = localStorage.getItem('userData');
            let session = sessionStorage.getItem('userData');
            if(local !== null){
                userData = JSON.parse(local);
            }
            else if(session !== null){
                userData = JSON.parse(session);
            }
            userId = userData._id;
        }
        else{
            let queryParams = new URLSearchParams(props.location.search);
            userId = queryParams.get('id'); 
        }        

        this.state = { 
            token: token,
            userId: userId,
            userData: userData,
            userLogged: userLogged
        }

    }

    componentDidMount () {
        if(this.state.userLogged === false){
            axios({
                method: 'post',
                url: `http://localhost:3001/users/getUser/${this.state.postId}`,
                headers: {'Authorization': this.state.token},
            }).then((res) => {
                console.log(res)
                const user = {
                    nickname: res.data.user.nickname,
                    name: res.data.user.name,
                    surname: res.data.user.surname,
                    email: res.data.user.email,
                    createdAt: res.data.user.createdAt
                };
                this.setState({userData: user});
            })
            .catch(error => {
                console.log(error);
            })
        }
    }

    render() { 
        return ( 
            <React.Fragment>
                <div className={classes.flexContainer}>
                    <div className={classes.mainContainer}>
                        <div className={classes.imgContainer}>
                            <img src={photoFiller} alt="user" className={classes.userPhoto}/>
                        </div>
                        <div className={classes.textInfoContainer}>
                            <h1 className={classes.textNameH1}>Jenny Nguyen</h1>
                            <h2 className={classes.textNameH2}>@Jenny928</h2>
                            <div className={classes.bio}>
                                <p>Lorem ipsum dolor sit amet consectetur adipiscing elit class eget, laoreet arcu volutpat proin ligula etiam sapien nec auctor, donec est morbi taciti nibh felis gravida dui. Varius morbi dui augue imperdiet torquent, cursus ad placerat eget ultrices, cubilia orci ornare mi. Quisque vivamus tempor fringilla nisi pellentesque quis potenti sed. Sit amet consectetur adipiscing elit.</p>
                            </div>
                        </div>
                        <div className={classes.rightPartInfoContainer}>
                            <div className={classes.numberInfoContainer}>
                                <p><FaUserFriends size="1em" color="#0a42a4" /> Friends: 154</p>
                                <p><AiFillPlusCircle size="1em" color="#0a42a4" /> Followers: 12</p>
                                <p><BiPaperPlane size="1em" color="#0a42a4" />Blogs: 420</p>
                                <p><BiPhotoAlbum size="1em" color="#0a42a4" /> Photos: 55</p>
                            </div>
                            <div className={classes.socialButtonsContainer}>
                                <button className={classes.follow}>Follow</button>
                                <button className={classes.addFriend}>Add to friends</button>
                                <button className={classes.sendMessage}>Send Message</button>
                            </div>
                        </div>
                    </div>                    
                 </div>
             </React.Fragment>
        );
    }
}
 
export default UserProfile;


// <Like size="2em" color="blue"/>
// <Like dislike size="2em" color="blue"/>