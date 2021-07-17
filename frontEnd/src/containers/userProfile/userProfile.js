import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import classes from './userProfile.module.css';
import Flash from '../../components/UI/flash';
import TabSelector from './tabSelector/tabSelector';
import getToken from '../../getToken';
import FriendButton from './friendButton/friendButton';

import { BsPencil } from 'react-icons/bs';
import { GoPencil } from 'react-icons/go';
import getUserData from '../../getUserData';
import Spinner from '../../components/UI/spinner';
import NumberInfoContainer from './numberInfoContainer/numberInfoContainer';

class UserProfile extends Component {
    constructor(props){
        super(props);

        //getting token
        let token = getToken();

        //getting userId from params
        let queryParams = new URLSearchParams(this.props.location.search);
        let userId = queryParams.get('id'); 
        //getting currently logged user data
        let userData = getUserData();
        
        //determining wether the profile of the user is the user currently logged
        let userLogged = false;
        if(userId === userData._id){
            userLogged = true;
        }

        this.state = { 
            userPhoto: null,
            token: token,
            userId: userId,
            userData: userData,
            userLogged: userLogged,
            currentSelectedMenu: 'Blogs',
            blogsClass: [classes.border, classes.active],
            photosClass: [classes.border],
            friendsClass: [classes.border],
            badgesClass: [classes.border],
            editPressed: false,
            editing: false,
            isFriend: false,
            requestActive: false,
            receivedRequest: false,
            friendBtnDataRdy: false,
            flashMessage: "",
            flashNotClosed: true,
        }
        this.handleMenuSelect.bind(this);
        this.flash.bind(this);
        this.setFriendRequestStatus.bind(this);
        this.friendButtonAction.bind(this);
    }

