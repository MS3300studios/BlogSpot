import React, { Component } from 'react';
import axios from 'axios';
import classes from '../userProfile.module.css';
import getToken from '../../../getToken';

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
                url: `http://localhost:3001/checkFriendRequest`,
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
            this.setState({buttonText: "Send friend request", requestStatus: false, isFriend: false});
            // this.props.pressAction("removeFriend");
        }
        else if(this.state.requestStatus === false){
            if(acceptRequest !== "none"){
                if(acceptRequest==="accept"){
                    this.setState({receivedRequest: false, isFriend: true, buttonText: "Remove from Friends"});
                }
                else if(acceptRequest==="decline"){
                    this.setState({receivedRequest: false, buttonText: "Send friend request"});
                }
            }
            else if(acceptRequest === "none"){
                this.setState({buttonText: "Remove friend request", requestStatus: true});
                // this.props.pressAction("addRequest");
            }
        }
        else if(this.state.requestStatus){
            this.setState({buttonText: "Send friend request", requestStatus: false});
            // this.props.pressAction("removeRequest");
        }
    }

    render() { 
        let btn = <button className={classes.addFriend} onClick={() => this.sendAction("none")}>{this.state.buttonText}</button>
        if(this.state.receivedRequest){
            btn = (
                <React.Fragment>
                    <button className={[classes.addFriend, classes.acceptRequest].join(" ")} onClick={() => this.sendAction('accept')}>Accept friend request</button>
                    <button className={[classes.addFriend, classes.declineRequest].join(" ")} onClick={() => this.sendAction('decline')}>Decline friend request</button>
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