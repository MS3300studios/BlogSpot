import React, { Component } from 'react';
import classes from './mobileUserProfile.module.css';
import importedClasses from '../userProfile.module.css';
import Button from '../../../components/UI/button';
import getToken from '../../../getToken';
import NumberInfoContainer from '../numberInfoContainer/numberInfoContainer';
import FriendButton from '../friendButton/friendButton';
import Spinner from '../../../components/UI/spinner';
import { Link } from 'react-router-dom';
import { MdMessage, MdReport } from 'react-icons/md';
import { BiBlock } from 'react-icons/bi';

/*
    this component is a child of the main userProfile.
    It's main goal is to display the information received by the parent.
    props list:
        userphoto
        userdata
        socialdata
        buttondata
        isLoggedIn

    props functions:
        sendEditedData?
*/

class MobileUserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hideBio: true,
            hideDetails: true
        }

        this.token = getToken();
    }

    render() { 
        return (
            <>
            <div className={classes.mobileUserProfileContainer}>
                <div className={classes.upperSection}>
                    { 
                        this.props.userphoto ? 
                        <img src={this.props.userphoto} alt="failed to load"/> :
                        <div className={importedClasses.userPhotoLoading} style={{width: "40vw", height: "30vh"}}></div>
                    }
                    <div className={classes.userNames}>
                        <h1>{this.props.userdata.name+" "+this.props.userdata.surname}</h1>
                        <h3>@{this.props.userdata.nickname}</h3>
                        <Button clicked={()=>this.setState({hideBio: !this.state.hideBio})}>
                            {this.state.hideBio ? "Show Bio" : "Hide Bio"}
                        </Button> 
                        <div className={classes.showMoreButton}>----</div>
                        <Button clicked={()=>this.setState({hideDetails: !this.state.hideDetails})}>
                            {this.state.hideDetails ? "Show Details" : "Hide Details"}
                        </Button> 
                    </div>
                </div>
                <div className={classes.buttonSection}>
                {this.props.userLogged ? (
                    <Link to="/editProfile">
                        <button className={importedClasses.editYourProfile} style={{...this.props.editYourProfileBgColor, marginTop: "10px"}}>Edit your profile</button>
                    </Link>
                ) : ( <>
                    {this.props.friendBtnDataRdy ? (
                        <FriendButton 
                            receivedRequest={this.props.receivedRequest}
                            isFriend={this.props.isFriend} 
                            pressAction={this.props.friendButtonAction}
                            friendId={this.props.userId}
                        />
                    ) : <Spinner small/>} 
                    
                    { 
                        (this.props.isFriend && this.props.isBlocked === false) ? (
                            <Link to={`/conversation/?friendId=${this.props.userId}`} className={importedClasses.sendMessageLink}>
                                <button className={importedClasses.sendMessage}><MdMessage size="1.5em" color="#FFF" />Send Message</button>
                            </Link>
                        ) : null 
                    } 

                    {
                        this.props.isBlocked ? null : (
                            <button className={importedClasses.unblockUser} onClick={()=>this.props.blockUser(this.props.userId)}>
                                <BiBlock size="1.5em" color="#FFF" style={{marginRight: "14px"}}/>
                                Block user
                            </button>
                        )
                    }

                    <Link to={`/reporting/user/?id=${this.props.userId}`} style={{textDecoration: "none", color: "unset"}}>
                        <button className={importedClasses.reportUser} style={{marginTop: "0px"}}>
                            <MdReport size="1.5em" color="#FFF" style={{marginRight: "14px"}}/>
                            report this user
                        </button>
                    </Link>
                </>)}
                </div>
                {
                    this.state.hideBio ? null : (
                        <div className={classes.bio}>
                            <p>{this.props.userdata.bio}</p>
                        </div>
                    )
                }
                {
                    this.state.hideDetails ? null : (
                        <div className={classes.lowerSection}>
                            <NumberInfoContainer token={this.token} userId={this.props.userId}/>
                        </div>
                    )
                }
            </div>
            <hr />
            </>
        );
    }
}
 
export default MobileUserProfile;