    componentDidMount () {
        if(this.state.userLogged === false){
            axios({
                method: 'get',
                url: `http://localhost:3001/users/getUser/${this.state.userId}`,
                headers: {'Authorization': this.state.token},
            }).then((res) => {
                const user = {
                    nickname: res.data.user.nickname,
                    name: res.data.user.name,
                    surname: res.data.user.surname,
                    email: res.data.user.email,
                    bio: res.data.user.bio,
                    createdAt: res.data.user.createdAt
                };
                this.setState({userData: user});
            })
            .catch(error => {
                console.log(error);
            })
        }
        let getData = new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url: `http://localhost:3001/users/getUserPhoto/${this.state.userId}`,
                headers: {'Authorization': this.state.token},
            }).then((res) => {
                resolve(res.data.photo);
            })
            .catch(error => {
                reject(error);
            })
        })

        getData.then((photo)=>{
            this.setState({userPhoto: photo});
        })
        //check if user is friend
        axios({
            method: 'post',
            url: `http://localhost:3001/checkFriendStatus`,
            headers: {'Authorization': this.state.token},
            data: {
                friendId: this.state.userId
            }
        })
        .then((res)=>{
            if(res.data.isFriend === false){
                axios({
                    method: 'post',
                    url: `http://localhost:3001/checkFriendRequest`,
                    headers: {'Authorization': this.state.token},
                    data: {friendId: this.state.userId}
                })
                .then((res2)=>{
                    this.setState({isFriend: res.data.isFriend, receivedRequest: res2.data.iReceivedRequest, friendBtnDataRdy: true});
                })
                .catch(error => {
                    console.log(error);
                })
            }
            else{
                this.setState({isFriend: res.data.isFriend, friendBtnDataRdy: true});
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    flash = (message) => {
        this.setState({flashMessage: message});
        
        setTimeout(()=>{
            this.setState({flashNotClosed: false});
        }, 2000)

        setTimeout(()=>{
            this.setState({flashMessage: ""});
        }, 3000);
    
        setTimeout(()=>{
            this.setState({flashNotClosed: true});
        }, 3000);
    }

    setFriendRequestStatus = (data) => {
        this.setState({requestActive: data});
    }

    friendButtonAction = (option) => {
        switch (option) {
            case "removeFriend":
                console.log('remove friend')
                axios({
                    method: 'post',
                    url: `http://localhost:3001/deleteFriend`,
                    headers: {'Authorization': this.state.token},
                    data: { friendId: this.state.userId }
                })
                .then((res)=>{
                    console.log(res.status);
                    if(res.status === 200){
                        this.setState({isFriend: false});
                        this.flash(`${this.state.userData.name} ${this.state.userData.surname} removed from friends`);
                    }
                })
                .catch(error => {
                    console.log(error);
                })
                break;
            case "removeRequest":
                console.log('remove request')
                axios({
                    method: 'post',
                    url: `http://localhost:3001/revokeRequest`,
                    headers: {'Authorization': this.state.token},
                    data: { friendId: this.state.userId }
                })
                .then((res)=>{
                    if(res.data==="deletion successful"){
                        this.flash("friend request deleted");
                        this.setState({requestActive: false});
                        return;
                    }
                })
                .catch(error => {
                    console.log(error);
                })
                break;
            case "addRequest":
                console.log('add request')
                axios({
                    method: 'post',
                    url: `http://localhost:3001/createRequest`,
                    headers: {'Authorization': this.state.token},
                    data: { friendId: this.state.userId }
                })
                .then((res)=>{
                    if(res.status===201){
                        this.setState({requestActive: true});
                        this.flash("friend request sent successfully");
                        return;
                    }
                })
                .catch(error => {
                    console.log(error);
                })
                break;
            case "acceptFriendRequest":
                //redux remove notif
                console.log('accept friend request');       
                axios({
                    method: 'post',
                    url: `http://localhost:3001/anwserRequest`,
                    headers: {'Authorization': this.state.token},
                    data: { accept: true, friendId: this.state.userId }
                })
                .then((res)=>{
                    if(res.status===201){
                        this.flash("friend request accepted");
                        return;
                    }
                })
                .catch(error => {
                    console.log(error);
                })
                break;
            case "declineFriendRequest":
                //redux remove notif
                console.log('decline friend request');
                axios({
                    method: 'post',
                    url: `http://localhost:3001/anwserRequest`,
                    headers: {'Authorization': this.state.token},
                    data: { accept: false }
                })
                .then((res)=>{
                    if(res.status===201){
                        this.flash("friend request declined");
                        return;
                    }
                })
                .catch(error => {
                    console.log(error);
                })
                break;
            default:
                console.log("[userProfile] sendAction: incorrect option passed as an argument");
                break;
        }
        
    }

    handleMenuSelect(selectedOption){
        let array;
        switch (selectedOption) {
            case 'Blogs': 
            {
                array = this.state.blogsClass;
                array.push(classes.active);
                this.setState({
                    blogsClass: array, 
                    photosClass: [classes.border], 
                    friendsClass: [classes.border], 
                    badgesClass: [classes.border],
                    currentSelectedMenu: 'Blogs'
                });
                break;
            }                
            
            case 'Photos':{
                array = this.state.photosClass;
                array.push(classes.active);
                this.setState({
                    blogsClass: [classes.border], 
                    photosClass: array, 
                    friendsClass: [classes.border], 
                    badgesClass: [classes.border],
                    currentSelectedMenu: 'Photos'
                });
                break;
            }
            
            case 'Friends': {
                array = this.state.friendsClass;
                array.push(classes.active);
                this.setState({
                    blogsClass: [classes.border], 
                    photosClass: [classes.border], 
                    friendsClass: array, 
                    badgesClass: [classes.border],
                    currentSelectedMenu: 'Friends'
                });
                break;
            }                

            case 'Badges': {
                array = this.state.badgesClass;
                array.push(classes.active);
                this.setState({
                    blogsClass: [classes.border], 
                    photosClass: [classes.border], 
                    friendsClass: [classes.border], badgesClass: array,
                    currentSelectedMenu: 'Badges'
                });
                break;
            }
                            
            default:
                console.log('default')
        }
    }

    render() { 

        let editIcon = (
            <div className={classes.editIconContainer}>
                <div 
                    className={classes.editIcon}
                    onMouseDown={(e)=>{
                        this.setState({editPressed: true, editing: true})
                        // this.sendEditedBio(e, this.state.content)
                    }}
                    onMouseUp={()=>{this.setState({editPressed: false})}} 
                >
                    {this.state.editPressed ? <GoPencil size="1.5em" color="#0a42a4" /> : <BsPencil size="1.5em" color="#0a42a4" /> } 
                </div>
            </div>
        )

        let userImg = <Spinner darkgreen />
        if(this.state.userPhoto){
            userImg = <img src={this.state.userPhoto} alt="user" className={classes.userPhoto}/>
        }

        let flash = null;
        if(this.state.flashMessage && this.state.flashNotClosed){
            flash = <Flash>{this.state.flashMessage}</Flash>
        }
        else if(this.state.flashMessage && this.state.flashNotClosed === false){
            flash = <Flash close>{this.state.flashMessage}</Flash>
        }

        return ( 
            <React.Fragment>
                <div className={classes.flexContainer}>
                    <div className={classes.mainContainer}>
                        <div className={classes.imgContainer}>
                            {userImg}
                        </div>
                        <div className={classes.textInfoContainer}>
                            <h1 className={classes.textNameH1}>{this.state.userData.name+" "+this.state.userData.surname}</h1>
                            <h2 className={classes.textNameH2}>@{this.state.userData.nickname}</h2>
                            <div className={classes.bio}>
                                <p>{this.state.userData.bio}</p>
                                {editIcon}
                            </div>
                        </div>
                        <div className={classes.rightPartInfoContainer}>
                            <NumberInfoContainer token={this.state.token} userId={this.state.userId} />
                            {
                                this.state.userLogged ? (
                                    <div className={classes.editYourProfileContainer}>
                                        <Link to="/editProfile">
                                            <button className={classes.editYourProfile}>Edit your profile</button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className={classes.socialButtonsContainer}>
                                        <button className={classes.follow}>Follow</button>
                                        {this.state.friendBtnDataRdy ? (
                                            <FriendButton 
                                                receivedRequest={this.state.receivedRequest}
                                                isFriend={this.state.isFriend} 
                                                pressAction={this.friendButtonAction}
                                                friendId={this.state.userId}
                                            />
                                        ) : <Spinner darkgreen />}
                                        
                                        <button className={classes.sendMessage}>Send Message</button>
                                    </div>
                                )
                            }
                        </div>
                    </div>                    
                 </div>
                 <div className={classes.flexContainer}>
                    <div className={classes.userProfileMenu}>
                        <div className={classes.userProfileMenuItem} onClick={() => this.handleMenuSelect('Blogs')}>
                            <div className={this.state.blogsClass.join(" ")}></div>
                            <p>Blogs</p>
                        </div>
                        <div className={classes.userProfileMenuItem} onClick={() => this.handleMenuSelect('Photos')}>
                            <div className={this.state.photosClass.join(" ")}></div>
                            <p>Photos</p>
                        </div>
                        <div className={classes.userProfileMenuItem} onClick={() => this.handleMenuSelect('Friends')}>
                            <div className={this.state.friendsClass.join(" ")}></div>
                            <p>Friends</p>
                        </div>
                        <div className={classes.userProfileMenuItem} onClick={() => this.handleMenuSelect('Badges')}>
                            <div className={this.state.badgesClass.join(" ")}></div>
                            <p>Badges</p>
                        </div>
                    </div>
                 </div>
                 <div className={classes.center}>
                    <TabSelector selectedOption={this.state.currentSelectedMenu} userId={this.props.location.search}/>
                 </div>
                 {flash}
             </React.Fragment>
        );
    }
}
 
export default UserProfile;