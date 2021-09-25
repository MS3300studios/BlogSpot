import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import classes from './FriendsList.module.css';

import { BiMessageDetail } from 'react-icons/bi';
import { BiBlock } from 'react-icons/bi';
import { Redirect } from 'react-router-dom';
import OnlineIcon from '../../components/UI/onlineIcon';
import axios from 'axios';
import getToken from '../../getToken';
import Flash from '../../components/UI/flash';

const FriendsListItem = (props) => {
    const [checked, setchecked] = useState(props.selectAll)
    const [redirectToConversation, setRedirectToConversation] = useState(false)

    //flash
    const [flashMessage, setflashMessage] = useState("");
    const [flashNotClosed, setflashNotClosed] = useState(true);

    useEffect(() => {
        setchecked(props.selectAll)
    }, [props.selectAll])

    let flash = (message) => {
        setflashMessage(message);
        
        setTimeout(()=>{
            setflashNotClosed(false);
        }, 2000)
        
        setTimeout(()=>{
            setflashMessage("");
        }, 3000);
        
        setTimeout(()=>{
            setflashNotClosed(true);
        }, 3000);
    }

    let checkIfBlocked = () => {
        const token = getToken();
        axios({
            method: 'get',
            url: `http://localhost:3001/blocking/checkBlock/${props.id}`,
            headers: {'Authorization': token}
        })
        .then((res)=>{
            if(res.status===200){
                if(res.data.blocked === true) flash("this user is blocked, to unblock, go to settings -> unblock users");
                else setRedirectToConversation(true);
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    let flashContent = null;
    if(flashMessage && flashNotClosed){
        flashContent = <Flash>{flashMessage}</Flash>
    }
    else if(flashMessage && flashNotClosed === false){
        flashContent = <Flash close>{flashMessage}</Flash>
    }

    return (
        <>
            <div className={classes.friendContainer}>
                <div className={classes.listElement}>
                    <div className={classes.smallFaceContainer}>
                        <img src={props.photo} alt="friend's face"/>
                        {
                            props.onlineIcon ? (
                                <div className={classes.onlineIconPositioner}>
                                    <OnlineIcon online={props.id} hide={props.hideOnlineIcon}/>
                                </div>
                            ) : null
                        }
                    </div>
                    <div className={classes.namesContainer}>
                        <Link to={"/user/profile/?id="+props.id} key={props.index} className={classes.containerLink}>
                            <h1>{props.name} {props.surname}</h1>
                        </Link>
                        <p>@{props.nickname}</p>
                    </div>
                </div>
                {
                    props.noInteractionIcon ? null : (
                        <>
                            {
                                props.friendSelect ? (
                                    <input 
                                        type="checkbox" 
                                        className={classes.inputCheckbox} 
                                        onChange={()=>{
                                            props.friendWasSelected({userId: props.id, name: props.name}, !checked)
                                            setchecked(!checked)
                                        }}
                                        checked={checked}
                                    />
                                ) : (
                                    <>
                                        {
                                            props.unblock ? (
                                                <button className={classes.unblockUser} onClick={()=>props.unblock(props.id)}>
                                                    <BiBlock size="1.5em" color="#FFF" />
                                                    Unblock user
                                                </button>
                                            ) : (
                                                <div className={classes.chatIcon} onClick={checkIfBlocked}>
                                                    <BiMessageDetail size="2em" color="#0a42a4" />
                                                </div>
                                            )
                                        }
                                    </>
                                )
                            }
                        </>
                    )
                }
            </div>
            {
                props.friendSelect ? null : <hr />
            }
            {
                redirectToConversation ? <Redirect to={`/conversation/?id=${props.id}`} /> : null
            }
            {flashContent}
        </>
    );
}
 
export default FriendsListItem;