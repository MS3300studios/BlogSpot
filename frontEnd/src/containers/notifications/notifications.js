import React, { Component } from 'react';
import classes from './notifications.module.css';
import { IoNotifications } from 'react-icons/io5';

class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return (
            <div className={classes.dropdown}>
                <div className={classes.center}><IoNotifications size="2em" color="#0a42a4"/><div className={classes.notificationNumber}>6</div></div> 
                <div className={classes.dropdownContent}>
                    <p>notification</p>
                    <hr />
                    <p>notification</p>
                    <hr />
                    <p>notification</p>
                    <hr />
                    <p>notification</p>
                    <hr />
                    <p>notification</p>
                    <hr />
                    <p>notification</p>
                </div>                    
            </div>  
        );
    }
}
 
export default Notifications;