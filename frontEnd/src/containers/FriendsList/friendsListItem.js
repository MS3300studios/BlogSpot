import React from 'react';
import classes from './FriendsList.module.css';

const friendsListItem = (props) => {
    return (
        <React.Fragment key={props.index}>
            <div className={classes.listElement}>
                <div className={classes.smallFaceContainer}>
                    <img src={props.img} alt="friend's face"/>
                </div>
                <div className={classes.namesContainer}>
                    <h1>{props.name} {props.surname}</h1>
                    <p>@{props.nickname}</p>
                </div>
            </div>
            <hr/>
        </React.Fragment>
    );
}
 
export default friendsListItem;