import React from 'react';
import classes from './FriendsList.module.css';

const friendsListItem = (props) => {
    return (
        <a href={"/user/profile/?id="+props.id} key={props.index} className={classes.containerLink}>
            <div className={classes.listElement}>
                <div className={classes.smallFaceContainer}>
                    <img src={props.photo} alt="friend's face"/>
                </div>
                <div className={classes.namesContainer}>
                    <h1>{props.name} {props.surname}</h1>
                    <p>@{props.nickname}</p>
                </div>
            </div>
            <hr/>
        </a>
    );
}
 
export default friendsListItem;