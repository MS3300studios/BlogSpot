import React, { Component } from 'react';
import axios from 'axios';
import classes from '../userProfile.module.css';
import getToken from '../../../getToken';
import { MAIN_URI } from '../../../config';

import { BsFillPersonCheckFill } from 'react-icons/bs';
import { BsFillPersonDashFill } from 'react-icons/bs';

class FriendButton extends Component {
    constructor(props) {
        super(props);

        let token = getToken();
        let btnTxt = "Send friend request";
        let reqStat = false;
        if(this.props.isFriend){
            btnTxt = "Remove friend";
            reqStat = false;
        }

        this.state = {
            token: token,
            requestStatus: reqStat,
            receivedRequest: this.props.receivedRequest,
            buttonText: btnTxt,
            isFriend: this.props.isFriend
        }
        this.sendAction.bind(this);
    }

    componentDidMount(){
        if(this.props.isFriend === false){
            axios({
                method: 'post',
                url: `${MAIN_URI}/checkFriendRequest`,
                headers: {'Authorization': this.state.token},
                data: {friendId: this.props.friendId}
            })
            .then((res)=>{
                if(res.data.iSendRequest){
                    this.setState({requestStatus: true, buttonText: "Remove friend request"});
                }
                else if(res.data.iReceivedRequest){
                    this.setState({receivedRequest: true, buttonText: "Accept friend request"});
                }
                else{
                    this.setState({requestStatus: false, buttonText: "Send friend request"});
                }
            })
            .catch(error => {
                console.log(error);
            })
        }
    }

    sendAction = (acceptRequest) => {
        if(this.state.isFriend){
            //if user deleted the friend 
            this.setState({buttonText: "Send friend request", requestStatus: false, isFriend: false});
            this.props.pressAction("removeFriend");
        }
        else if(this.state.requestStatus === false){
            if(acceptRequest !== "none"){
                //if request was made for the user
                if(acceptRequest==="accept"){
                    //user accepts the request
                    this.setState({receivedRequest: false, isFriend: true, buttonText: "Remove from Friends"});
                    this.props.pressAction("acceptFriendRequest")
                }
                else if(acceptRequest==="decline"){
                    //user declines the request
                    this.setState({receivedRequest: false, buttonText: "Send friend request"});
                    this.props.pressAction("declineFriendRequest")
                }
            }
            else if(acceptRequest === "none"){
                //if request was made by the user
                this.setState({buttonText: "Remove friend request", requestStatus: true});
                this.props.pressAction("addRequest");
            }
        }
        else if(this.state.requestStatus){
            //if person's profile is not friend
            this.setState({buttonText: "Send friend request", requestStatus: false});
            this.props.pressAction("removeRequest");
        }
    }

    render() { 
        let btn;
        if(this.state.buttonText === 'Remove friend' || this.state.buttonText === 'Remove friend request') btn = <button className={classes.addFriend} onClick={() => this.sendAction("none")}><BsFillPersonDashFill size="2em"/>{this.state.buttonText}</button>
        else if(this.state.buttonText === 'Send friend request') btn = <button className={classes.addFriend} onClick={() => this.sendAction("none")}><BsFillPersonCheckFill size="2em"/>{this.state.buttonText}</button>

        if(this.state.receivedRequest){
            btn = (
                <React.Fragment>
                    <button className={[classes.addFriend, classes.acceptRequest].join(" ")} onClick={() => this.sendAction('accept')}>
                        <BsFillPersonCheckFill size="2em"/>
                        Accept friend request
                    </button>
                    <button className={[classes.addFriend, classes.declineRequest].join(" ")} onClick={() => this.sendAction('decline')}>
                        <BsFillPersonDashFill size="2em"/>
                        Decline friend request
                    </button>
                </React.Fragment>
            )
        }

        return (
            <React.Fragment>
                {btn}
            </React.Fragment>
        );
    }
}

export default FriendButton;
