import React, { Component } from 'react';

import classes from './addingConversation.module.css';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import FriendsListItem from '../../FriendsList/friendsListItem';

import axios from 'axios';
import getUserData from '../../../getUserData';
import getToken from '../../../getToken';
import Spinner from '../../../components/UI/spinner';
import SearchBar from '../../../components/UI/searchBar';
import Button from '../../../components/UI/button';

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
            selectedFriends: [],
            selectAll: false,
            nameComplete: false,
            loading: true,
            friends: [],
            flashMessage: "",
            flashNotClosed: true,
            filterBy: "",
            filterIn: ""
        }

        this.flash.bind(this);
        this.filterSearchHandler.bind(this);
        this.filterFriends.bind(this);
        this.addFriendSelect.bind(this);
        this.sendConversation.bind(this);
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

    sendConversation = () => {
        axios({
            method: 'post',
            url: `http://localhost:3001/conversation/add`,
            headers: {'Authorization': this.state.token},
            data: {
                participants: this.state.selectedFriends,
                name: this.state.conversationName
            }
        })
        .then((res)=>{
            if(res.status===200){
                
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    filterSearchHandler = (option, string) => {
        if(string===""){
            this.setState({filterIn: option});
        }
        else{
            this.setState({filterIn: option, filterBy: string});
        }
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

    addFriendSelect = (friend, adding) => {
        // console.log(friend.name, friend.id)
        let temp = this.state.selectedFriends;
        if(adding === true) temp.push(friend);
        else if(adding === false){
            let temp2 = temp.filter(user => user._id !== friend._id)
            temp = temp2;
        }
        this.setState({selectedFriends: temp});
    }

    filterFriends = (filterIn, filterBy) => {
        let friendsJSX = []; //temporary array of all jsx friends, to be filtered and converted to friendsRdy
        let friendsRdy = [];
    
        friendsJSX = this.state.friends.map((friend, index)=>{
            return (
                <FriendsListItem 
                    friendNumber={index}
                    id={friend._id} 
                    name={friend.name}
                    nickname={friend.nickname}
                    surname={friend.surname}
                    photo={friend.photo}
                    friendSelect
                    selectAll={this.state.selectAll}
                    friendWasSelected={this.addFriendSelect}
                />
            )
        });

        if(filterBy==="" || filterIn===""){
            friendsRdy = friendsJSX;
        }
        else{
            switch(filterIn){
                case "nickname":
                    friendsRdy = friendsJSX.filter((friend)=>{
                        if(friend.props.nickname.includes(filterBy)){
                            return true;
                        }
                        else return false;
                    });
                    break;
                case "name":
                    friendsRdy = friendsJSX.filter((friend)=>{
                        if(friend.props.name.includes(filterBy)){
                            return true;
                        }
                        else return false;
                    }); 
                    break;
                case "surname": 
                    friendsRdy = friendsJSX.filter((friend)=>{
                        if(friend.props.surname.includes(filterBy)){
                            return true;
                        }
                        else return false;
                    })
                    break;
                default: friendsRdy = friendsJSX;
                    break;
            } 
        }

        if(friendsRdy.length === 0){
            friendsRdy = (
                <React.Fragment>
                    <h1>Ooops, you don't have a friend with that {this.state.filterIn}!</h1>
                    <hr />
                    <p>Click here to add new friends: <Button clicked={()=>this.setState({showAddFriendCoponent: true})}>Search users</Button></p>
                </React.Fragment>
            );
        }

        let wrappedFriends = friendsRdy.map((friend, index) => {
            return (
                <div className={classes.friendsListItemOutline} key={index}>
                    {friend}
                </div>
            )
        })

        return wrappedFriends;
    } 

    render() { 
        let flash = null;
        if(this.state.flashMessage && this.state.flashNotClosed){
            flash = <Flash>{this.state.flashMessage}</Flash>
        }
        else if(this.state.flashMessage && this.state.flashNotClosed === false){
            flash = <Flash close>{this.state.flashMessage}</Flash>
        }

        let friends;
        if(this.state.friends.length===0){
            friends = (
                <div className={classes.nameListContainer}>
                    <h1>You don't have any friends yet!</h1>
                </div>
            );
        }
        else{
            friends = (
                <div className={classes.nameListContainer}>
                    {this.filterFriends(this.state.filterIn, this.state.filterBy)}
                </div>
            );
        }

        return (
            <div className={classes.backDrop}>
                {
                    this.state.loading ? <Spinner /> : (
                        <div className={classes.addUserContainer}>
                            <div className={classes.closeIcon} onClick={this.props.closeAddConversation}>
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
                                    <button  
                                        className={classes.nextBtn}
                                        onClick={this.sendConversation}
                                    >
                                        NEXT
                                    </button>
                                </div>
                                <hr />
                                <div className={classes.addingUsers}>
                                    <h1>Add users to the conversation: </h1>
                                    <SearchBar 
                                        placeholder="search friends in..."
                                        clicked={this.filterSearchHandler}
                                        resetFilter={()=>{this.setState({filterIn: "", filterBy: ""})}}
                                        selectValues={["nickname", "name", "surname", "id"]}
                                        selectedOption={this.filterSearchHandler}
                                    />
                                    <div className={classes.selectAllContainer}>
                                        <div className={classes.selectAllContainerInner}>
                                            <p>select all</p>
                                            <input 
                                                type="checkbox" 
                                                onClick={()=>this.setState(prevState => {
                                                    let temp = prevState.friends.map(friend => ({name: friend.name, _id: friend._id}));
                                                    if(prevState.selectAll === true) temp = [];
                                                    return(
                                                        {selectAll: !prevState.selectAll, selectedFriends: temp}
                                                    )
                                                })}
                                            />
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
                    )
                }
                {flash}
                <button style={{backgroundColor: "black"}} onClick={()=>console.log(this.state.selectedFriends)}>log selected friends</button>
            </div>
        );
    }
}
 
export default AddingConversation;
