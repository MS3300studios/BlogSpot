import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MAIN_URI } from '../../config';

import searchbarClasses from '../../components/UI/searchBar.module.css';
import classes from './userProfile.module.css';
import Flash from '../../components/UI/flash';
import TabSelector from './tabSelector/tabSelector';
import getToken from '../../getToken';
import FriendButton from './friendButton/friendButton';
import Button from '../../components/UI/button';

import { BsPencil } from 'react-icons/bs';
import { MdMessage } from 'react-icons/md';
import { GoPencil } from 'react-icons/go';
import { BiBlock } from 'react-icons/bi';
import { MdReport } from 'react-icons/md';
import getUserData from '../../getUserData';
import Spinner from '../../components/UI/spinner';
import NumberInfoContainer from './numberInfoContainer/numberInfoContainer';
import OnlineIcon from '../../components/UI/onlineIcon';
import getColor from '../../getColor';
import UserNotFound from '../../components/UI/userNotFound';
import getMobile from '../../getMobile';
import MobileUserProfile from './mobileUserProfile/mobileUserProfile';

class UserProfile extends Component {
    constructor(props){
        super(props);

        //getting token
        const token = getToken();

        //getting userId from params
        const queryParams = new URLSearchParams(this.props.location.search);
        const userId = queryParams.get('id'); 
        //getting currently logged user data
        const userData = getUserData();
        
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
            isBlocked: false,
            requestActive: false,
            receivedRequest: false,
            friendBtnDataRdy: false,
            flashMessage: "",
            flashNotClosed: true,
            editBio: userData.bio,
            userNotFound: false
        }
        this.handleMenuSelect.bind(this);
        this.flash.bind(this);
        this.setFriendRequestStatus.bind(this);
        this.friendButtonAction.bind(this);
        this.editBioHandle.bind(this);
        this.sendEditedBio.bind(this);
        this.blockUser.bind(this);
        this.removeBlock.bind(this);
        this.getDataInit.bind(this);

