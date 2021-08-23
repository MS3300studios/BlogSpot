import axios from 'axios'
import React, { useEffect, useState } from 'react'
import getToken from '../../../getToken'

import Spinner from '../../../components/UI/spinner';
import Conversation from './conversation';

const BlockedUserPrevent = (props) => {
    const [content, setcontent] = useState(<h1>This user is blocked, to unblock them, go to settings, blocked users</h1>)
    const [loading, setloading] = useState(true)

    useEffect(() => {
        const token = getToken();
        axios({
            method: 'get',
            url: `http://localhost:3001/blocking/checkBlock/${props.friendId}`,
            headers: {'Authorization': token}
        })
        .then((res)=>{
            if(res.status===200){
                if(res.data.blocked === true){
                    setcontent(<Conversation conversation={props.selectedConversation}/>);
                    setloading(false);
                }
                else{
                    setloading(false);
                }
            }
        })
        .catch(error => {
            console.log(error);
        })
    }, [])

    return (
        <>
            {
                loading ? <Spinner /> : <>{content}</>
            }
        </>
    );
}
 
export default BlockedUserPrevent;