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

    useEffect(() => {
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
                let blockedUsers = res.data.users.map((user, index) => {
                    return (
                            <h1>FRIEND</h1>
                        )
                    })                
                    // <FriendsListItem 
                    //     key={index} 
                    //     id={user._id} 
                    //     name={user.name}
                    //     nickname={user.nickname}
                    //     surname={user.surname}
                    //     photo={user.photo}
                    // />
                setBlockedUsers(blockedUsers);
                setLoading(false);
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    }, [])

    return (
        <div className={classes.center}>
            {
                loading ? <Spinner /> : <>{blockedUsers}</>
            }
        </div>
    );
}
 
export default UnblockUsers;