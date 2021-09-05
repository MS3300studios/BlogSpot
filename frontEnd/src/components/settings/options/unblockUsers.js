/*import React, {useEffect, useState, useCallback} from 'react';
import axios from 'axios';

import Spinner from '../../../components/UI/spinner';
import FriendsListItem from '../../../containers/FriendsList/friendsListItem';
import classes from './unblockUsers.module.css';
import getToken from '../../../getToken';

const UnblockUsers = () => {
    const token = getToken();
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    let getBlockedUsers = useCallback(
        () => {
            axios({
                method: 'post',
                url: `http://localhost:3001/blocking/blockedUsers`,
                headers: {'Authorization': token},
                data: {
                    getFullData: true
                }
            })
            .then((res)=>{
                if(res.status===200){
                    let blockedUsers = null;
                    if(res.data.users.length === 0){ blockedUsers = (
                        <h1 style={{color: "white"}}>
                            You don't have any blocked users, to block a user go to their profile and press the block button there
                        </h1>
                    )}
                    else {
                        blockedUsers = res.data.users.map((user, index) => {
                            return (
                                <FriendsListItem 
                                    key={index}
                                    id={user._id} 
                                    name={user.name}
                                    nickname={user.nickname}
                                    surname={user.surname}
                                    photo={user.photo}
                                    unblock={unblock}
                                />
                            )
                        });                
                    }
                    setBlockedUsers(blockedUsers);
                    setLoading(false);
                    return;
                }
            })
            .catch(error => {
                console.log(error);
            })
        },
        [token, unblock]
    ) 

    let unblock = useCallback((userId) => {
        axios({
            method: 'post',
            url: `http://localhost:3001/blocking/removeBlock`,
            headers: {'Authorization': token},
            data: {blockedUserId: userId}
        })
        .then((res)=>{
            if(res.status===200){
                getBlockedUsers();
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    }, [getBlockedUsers, token])

    /*let getBlockedUsers = () => {
        axios({
            method: 'post',
            url: `http://localhost:3001/blocking/blockedUsers`,
            headers: {'Authorization': token},
            data: {
                getFullData: true
            }
        })
        .then((res)=>{
            if(res.status===200){
                let blockedUsers = null;
                if(res.data.users.length === 0){ blockedUsers = (
                    <h1 style={{color: "white"}}>
                        You don't have any blocked users, to block a user go to their profile and press the block button there
                    </h1>
                )}
                else {
                    blockedUsers = res.data.users.map((user, index) => {
                        return (
                            <FriendsListItem 
                                key={index}
                                id={user._id} 
                                name={user.name}
                                nickname={user.nickname}
                                surname={user.surname}
                                photo={user.photo}
                                unblock={unblock}
                            />
                        )
                    });                
                }
                setBlockedUsers(blockedUsers);
                setLoading(false);
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    }*/
/*
    useEffect(() => {
        getBlockedUsers();
    }, [getBlockedUsers])

    return (
        <div className={classes.center}>
            {
                loading ? <Spinner /> : <div className={classes.userContainer}>{blockedUsers}</div>
            }
        </div>
    );
}
 
export default UnblockUsers; */


import React, { Component } from 'react';

import axios from 'axios';

import Spinner from '../../../components/UI/spinner';
import FriendsListItem from '../../../containers/FriendsList/friendsListItem';
import classes from './unblockUsers.module.css';
import getToken from '../../../getToken';

class UnblockUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blockedUsers: null,
            loading: true
        }

        this.token = getToken();

        this.getBlockedUsers.bind(this);
        this.unblock.bind(this);
    }

    componentDidMount(){
        this.getBlockedUsers();
    }

    unblock = (userId) => {
        axios({
            method: 'post',
            url: `http://localhost:3001/blocking/removeBlock`,
            headers: {'Authorization': this.token},
            data: {blockedUserId: userId}
        })
        .then((res)=>{
            if(res.status===200){
                this.getBlockedUsers();
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    getBlockedUsers = () => {
        axios({
            method: 'post',
            url: `http://localhost:3001/blocking/blockedUsers`,
            headers: {'Authorization': this.token},
            data: {
                getFullData: true
            }
        })
        .then((res)=>{
            if(res.status===200){
                let blockedUsers = null;
                if(res.data.users.length === 0){
                    const msg = (
                        <h1 style={{color: "white",  margin: "20px"}}>
                            You don't have any blocked users. To block a user go to their profile and press the block button there.
                        </h1>
                    )
                    this.setState({blockedUsers: msg, loading: false});
                }
                else {
                    blockedUsers = res.data.users.map((user, index) => {
                        return (
                            <FriendsListItem 
                                key={index}
                                id={user._id} 
                                name={user.name}
                                nickname={user.nickname}
                                surname={user.surname}
                                photo={user.photo}
                                unblock={this.unblock}
                            />
                        )
                    });                
                }
                this.setState({blockedUsers: blockedUsers, loading: false});
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    render() { 
        return (
            <div className={classes.center}>
            {
                this.state.loading ? <Spinner /> : (
                    <>
                    <div className={classes.userContainer}>{this.state.blockedUsers ? <>{this.state.blockedUsers}</> : (
                        <h1 style={{color: "white", margin: "20px"}}>
                            You don't have any blocked users. To block a user go to their profile and press the block button there.
                        </h1>
                    )}</div>
                    </>
                )
            }
            </div>
        );
    }
}
 
export default UnblockUsers;