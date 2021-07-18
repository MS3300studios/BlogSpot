import React, { Component } from 'react';

import classes from './FriendsList.module.css';
import SearchBar from '../../components/UI/searchBar';
import Button from '../../components/UI/button'; 
import {IoMdPersonAdd} from 'react-icons/io';
import FriendsListItem from './friendsListItem';
import getToken from '../../getToken';
import axios from 'axios';
import AddUser from './addUser/addUser';

import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';

class FriendsList extends Component {
    constructor(props) {
        super(props);

        let token = getToken();

        this.state = {
            token: token,
            friendsIds: [],
            fullFriends: this.props.fullFriends,
            filterIn: "none",
            filterBy: "none",
            usedFilter: false,
            showAddFriendCoponent: false
        }

        this.filterSearchHandler.bind(this);
        this.filterFriends.bind(this);
    }

    componentDidMount(){
        this.props.redux_clear_fullfriends();
        axios({
            method: 'post',
            url: 'http://localhost:3001/getFriends',
            headers: {'Authorization': this.state.token},
        })
        .then((res)=>{
            if(res.status===200){
                this.setState({friendsIds: res.data.friends});
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
            this.setState({filterIn: option, filterBy: string, usedFilter: true});
        }
    }

    filterFriends = (filterIn, filterBy) => {
        let friendsJSX = null; //temporary array of all jsx friends, to be filtered and converted to friendsRdy
        let friendsRdy = null;
        
        //default filter: no filter applied
        if(filterIn==="none" || filterBy==="none"){
            return (
                <div className={classes.nameListContainer}>
                    {
                        this.state.friends.map((friend, index)=>{
                            return (
                                <FriendsListItem 
                                    id={friend.friendId} 
                                    key={index}  
                                    getData
                                />
                            )
                        })
                    }
                </div>
            )
        }
        else{
            friendsJSX = this.state.fullFriends.map((friend, index)=>{
                return (
                    <FriendsListItem 
                        id={friend._id} 
                        key={index} 
                        name={friend.name}
                        nickname={friend.nickname}
                        surname={friend.surname}
                        friend={friend}
                    />
                )
            });
            if(filterIn==="nickname"){
                //eslint-disable-next-line
                friendsRdy = friendsJSX.filter((friend)=>{
                    if(friend.props.nickname.includes(filterBy)){
                        return friend;
                    }
                })            
            }
    
            else if(filterIn==="name"){
                // eslint-disable-next-line
                friendsRdy = friendsJSX.filter((friend)=>{
                    if(friend.props.name.includes(filterBy)){
                        return friend;
                    }
                })
            }

            else if(filterIn==="surname"){
                // eslint-disable-next-line
                friendsRdy = friendsJSX.filter((friend)=>{
                    if(friend.props.surname.includes(filterBy)){
                        return friend;
                    }
                })
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
        return friendsRdy;
    }

    render() {
        let friends;
        if(this.state.friendsIds.length===0){
            //bottomSearchNotice = null;
            friends = (
                <div className={classes.nameListContainer}>
                    <h1>You don't have any friends yet!</h1>
                    <hr />
                    <p>To add new friends click add friend button</p>
                </div>
            );
        }
        
        else if(this.state.usedFilter){
            friends = (
                <div className={classes.nameListContainer}>
                    {this.filterFriends(this.state.filterIn, this.state.filterBy)}
                </div>
            );
        }
        else{
            friends = (
                <div className={classes.nameListContainer}>
                    {
                        this.state.friendsIds.map((friend, index)=>{
                            return (
                                <FriendsListItem 
                                    id={friend.friendId} 
                                    key={index}  
                                    getData
                                />
                            )
                        })
                    }
                </div>
            );
        }

        return (
            <div className={classes.mainContainer}>
                <h1 className={classes.mainHeader}>your friends</h1>
                <div className={classes.upperContainer}>
                    <SearchBar 
                        placeholder="search friends by..."
                        selectedOption={this.filterSearchHandler}
                        clicked={this.filterSearchHandler}
                        selectValues={["nickname", "name", "surname", "id"]} 
                        resetFilter={()=>{this.setState({filterIn: "none", filterBy: "none", usedFilter: false})}}
                    />
                    <div className={classes.addUserIcon} onClick={()=>this.setState({showAddFriendCoponent: true})}>
                        <IoMdPersonAdd size="2em" color="#0a42a4" />
                    </div>
                </div>
                {friends}
                {
                    this.state.showAddFriendCoponent ?
                        <AddUser  
                            closeAddUser={()=>this.setState({showAddFriendCoponent: false})} 
                            friendIds={this.state.friendsIds}    
                        /> 
                        : null
                }
            </div>
        );
    }
}
 
const mapStateToProps = state => {
    return {
        fullFriends: state.fullFriends
    };
}

const mapDispatchToProps = dispatch => {
    return {
        redux_check_store: () => dispatch({type: actionTypes.CHECK_STORE}),
        redux_clear_fullfriends: () => dispatch({type: actionTypes.CLEAR_FULLFRIENDS})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendsList);