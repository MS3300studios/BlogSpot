import React, { Component } from 'react';
import io from 'socket.io-client';
import { MAIN_URI } from '../../config';

import classes from './onlineIcon.module.css';
 
class OnlineIcon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: false
        }
        this.socket = io(MAIN_URI);
    }

    componentDidMount(){
        this.socket.emit('checkUserOnlineStatus', this.props.online);
        this.socket.on('userOnlineStatus', isOnline => {
            this.setState({status: isOnline});
        })
    }

    render() { 
        let classname = [classes.onlineIcon].join(" "); 

        this.state.status ? classname = [classes.onlineIcon, classes.online].join(" ") 
            : classname = [classes.onlineIcon, classes.offline].join(" ")

        return (
            <>
                {
                    this.props.hide ? null :
                    <div className={classname} />
                }
            </>
        );
    }
}
 
export default OnlineIcon;
