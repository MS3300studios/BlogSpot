import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { MAIN_URI } from '../../../config';

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
        let friend = props.el.participants.filter(participant => participant.userId !== userData._id)[0];

        if(props.el.conversationType === 'private'){
            axios({
                method: 'get',
                url: `${MAIN_URI}/blocking/checkBlock/${friend.userId}`,
                headers: {'Authorization': token}
            })
            .then((res)=>{
                if(res.status===200){
                    if(res.data.blocked === true){
                        axios({
                            method: 'get',
                            url: `${MAIN_URI}/users/getUser/${friend.userId}`,
                            headers: {'Authorization': token}
                        })
                        .then((res)=>{
                            if(res.status===200){
                                setUser(res.data.user);
                                setlatestMessage({content: "blocked"});
                                setIsNew(false);
                                setLoadingLatestMessage(false);
                                setLoading(false);
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        })
                    }
                    else{
                        //getting user data becasue he wasn't blocked
                        axios({
                            method: 'get',
                            url: `${MAIN_URI}/users/getUser/${friend.userId}`,
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
                        
                        //getting latest message
                        axios({
                            method: 'post',
                            url: `${MAIN_URI}/messages/latest`,
                            headers: {'Authorization': token},
                            data: {
                                conversationId: props.el._id
                            }
                        })
                        .then((res) => {
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
                        })
                        .catch(error => {
                            console.log(error);
                        })
                    }
                }
            })
            .catch(error => {
                console.log(error);
            })
        }
        else{
            axios({
                method: 'post',
                url: `${MAIN_URI}/messages/latest`,
                headers: {'Authorization': token},
                data: {
                    conversationId: props.el._id
                }
            })
            .then((res) => {
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
            })
            .catch(error => {
                console.log(error);
            })
        }

        
    }, [props.el._id, props.el.conversationType, props.el.participants, token, userData._id])

    let chatSelect = () => {
        if(!props.join){
            props.selectChat(props.el);
            setIsNew(false);
        }
        else return null
    }

    let content = (
        <h1>{props.el.name}</h1>
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
        if(latestMessage.content === "blocked"){
            latestMessageDisplay = (
                <div className={classes2.latestMessageContainer}>
                    <p className={classes2.latestMessage}>this user is blocked</p>
                </div>
            )
        }
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
    }

    let classNames;
    isNew ? classNames = [classes.conversation, classes.conversationNewMessage].join(" ") : classNames = classes.conversation;

    return (
        <>
            <div className={classNames} onClick={chatSelect}>
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
        </>
    );
}
 
export default ConversationListItem;