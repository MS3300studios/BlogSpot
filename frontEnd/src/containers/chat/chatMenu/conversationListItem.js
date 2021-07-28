import React from 'react';

import classes from './chatMenu.module.css';

const conversationListItem = (props) => {
    return ( 
        <div className={classes.conversation} onClick={()=>props.selectChat(props.el)}>
            <h1>{props.el.name}</h1>
            <div className={classes.participantContainer}>
                {
                    props.el.participants.map((participant, index) => (
                        <p key={index}>{participant.name}</p>
                    ))
                }
            </div>
        </div>
    );
}
 
export default conversationListItem;