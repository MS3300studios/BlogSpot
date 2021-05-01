import React, { Component } from 'react';
import axios from 'axios';

import classes from './userProfile.module.css';
import photoFiller from '../../assets/userPhoto/image.jfif';
import TabSelector from './tabSelector/tabSelector';
import getToken from '../../getToken';
// import Like from '../../components/UI/like';
import { FaUserFriends } from 'react-icons/fa';
import { AiFillPlusCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { BiPhotoAlbum, BiPaperPlane } from 'react-icons/bi';


class UserProfile extends Component {
    constructor(props){
        super(props);
        
        let token = getToken();

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
            userLogged: userLogged,
            currentSelectedMenu: 'Blogs',
            blogsClass: [classes.border, classes.active],
            photosClass: [classes.border],
            friendsClass: [classes.border],
            badgesClass: [classes.border],
        }
        this.handleMenuSelect.bind();
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
                                <div className={classes.socialNumbersPanel}>
                                    <p><FaUserFriends size="1em" color="#0a42a4"/>  Friends: </p>
                                    <p>154</p>
                                </div>                                                                
                                <div className={classes.socialNumbersPanel}>
                                    <p><AiFillPlusCircle size="1em" color="#0a42a4" />  Followers: </p>
                                    <p>12</p>
                                </div>                                
                                <div className={classes.socialNumbersPanel}>
                                    <p><BiPaperPlane size="1em" color="#0a42a4" />  Blogs: </p>
                                    <p>420</p>
                                </div>                                
                                <div className={classes.socialNumbersPanel}>
                                    <p><BiPhotoAlbum size="1em" color="#0a42a4" />  Photos: </p>
                                    <p>55</p>
                                </div>                                
                            </div>
                            <div className={classes.socialButtonsContainer}>
                                <button className={classes.follow}>Follow</button>
                                <button className={classes.addFriend}>Add to friends</button>
                                <button className={classes.sendMessage}>Send Message</button>
                            </div>
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
                    <TabSelector selectedOption={this.state.currentSelectedMenu} />
                 </div>
             </React.Fragment>
        );
    }
}
 
export default UserProfile;


// <Like size="2em" color="blue"/>
// <Like dislike size="2em" color="blue"/>