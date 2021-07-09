import React, { Component } from 'react';

import classes from './FriendsList.module.css';
import SearchBar from '../../components/UI/searchBar';
import Button from '../../components/UI/button'; 
import FriendsListItem from './friendsListItem';
import getToken from '../../getToken';
import axios from 'axios';

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
            users: [],
            searchedForUser: false,
            filterIn: "none",
            filterBy: "none",
            userNotFound: false,
            usedFilter: false
        }

        this.searchNewUser.bind(this);
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

    searchNewUser = () => {
        //make call to API with field, and string.
        axios({
            method: 'post',
            url: `http://localhost:3001/users/find`,
            headers: {'Authorization': this.state.token},
            data: {
                field: this.state.filterIn,
                payload: this.state.filterBy
            }
        })
        .then((res)=>{
            if(res.data === "user not found"){
                this.setState({userNotFound: true, searchedForUser: true});
            }
            else{
                this.setState({users: res.data.users, searchedForUser: true, userNotFound: false});
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    filterSearchHandler = (option, string) => {
        this.setState({filterIn: option, filterBy: string, usedFilter: true});
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
                    <p>Do you wish to search for a user with this {this.state.filterIn}?</p>
                    <Button clicked={this.searchNewUser}>Search</Button>
                </React.Fragment>
            );
        }
        return friendsRdy;
    }

    render() { 
        let bottomSearchNotice = (
            <div className={classes.nameListContainer} style={{marginTop: "10px"}}>
                <p>To add new friends, type their data in the search bar above and click search</p>
                <Button clicked={this.searchNewUser}>Search</Button>
            </div>
        );

        let friends;
        if(this.state.friendsIds.length===0){
            bottomSearchNotice = null;
            friends = (
                <div className={classes.nameListContainer}>
                    <h1>You don't have any friends yet!</h1>
                    <hr />
                    <p>To add new friends, type their data in the search bar above and click search</p>
                    <Button clicked={this.searchNewUser}>Search</Button>
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
        
        if(this.state.searchedForUser){
            bottomSearchNotice = null;
            friends = (
                <div className={classes.nameListContainer}>
                    {
                        this.state.users.map((user, index) => (
                            <FriendsListItem 
                                id={user._id} 
                                key={index}  
                                friend={user}
                            />
                        ))
                    }
                </div>
            );         
        }

        return (
            <div className={classes.mainContainer}>
                <div className={classes.upperContainer}>
                    <h1 className={classes.mainHeader}>Your friends:</h1>
                    <SearchBar 
                        placeholder="search friends by..."
                        selectedOption={this.filterSearchHandler}
                        clicked={this.filterSearchHandler}
                        selectValues={["nickname", "name", "surname", "id"]} 
                        resetFilter={()=>{this.setState({filterIn: "none", filterBy: "none", searchedForUser: false, usedFilter: false})}}
                    />
                </div>
                {friends}
                {bottomSearchNotice}
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