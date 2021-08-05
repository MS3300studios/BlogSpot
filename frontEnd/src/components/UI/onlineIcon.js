import React from 'react';

import classes from './onlineIcon.module.css';

const onlineIcon = (props) => {
    let classname = [classes.onlineIcon].join(" ");
    props.online ? classname = [classes.onlineIcon, classes.online].join(" ") 
        : classname = [classes.onlineIcon, classes.offline].join(" ")

    return (
        <div className={classname} />
    );
}
 
export default onlineIcon;
