import React, { Component } from 'react';
import { MAIN_URI } from '../../config';

import SearchBar from '../../components/UI/searchBar';
import Button from '../../components/UI/button'; 
import {IoMdPersonAdd} from 'react-icons/io';
import FriendsListItem from './friendsListItem';
import axios from 'axios';
import AddUser from './addUser/addUser';
import Spinner from '../../components/UI/spinner';

import getToken from '../../getToken';
import getUserData from '../../getUserData';
import getColor from '../../getColor';
import getMobile from '../../getMobile';

import classes from './FriendsList.module.css';
import mobileClasses from './mobileStyles.module.css';
import greenClasses from './greenClasses.module.css';
import blueClasses from './blueClasses.module.css';

const colorScheme = getColor();
let colorClasses = greenClasses;
if(colorScheme === "blue"){
    colorClasses = blueClasses;
}

class FriendsList extends Component {
    constructor(props) {
        super(props);

        const token = getToken();
        const userData = getUserData();    

        this.state = {
            token: token,
            userData: userData,
            friends: [],
            usersOnline: [],
            filterIn: "",
            filterBy: "",
            showAddFriendCoponent: false,
            loading: true,
        }

        this.filterSearchHandler.bind(this);
        this.filterFriends.bind(this);
        this.resetFilter.bind(this);
        this.initialFetch.bind(this);

        this.isMobile = getMobile();
    }

    componentDidMount(){
        this.initialFetch();
    }

    initialFetch = (loadingAgain) => {
        if(loadingAgain === true){
            this.setState({loading: true, showSpinnerMessage: false}, () => {
                let id = this.state.userData._id;
                if(this.props.profileViewComponent){
                    let temp = this.props.profileViewComponent;
                    id = temp.substr(4, temp.length);
                }
                axios({
                    method: 'get',
                    url: `${MAIN_URI}/friends/all/${id}`,
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
            })
        }
        else{
            let id = this.state.userData._id;
            if(this.props.profileViewComponent){
                let temp = this.props.profileViewComponent;
                id = temp.substr(4, temp.length);
            }
            axios({
                method: 'get',
                url: `${MAIN_URI}/friends/all/${id}`,
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
        
    }

    resetFilter = () => {
        this.setState({filterIn: "", filterBy: ""})
    }

    filterSearchHandler = (option, string) => {
        if(string===""){
            this.setState({filterIn: option});
        }
        else{
            this.setState({filterIn: option, filterBy: string});
        }
    }


    filterFriends = (filterIn, filterBy) => {
        let friendsJSX = []; //temporary array of all jsx friends, to be filtered and converted to friendsRdy
        let friendsRdy = [];
        
        friendsJSX = this.state.friends.map((friend, index)=>{
            if(friend === null) return null
            return (
                <FriendsListItem 
                    friendNumber={index}
                    key={index} 
                    id={friend._id} 
                    name={friend.name}
                    nickname={friend.nickname}
                    surname={friend.surname}
                    photo={friend.photo}
                    onlineIcon
                    isOnline={friend.isOnline}
                />
            )
        });

        if(filterBy===""){
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

        return friendsRdy;
    } 

    render() {
        let friends;
        if(this.state.friends.length===0){
            friends = (
                <div className={colorClasses.nameListContainer}>
                    <h1>You don't have any friends yet!</h1>
                    <hr />
                    <p>To add new friends click add friend button</p>
                </div>
            );
        }
        else{
            friends = (
                <div className={colorClasses.nameListContainer} style={this.isMobile ? {width: "90%", marginTop: "10px"} : null}>
                    {this.filterFriends(this.state.filterIn, this.state.filterBy)}
                </div>
            );
        }

        return (
            <div className={classes.mainContainer}>
                {
                    this.state.loading ? <Spinner /> : (
                        <>
                            <h1 className={mobileClasses.mainHeader}>{this.props.profileViewComponent ? null : "your friends"}</h1>
                            <div className={classes.upperContainer}>
                                <SearchBar 
                                    placeholder="search friends by..."
                                    selectedOption={this.filterSearchHandler}
                                    clicked={this.filterSearchHandler}
                                    selectValues={["nickname", "name", "surname", "id"]} 
                                    resetFilter={this.resetFilter}
                                />
                                {
                                    this.props.profileViewComponent ? null : (
                                        <div className={colorClasses.addUserIcon} onClick={()=>this.setState({showAddFriendCoponent: true})}>
                                            <IoMdPersonAdd size="2em" color="#0a42a4" />
                                        </div>
                                    )
                                }
                            </div>
                            {friends}
                            {
                                this.state.showAddFriendCoponent ?
                                    <AddUser
                                        closeAddUser={()=>this.setState({showAddFriendCoponent: false})} 
                                        friends={this.state.friends}    
                                    /> 
                                    : null
                            }
                        </>
                    )
                }
            </div>
        );
    }
}

export default FriendsList;