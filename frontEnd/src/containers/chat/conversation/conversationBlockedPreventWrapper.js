import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import getToken from '../../../getToken'

import Spinner from '../../../components/UI/spinner';
import Conversation from './conversation';
import getUserData from '../../../getUserData';

const BlockedUserPrevent = (props) => {
    const [content, setcontent] = useState()
    const [loading, setloading] = useState(true)

    let getOtherUserNameAndId = useCallback(() => {
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
    }, [props.selectedConversation.participants])

    let validate = useCallback(() => {
        const token = getToken();
        const data = getOtherUserNameAndId();
        axios({
            method: 'get',
            url: `http://localhost:3001/blocking/checkBlock/${data.friendId}`,
            headers: {'Authorization': token}
        })
        .then((res)=>{
            if(res.status===200){
                if(res.data.blocked === false){
                    setcontent(<Conversation conversation={props.selectedConversation} refreshAfterBlock={validate}/>);
                    setloading(false);
                }
                else{
                    setcontent(
                        <div style={{display: "flex", justifyContent: "center", width: "100%", height: "100%", alignItems: "center"}}>
                            <h1 style={{color: "white"}}>This user is blocked, to unblock them, go to settings - blocked users</h1>
                        </div>
                    );
                    setloading(false);
                }
            }
        })
        .catch(error => {
            console.log(error);
        })
    }, [props.selectedConversation, getOtherUserNameAndId])

    useEffect(() => {
        
        if(props.selectedConversation.conversationType === 'private'){
            setloading(true);
            validate();
        }
        else{
            setcontent(<Conversation conversation={props.selectedConversation} refreshAfterBlock={validate}/>);
            setloading(false);
        }
    }, [props.selectedConversation, validate])

    return (
        <>
            {
                loading ? <Spinner /> : <>{content}</>
            }
        </>
    );
}
 
export default BlockedUserPrevent;