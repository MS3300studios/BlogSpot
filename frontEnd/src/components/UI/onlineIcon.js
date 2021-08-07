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
    }, [])
    // socket.emit('getOnlineUsers');
    //     socket.on('onlineUsers', onlineUsers => {
    //         setusers(onlineUsers);
    //     })

    let classname = [classes.onlineIcon].join(" ");
    status ? classname = [classes.onlineIcon, classes.online].join(" ") 
        : classname = [classes.onlineIcon, classes.offline].join(" ")

    return (
        <div className={classname} />
    );
}
 
export default OnlineIcon;
