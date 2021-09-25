import React from 'react';

import { Link } from 'react-router-dom';

import UserPhoto from '../../../components/UI/userphoto';
import getColor from '../../../getColor';

import classes from './conversation.module.css';
import greenClasses from './greenClasses.module.css';
import blueClasses from './blueClasses.module.css';

const colorScheme = getColor();
let colorClasses = greenClasses;
if(colorScheme === "blue"){
    colorClasses = blueClasses;
}


const participant = (props) => {
    return (
        <Link to={"/user/profile/?id="+props.el.userId} className={classes.participantLink}>
            <div className={colorClasses.participantListItem}>
                <UserPhoto userId={props.el.userId} />
                <p>{props.el.name}</p>
            </div>
        </Link>
    );
}
 
export default participant;