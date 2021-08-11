import React, {useEffect, useState} from 'react';
import io from 'socket.io-client';

import classes from './onlineIcon.module.css';

const OnlineIcon = (props) => {
    const [status, setStatus] = useState(false)
    const socket = io('http://localhost:3001');

    useEffect(() => {
        socket.emit('checkUserOnlineStatus', props.online);
        socket.on('userOnlineStatus', isOnline => {
            setStatus(isOnline);
        })
    }, [props.online, socket]);

    let classname = [classes.onlineIcon].join(" "); 

    status ? classname = [classes.onlineIcon, classes.online].join(" ") 
        : classname = [classes.onlineIcon, classes.offline].join(" ")

    return (
        <>
        {
            props.hide ? null :
            <div className={classname} />
        }
        </>
    );
}
 
export default OnlineIcon;