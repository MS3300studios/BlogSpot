import React, { Component } from 'react';

import classes from './FriendsList.module.css';
import SearchBar from '../../components/UI/searchBar';
import Button from '../../components/UI/button'; 
import FriendsListItem from './friendsListItem';
import getToken from '../../getToken';

import photo1 from '../../assets/userPhoto/image (1).jfif';
import photo2 from '../../assets/userPhoto/image (2).jfif';
import photo3 from '../../assets/userPhoto/image (3).jfif';
import photo4 from '../../assets/userPhoto/image (4).jfif';
import photo5 from '../../assets/userPhoto/image (14).jfif';
import photo6 from '../../assets/userPhoto/image2.jfif';
import photo7 from '../../assets/userPhoto/image.jfif';
import axios from 'axios';
import { BackgroundColor } from 'chalk';

class FriendsList extends Component {
    constructor(props){
        super(props);

        let token = getToken();

        this.state = {
            token: token,
            friends: [],
            filterIn: "none",
            filterBy: "none",
            wasSearched: false,
            fullFriends: [{}]
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
        newArray.splice(index,0, user);
        this.setState({fullFriends: newArray});
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
            console.log(res)
            if(res.status===200){
                this.setState({friends: res.data.users})
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    filterSearchHandler = (option, string) => {
        if(!this.state.wasSearched){
            this.setState({wasSearched: false});
        }
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
                        name={this.state.fullFriends[index].name} 
                        surname={this.state.fullFriends[index].surname} 
                        nickname={this.state.fullFriends[index].nickname} 
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

        let noFriendsYet = (
            <div className={classes.nameListContainer}>
                <h1>You don't have any friends yet!</h1>
                <hr />
                <p>To add new friends, type their data in the search bar above and click search</p>
                <Button clicked={this.searchNewUser}>Search</Button>
            </div>
        );

        
        let friends = (
            <div className={classes.nameListContainer}>
                {
                    this.filterFriends(this.state.filterIn, this.state.filterBy)
                }
            </div>
        );
        
        if(this.state.friends.length>0){
            noFriendsYet = friends;
        }

        return (
            <div className={classes.mainContainer}>
                <div className={classes.upperContainer}>
                    <h1 className={classes.mainHeader}>Your friends:</h1>
                    <SearchBar 
                        placeholder="search friends by..."
                        clicked={this.filterSearchHandler}
                        selectValues={["nickname", "name", "surname", "id"]}
                        resetFilter={()=>{this.setState({filterIn: "none", filterBy: "none"})}}
                    />
                </div>
                {this.state.wasSearched ? friends : noFriendsYet}
                <button
                        onClick={()=>{
                            console.log(this.state.fullFriends)
                        }}
                        style={{BackgroundColor: "black"}}
                    >
                    check full friends arr
                </button>
            </div>
        );
    }
}
 
export default FriendsList;


// resetFilter={()=>{this.setState({filterIn: "none", filterBy: "none"})}}