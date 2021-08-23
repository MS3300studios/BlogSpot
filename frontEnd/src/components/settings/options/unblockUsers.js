import React, {useEffect, useState} from 'react';
import axios from 'axios';

import Spinner from '../../../components/UI/spinner';
import FriendsListItem from '../../../containers/FriendsList/friendsListItem';
import classes from './unblockUsers.module.css';
import getToken from '../../../getToken';

const UnblockUsers = () => {
    const token = getToken();
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    let unblock = (userId) => {
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
    }

    let getBlockedUsers = () => {
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
                if(res.data.friends.length === 0){ blockedUsers = (
                    <h1 style={{color: "white"}}>
                        You don't have any blocked users, to block a user go to their profile and press the block button there
                    </h1>
                )}
                else {
                    blockedUsers = res.data.friends.map((user, index) => {
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
    }

    useEffect(() => {
        getBlockedUsers();
    }, [])

    return (
        <div className={classes.center}>
            {
                loading ? <Spinner /> : <div className={classes.userContainer}>{blockedUsers}</div>
            }
        </div>
    );
}
 
export default UnblockUsers;