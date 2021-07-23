import React, { Component } from 'react';

import classes from './addingConversation.module.css';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import FriendsListItem from '../../FriendsList/friendsListItem';

import axios from 'axios';
import getUserData from '../../../getUserData';
import getToken from '../../../getToken';
import Spinner from '../../../components/UI/spinner';

class AddingConversation extends Component {
    constructor(props) {
        super(props);

        let userData = getUserData();
        let token = getToken();

        this.state = {
            token: token,
            userData: userData,
            conversationName: "",
            nameComplete: false,
            loading: true,
            friends: []
        }
    }

    componentDidMount(){
        let id = this.state.userData._id;
        axios({
            method: 'get',
            url: `http://localhost:3001/friends/all/${id}`,
            headers: {'Authorization': this.state.token},
        })
        .then((res)=>{
            if(res.status===200){
                this.setState({friends: res.data.friends, loading: false});
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    render() { 
        let friends = <Spinner />
        if(this.state.loading === false){
            friends = this.state.friends.map((friend, index) => (
                <div className={classes.friendsListItemOutline}>
                    <FriendsListItem
                        friendNumber={index}
                        key={index} 
                        id={friend._id} 
                        name={friend.name}
                        nickname={friend.nickname}
                        surname={friend.surname}
                        photo={friend.photo}
                        friendSelect
                    />
                </div>
            ))
        }

        return (
            <div className={classes.backDrop}>
                <div className={classes.addUserContainer}>
                    <div className={classes.closeIcon} onClick={this.props.closeAddUser} onClick={this.props.closeAddConversation}>
                        <AiOutlineCloseCircle size="2em" color="#0a42a4" />
                    </div>
                    <div>
                        <div className={classes.centerInput}>
                            <h1>Give the conversation a name:</h1>
                            <div>
                                <input 
                                    className={classes.Input}
                                    type="text" 
                                    onChange={(e)=>this.setState({conversationName: e.target.value})}/>
                            </div>
                        </div>
                        <hr />
                        <div className={classes.addingUsers}>
                            <h1>Add users to the conversation: </h1>
                            <div className={classes.center}>
                                <div className={classes.friendsList}>
                                    { friends }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
 
export default AddingConversation;

/*
    

*/