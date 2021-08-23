import axios from 'axios'
import React, { useEffect, useState } from 'react'
import getToken from '../../../getToken'

import Spinner from '../../../components/UI/spinner';
import Conversation from './conversation';
import getUserData from '../../../getUserData';

const BlockedUserPrevent = (props) => {
    const [content, setcontent] = useState(<h1>This user is blocked, to unblock them, go to settings, blocked users</h1>)
    const [loading, setloading] = useState(true)

    let getOtherUserNameAndId = () => {
        let userData = getUserData();
        let friendName = null;
        let friendId = null;
        props.selectedConversation.participants.forEach(participant => {
            if(participant.userId !== userData._id){
                friendName = participant.name;
                friendId = participant.userId;
            }
        });
        return ({friendName: friendName, friendId: friendId})
    }

    useEffect(() => {
        if(props.selectedConversation.conversationType === 'private'){
            const token = getToken();
            const data = getOtherUserNameAndId();
            axios({
                method: 'get',
                url: `http://localhost:3001/blocking/checkBlock/${data.friendId}`,
                headers: {'Authorization': token}
            })
            .then((res)=>{
                if(res.status===200){
                    console.log(res.data)
                    if(res.data.blocked === false){
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
        }
    }, [])

    useEffect(() => {
        setcontent(<Conversation conversation={props.selectedConversation}/>);
    }, [props.selectedConversation])

    return (
        <>
            {
                loading ? <Spinner /> : <>{content}</>
            }
        </>
    );
}
 
export default BlockedUserPrevent;