        this.isMobile = getMobile();
    }

    componentDidMount () {
        this.getDataInit();
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.location.search !== prevProps.location.search){
            window.location.reload();
        }
    }

    getDataInit = () => {
        let queryParams = new URLSearchParams(this.props.location.search);
        let userId = queryParams.get('id');         
        //determining wether the profile of the user is the user currently logged
        let userLogged = false;
        if(userId === this.state.userData._id){
            userLogged = true;
        }

        if(userLogged === false){
            axios({
                method: 'get',
                url: `${MAIN_URI}/users/getUser/${this.state.userId}`,
                headers: {'Authorization': this.state.token},
            }).then((res) => {
                if(res.data.user === null){
                    this.setState({userNotFound: true});
                    return
                }
                const user = {
                    nickname: res.data.user.nickname,
                    name: res.data.user.name,
                    surname: res.data.user.surname,
                    email: res.data.user.email,
                    bio: res.data.user.bio,
                    createdAt: res.data.user.createdAt
                };
                this.setState({userData: user, editBio: user.bio, isBlocked: res.data.blocked});
            })
            .catch(error => {
                console.log(error);
            })
        }

        let getData = new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url: `${MAIN_URI}/users/getUserPhoto/${this.state.userId}`,
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
            url: `${MAIN_URI}/checkFriendStatus`,
            headers: {'Authorization': this.state.token},
            data: {
                friendId: this.state.userId
            }
        })
        .then((res)=>{
            if(res.data.isFriend === false){
                axios({
                    method: 'post',
                    url: `${MAIN_URI}/checkFriendRequest`,
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

    editBioHandle = (ev) => {
        this.setState({editBio: ev.target.value});
    }

    sendEditedBio = () => {
        axios({
            method: 'post',
            url: `${MAIN_URI}/users/edit/bio`,
            headers: {'Authorization': this.state.token},
            data: {newBio: this.state.editBio}
        })
        .then((res)=>{
            if(res.status===200){
                let userData = {
                    bio: this.state.editBio,
                    createdAt: this.state.userData.createdAt,
                    debugpass: this.state.userData.debugpass,
                    email: this.state.userData.email,
                    name: this.state.userData.name,
                    nickname: this.state.userData.nickname,
                    password: this.state.userData.password,
                    photo: this.state.userData.photo,
                    surname: this.state.userData.surname,
                    updatedAt: this.state.userData.updatedAt,
                    __v: this.state.userData.__v,
                    _id: this.state.userData._id
                }
                
                console.log(userData.bio)

                let newUserData = JSON.stringify(userData);
                let token = this.state.token;

                let local = localStorage.getItem('userData')
                if(local){
                    localStorage.clear();
                    localStorage.setItem('userData', newUserData);
                    localStorage.setItem('token', token);
                }else{
                    sessionStorage.clear();
                    sessionStorage.setItem('userData', newUserData);
                    sessionStorage.setItem('token', token);
                }

                this.setState({editing: false});
                return;
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
                axios({
                    method: 'post',
                    url: `${MAIN_URI}/deleteFriend`,
                    headers: {'Authorization': this.state.token},
                    data: { friendId: this.state.userId }
                })
                .then((res)=>{
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
                axios({
                    method: 'post',
                    url: `${MAIN_URI}/revokeRequest`,
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
                axios({
                    method: 'post',
                    url: `${MAIN_URI}/createRequest`,
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
                axios({
                    method: 'post',
                    url: `${MAIN_URI}/anwserRequest`,
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
                console.log('decline friend request');
                axios({
                    method: 'post',
                    url: `${MAIN_URI}/anwserRequest`,
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

    removeBlock = () => {
        axios({
            method: 'post',
            url: `${MAIN_URI}/blocking/removeBlock`,
            headers: {'Authorization': this.state.token},
            data: {blockedUserId: this.state.userId}
        })
        .then((res)=>{
            if(res.status===200){
                this.setState({isBlocked: false});
                this.flash('user was removed from your blocked users list (see it go to settings -> blocked users)')
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    blockUser = (userId) => {
        axios({
            method: 'post',
            url: `${MAIN_URI}/blocking/addBlock`,
            headers: {'Authorization': this.state.token},
            data: {userToBeBlockedId: userId}
        })
        .then((res)=>{
            if(res.status===200){
                this.setState({isBlocked: true});
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    render() { 
        let editIcon = null;
        if(this.state.userLogged){
            editIcon = (
                <div className={classes.editIconContainer}>
                    <div 
                        className={classes.editIcon}
                        onMouseDown={(e)=>{
                            this.setState({editPressed: true, editing: true})
                            // this.sendEditedBio(e, this.state.content)
                        }}
                        onMouseUp={()=>{this.setState({editPressed: false})}} 
                    >
                        {this.state.editPressed ? <GoPencil size="1.5em" color="#fff" /> : <BsPencil size="1.5em" color="#fff" /> } 
                    </div>
                </div>
            );
        }

        let userImg = <div className={[classes.userPhoto, classes.userPhotoLoading].join(" ")}></div>
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

        let sendMessageButton = null;
        if(this.state.isFriend && this.state.isBlocked === false){
            sendMessageButton = (
                <Link to={`/conversation/?friendId=${this.state.userId}`} className={classes.sendMessageLink}>
                    <button className={classes.sendMessage}><MdMessage size="1.5em" color="#FFF" /> Send Message</button>
                </Link>
            );
        }
        else if(this.state.isFriend && this.state.isBlocked === true){
            sendMessageButton = (
                <button className={classes.unblockUser} onClick={this.removeBlock}><BiBlock size="1.5em" color="#FFF" /> Unblock user</button>
            );
        }

        const colorScheme = getColor();
        let backgroundColor = {backgroundColor: "#70c45c"}; 
        let backgroundColorDarker = {backgroundColor: "#83dc61"};
        let editYourProfileBgColor = {backgroundColor: "teal"}; 
        if(colorScheme === "blue"){
            backgroundColor = {backgroundColor: "hsl(210deg 66% 52%)"};
            backgroundColorDarker = {backgroundColor: "hsl(244, 46%, 44%)"};
            editYourProfileBgColor = {backgroundColor: "rgb(67, 61, 164)"};
        }

        return ( 
            <React.Fragment>
                {
                    this.state.userNotFound ? <UserNotFound /> : (
                        <>
                        {
                            !this.isMobile ? (     
                            <div className={classes.flexContainer}>
                                <div className={classes.mainContainer} style={backgroundColor}>
                                    <div className={classes.imgContainer}>
                                        {userImg}
                                    </div>
                                    {editIcon}
                                    <div className={classes.textInfoContainer}>
                                        {
                                            this.state.editing ? (
                                                <div className={classes.editingTextarea}>
                                                    <div className={classes.editBioBtnsContainer}>
                                                        <Button btnType="Continue" clicked={this.sendEditedBio}>Continue</Button>
                                                        <Button btnType="Cancel" clicked={()=>this.setState({editing: false})}>Cancel</Button>
                                                    </div>
                                                    <textarea value={this.state.editBio} onChange={this.editBioHandle}/>
                                                </div>
                                            ) : 
                                            (
                                                <div>
                                                    <div className={classes.textNameH1}>
                                                        <OnlineIcon online={this.state.userId} />
                                                        <h1>{this.state.userData.name+" "+this.state.userData.surname}</h1>
                                                    </div>
                                                    <h2 className={classes.textNameH2}>@{this.state.userData.nickname}</h2>
                                                    <div className={classes.bio} style={backgroundColorDarker}>
                                                        <p>{this.state.editBio}</p>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div className={classes.rightPartInfoContainer}>
                                        <NumberInfoContainer token={this.state.token} userId={this.state.userId} />
                                        {
                                            this.state.userLogged ? (
                                                <div className={classes.editYourProfileContainer}>
                                                    <Link to="/editProfile">
                                                        <button className={classes.editYourProfile} style={editYourProfileBgColor}>Edit your profile</button>
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className={classes.socialButtonsContainer}>
                                                    {this.state.friendBtnDataRdy ? (
                                                        <FriendButton 
                                                            receivedRequest={this.state.receivedRequest}
                                                            isFriend={this.state.isFriend} 
                                                            pressAction={this.friendButtonAction}
                                                            friendId={this.state.userId}
                                                        />
                                                    ) : <Spinner />}
                                                    
                                                    { sendMessageButton }
            
                                                    {
                                                        this.state.isBlocked ? null : (
                                                            <button className={classes.unblockUser} onClick={()=>this.blockUser(this.state.userId)}>
                                                                <BiBlock size="1.5em" color="#FFF" style={{marginRight: "14px"}}/>
                                                                Block user
                                                            </button>
                                                        )
                                                    }
            
                                                    <Link to={`/reporting/user/?id=${this.state.userId}`} style={{textDecoration: "none", color: "unset"}}>
                                                        <button className={classes.reportUser}>
                                                            <MdReport size="1.5em" color="#FFF" style={{marginRight: "14px"}}/>
                                                            report this user
                                                        </button>
                                                    </Link>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>                    
                            </div>
                            ) : (
                                <MobileUserProfile
                                    loading={this.state.userPhoto === null}
                                    userId={this.state.userId}
                                    userphoto={this.state.userPhoto}
                                    userdata={this.state.userData}
                                    friendBtnDataRdy={this.state.friendBtnDataRdy}
                                    receivedRequest={this.state.receivedRequest}
                                    isFriend={this.state.isFriend}
                                    friendButtonAction={this.friendButtonAction}
                                    isBlocked={this.state.isBlocked}
                                    blockUser={this.blockUser}
                                    userLogged={this.state.userLogged}
                                    editYourProfileBgColor={editYourProfileBgColor}
                                />
                            )
                        }    
                        <div className={classes.flexContainer}>
                        {
                            this.isMobile ? (
                                <>
                                    <select 
                                        style={{margin: "5px"}} 
                                        className={searchbarClasses.Select} 
                                        value={this.state.currentSelectedMenu} 
                                        onChange={(e)=>this.setState({currentSelectedMenu: e.target.value})}
                                    >
                                        <option>Blogs</option>
                                        <option>Photos</option>
                                        <option>Friends</option>
                                        <option>Badges</option>
                                    </select>
                                </>
                            ) : (
                                <div className={classes.userProfileMenu} style={backgroundColor}>
                                    <div className={classes.userProfileMenuItem} onClick={() => this.handleMenuSelect('Blogs')} style={{...backgroundColor, cursor: "pointer"}}>
                                        <div className={this.state.blogsClass.join(" ")}></div>
                                        <p>Blogs</p>
                                    </div>
                                    <div className={classes.userProfileMenuItem} onClick={() => this.handleMenuSelect('Photos')} style={{...backgroundColor, cursor: "pointer"}}>
                                        <div className={this.state.photosClass.join(" ")}></div>
                                        <p>Photos</p>
                                    </div>
                                    <div className={classes.userProfileMenuItem} onClick={() => this.handleMenuSelect('Friends')} style={{...backgroundColor, cursor: "pointer"}}>
                                        <div className={this.state.friendsClass.join(" ")}></div>
                                        <p>Friends</p>
                                    </div>
                                    <div className={classes.userProfileMenuItem} onClick={() => this.handleMenuSelect('Badges')} style={{...backgroundColor, cursor: "pointer"}}>
                                        <div className={this.state.badgesClass.join(" ")}></div>
                                        <p>Badges</p>
                                    </div>
                                </div>
                            )
                        }
                        </div>
                        <div className={classes.center}>
                        <TabSelector selectedOption={this.state.currentSelectedMenu} userId={this.props.location.search}/>
                        </div>
                        {flash}
                        </>
                    )
                }
             </React.Fragment>
        );
    }
}
 
export default UserProfile;