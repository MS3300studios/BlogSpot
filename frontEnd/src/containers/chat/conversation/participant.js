import React from 'react';

import classes from './conversation.module.css';
import UserPhoto from '../../../components/UI/userphoto';

const participant = (props) => {
    return (
        <a href={"/user/profile/?id="+props.el.userId} className={classes.participantLink}>
            <div className={classes.participantListItem}>
                <UserPhoto userId={props.el.userId} />
                <p>{props.el.name}</p>
            </div>
        </a>
    );
}
 
export default participant;