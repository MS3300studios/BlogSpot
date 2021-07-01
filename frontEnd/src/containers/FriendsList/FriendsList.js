import React, { Component } from 'react';

import classes from './FriendsList.module.css';
import SearchBar from '../../components/UI/searchBar';
import Button from '../../components/UI/button'; 
import FriendsListItem from './friendsListItem';
import getToken from '../../getToken';
import axios from 'axios';
import getUserData from '../../getUserData';

class FriendsList extends Component {
    constructor(props){
        super(props);

        let token = getToken();
        let userData = getUserData();

        this.state = {
            token: token,
            userData: userData,
            friends: [],
            filterIn: "none",
            filterBy: "none",
            fullFriends: [{}],
            searchedForUsers: false,
            newUsers: [],
            userNotFound: false
        }

        this.filterSearchHandler.bind(this);
        this.filterFriends.bind(this);
        this.searchNewUser.bind(this);
        this.setProps.bind(this);
    }

    componentDidMount(){
        axios({
            method: 'post',
            url: 'http://localhost:3001/getFriends',
            headers: {'Authorization': this.state.token},
        })
        .then((res)=>{
            if(res.status===200){
                this.setState({friends: res.data.friends});
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    setProps = (user, index) => {
        var newArray = this.state.fullFriends;
        newArray.splice(index, 0, user);
        this.setState({fullFriends: newArray});
    }

    searchNewUser = () => {
        //make call to API with field, and string.
        console.log(`filterin: ${this.state.filterIn}, filterBy: ${this.state.filterBy}`);
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
            console.log(res.data)
            if(res.data === "user not found"){
                this.setState({userNotFound: true, searchedForUsers: true});
            }
            else{
                this.setState({newUsers: res.data.users, searchedForUsers: true, userNotFound: false});
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    filterSearchHandler = (option, string) => {
        console.log(option)
        this.setState({filterIn: option, filterBy: string});
    }

    filterFriends = (filterIn, filterBy) => {
        let friendsJSX = null; //temporary array of all jsx friends, to be filtered and converted to friendsRdy
        let friendsRdy = null;
        
        //default filter: no filter applied
        if(filterIn==="none" || filterBy==="none"){
            friendsRdy = this.state.friends.map((friend, index)=>{
                return (
                    <FriendsListItem 
                        sendInfo={this.setProps}
                        id={friend.friendId} 
                        key={index} 
                    />
                )
            });
        }
        else{
            friendsJSX = this.state.friends.map((friend, index)=>{
                return (
                    <FriendsListItem 
                        sendInfo={this.setProps}
                        id={friend.friendId} 
                        key={index} 
                        name={this.state.fullFriends[index].name} 
                        surname={this.state.fullFriends[index].surname} 
                        nickname={this.state.fullFriends[index].nickname} 
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
        let friends;
        if(this.state.friends.length===0){
            friends = (
                <div className={classes.nameListContainer}>
                    <h1>You don't have any friends yet!</h1>
                    <hr />
                    <p>To add new friends, type their data in the search bar above and click search</p>
                    <Button clicked={this.searchNewUser}>Search</Button>
                </div>
            );
        }
        else{
            friends = (
                <div className={classes.nameListContainer}>
                    {
                        this.filterFriends(this.state.filterIn, this.state.filterBy)
                    }
                </div>
            );
        }

        //if the user was searching for other users, then we want to show the results from the newUsers array
        if(this.state.searchedForUsers){ 
            friends = (
                <div className={classes.nameListContainer}>
                    {
                        this.state.newUsers.map((user, index)=>(
                                <a href={"/user/profile/?id="+user._id} key={index} className={classes.containerLink}>
                                    <div className={classes.listElement}>
                                        <div className={classes.smallFaceContainer}>
                                            <img src={user.photo} alt="users's face"/>
                                        </div>
                                        <div className={classes.namesContainer}>
                                            <h1>{user.name} {user.surname}</h1>
                                            <p>@{user.nickname}</p>
                                        </div>
                                    </div>
                                    <hr/>
                                </a>
                            ))
                    }
                </div>
            )
        }
       
        if(this.state.userNotFound){
            friends = (
                <div className={classes.nameListContainer}>
                    <h1>404: No user with this {this.state.filterIn} was found</h1>
                    <hr />
                    <p>Type the data in the search bar above and click search</p>
                    <Button clicked={this.searchNewUser}>Search again</Button>
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
                        resetFilter={()=>{this.setState({filterIn: "none", filterBy: "none"})}}
                    />
                </div>
                {friends}
                <h1>in: {this.state.filterIn}</h1>
                <h1>by: {this.state.filterBy}</h1>
            </div>
        );
    }
}
 
export default FriendsList;


// <button
//                         onClick={()=>{
//                             console.log(this.state.fullFriends)
//                         }}
//                         style={{backgroundColor: "black"}}
//                     >
//                     check full friends arr
//                 </button>