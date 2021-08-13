import React, {useEffect, useState} from 'react';
import axios from 'axios';

import classes from './chatMenu.module.css';
import classes2 from './conversationListItem.module.css';

import getToken from '../../../getToken';
import Spinner from '../../../components/UI/spinner';
import UserPhoto from '../../../components/UI/userphoto';
import getUserData from '../../../getUserData';

const ConversationListItem = (props) => {
    const [loading, setLoading] = useState(true);
    const [loadingLatestMessage, setLoadingLatestMessage] = useState(true);
    const [user, setUser] = useState(null);
    const [latestMessage, setlatestMessage] = useState();
    const [isNew, setIsNew] = useState(false);

    const userData = getUserData();
    const token = getToken();

    useEffect(() => {
        if(props.el.conversationType === 'private'){
            let friend = props.el.participants.filter(participant => participant.userId !== userData._id)[0];

            axios({
                method: 'get',
                url: `http://localhost:3001/users/getUser/${friend.userId}`,
                headers: {'Authorization': token}
            })
            .then((res)=>{
                if(res.status===200){
                    setUser(res.data.user);
                    setLoading(false);
                    return;
                }
            })
            .catch(error => {
                console.log(error);
            })        
        }

        axios({
            method: 'post',
            url: `http://localhost:3001/messages/latest`,
            headers: {'Authorization': token},
            data: {
                conversationId: props.el._id
            }
        })
        .then((res)=>{
            if(res.status===200){
                if(res.data.message === "none"){
                    setlatestMessage({content: "none", authorName: ""});
                    setIsNew(res.data.isNew);
                    setLoadingLatestMessage(false);
                }
                else{
                    setlatestMessage(res.data.message);
                    setIsNew(res.data.isNew);
                    setLoadingLatestMessage(false);
                }
            }
        })
        .catch(error => {
            console.log(error);
        })

    }, [])

    let chatSelect = () => {
        if(!props.join){
            props.selectChat(props.el)
        }
        else return null
    }

    let content = (
        <>
            <h1>{props.el.name}</h1>
            {/* <div className={classes.participantContainer}>
                {
                    props.el.participants.map((participant, index) => (
                        <p key={index}>{participant.name}</p>
                    ))
                }
            </div> */}
        </>
    );

    if(props.el.conversationType === "private"){
        loading ? content = <Spinner small darkgreen/> : content = (
            <div className={classes.userDataContainer}>
                <UserPhoto userId={user._id}/>
                <h1>{user.name} {user.surname}</h1>
            </div>
        )
    }


    let latestMessageDisplay = null;
    if(loadingLatestMessage === true) latestMessageDisplay = <Spinner small/>;
    else{
        latestMessageDisplay = (
            <div className={classes2.latestMessageContainer}>
                {
                    (latestMessage.content === "none") ? 
                    <p className={classes2.latestMessage}>no messages have been sent yet</p> :
                    <p className={classes2.latestMessage}>{latestMessage.authorName}: {latestMessage.content}</p>
                }
            </div>
        )
    }

    return (<>
        <div className={classes.conversation} onClick={chatSelect}>
            {loadingLatestMessage ? null : <h3 className={classes2.latestMessageHour}>{latestMessage.hour}</h3>}
            {content}
            {latestMessageDisplay}
            {
                props.join ? (
                    <div className={classes.joinButtonContainer}>
                        <div className={classes.joinButton} onClick={()=>props.join(props.el._id)}>join</div>
                    </div>
                ) : null
            }
        </div>
    </>);
}
 
export default ConversationListItem;