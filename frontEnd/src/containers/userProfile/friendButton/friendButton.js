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
            buttonText: btnTxt,
            isFriend: this.props.isFriend
        }
        this.sendAction.bind(this);
    }

    componentDidMount(){
        console.log(this.props.isFriend)
        if(this.props.isFriend === false){
            console.log('checking for Friend Request')
            axios({
                method: 'post',
                url: `http://localhost:3001/checkFriendRequest`,
                headers: {'Authorization': this.state.token},
                data: {friendId: this.props.friendId}
            })
            .then((res)=>{
                if(res.data.requestExists){
                    this.setState({requestStatus: true, buttonText: "Remove friend request"});
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

    sendAction = () => {
        if(this.state.isFriend){
            this.setState({buttonText: "Send friend request", requestStatus: false, isFriend: false});
            this.props.pressAction("removeFriend");
        }
        else if(this.state.requestStatus === false){
            this.setState({buttonText: "Remove friend request", requestStatus: true});
            this.props.pressAction("addRequest");
        }
        else if(this.state.requestStatus){
            this.setState({buttonText: "Send friend request", requestStatus: false});
            this.props.pressAction("removeRequest");
        }
    }

    render() { 
        return (
            <button className={classes.addFriend} onClick={this.sendAction}>{this.state.buttonText}</button>
        );
    }
}
 
export default FriendButton;