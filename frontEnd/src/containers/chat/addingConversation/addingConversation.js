import React, { Component } from 'react';

import classes from './addingConversation.module.css';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import FriendsListItem from '../../FriendsList/friendsListItem';

import axios from 'axios';
import getUserData from '../../../getUserData';
import getToken from '../../../getToken';
import Spinner from '../../../components/UI/spinner';
import SearchBar from '../../../components/UI/searchBar';

import Flash from '../../../components/UI/flash';

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
            friends: [],
            flashMessage: "",
            flashNotClosed: true,
        }

        this.flash.bind(this);
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

    render() { 
        let flash = null;
        if(this.state.flashMessage && this.state.flashNotClosed){
            flash = <Flash>{this.state.flashMessage}</Flash>
        }
        else if(this.state.flashMessage && this.state.flashNotClosed === false){
            flash = <Flash close>{this.state.flashMessage}</Flash>
        }

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
                                    onChange={(e)=>this.setState({conversationName: e.target.value})}
                                />
                            </div>
                        </div>
                        <hr />
                        <div className={classes.addingUsers}>
                            <h1>Add users to the conversation: </h1>
                            <SearchBar 
                                placeholder="search posts in..."
                                clicked={this.filterSearchHandler}
                                resetFilter={()=>{this.setState({filterIn: "none", filterBy: "none"})}}
                                selectValues={["title", "content"]}
                            />
                            <div className={classes.selectAllContainer}>
                                <div className={classes.selectAllContainerInner}>
                                    <p>select all</p>
                                    <input type="checkbox"/>
                                </div>
                            </div>
                            <div className={classes.center}>
                                <div className={classes.friendsList}>
                                    { friends }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {flash}
            </div>
        );
    }
}
 
export default AddingConversation;

/*
    

*/