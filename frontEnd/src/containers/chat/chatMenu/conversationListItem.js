import React from 'react';

import classes from './chatMenu.module.css';

const conversationListItem = (props) => {

    let chatSelect = () => {
        if(!props.join){
            props.selectChat(props.el)
        }
        else return null
    }

    return ( 
        <div className={classes.conversation} onClick={chatSelect}>
            <h1>{props.el.name}</h1>
            <div className={classes.participantContainer}>
                {
                    props.el.participants.map((participant, index) => (
                        <p key={index}>{participant.name}</p>
                    ))
                }
            </div>
            {
                props.join ? (
                    <div className={classes.joinButtonContainer}>
                        <div className={classes.joinButton} onClick={()=>props.join(props.el._id)}>join</div>
                    </div>
                ) : null
            }
        </div>
    );
}
 
export default conversationListItem;