import React from 'react';
import classes from './FriendsList.module.css';

import { BiMessageDetail } from 'react-icons/bi';

const friendsListItem = (props) => {
    return (
        <>
            <div className={classes.friendContainer}>
                <div className={classes.listElement}>
                    <div className={classes.smallFaceContainer}>
                        <img src={props.photo} alt="friend's face"/>
                    </div>
                    <div className={classes.namesContainer}>
                        <a href={"/user/profile/?id="+props.id} key={props.index} className={classes.containerLink}>
                            <h1>{props.name} {props.surname}</h1>
                        </a>
                        <p>@{props.nickname}</p>
                    </div>
                </div>
                <div className={classes.chatIcon}>
                    <BiMessageDetail size="2em" color="#0a42a4" />
                </div>
            </div>
            <hr/>
        </>
    );
}
 
export default friendsListItem;