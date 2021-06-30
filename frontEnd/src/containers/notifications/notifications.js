import React, { Component } from 'react';
import axios from 'axios';
import classes from './notifications.module.css';
import { IoNotifications } from 'react-icons/io5';
import { FiRefreshCcw } from 'react-icons/fi';
import Button from '../../components/UI/button';

import getToken from '../../getToken';
import DropdownItem from './dropdownItem/dropdownItem';

class Notifications extends Component {
    constructor(props) {
        super(props);

        let token = getToken();

        this.state = {
            token: token,
            friendRequests: []
        }
        this.getNotifications.bind(this);
    }

    componentDidMount(){
        this.getNotifications();
    }

    getNotifications = () => {
        axios({
            method: 'post',
            url: `http://localhost:3001/notifications/getFriendRequests`,
            headers: {'Authorization': this.state.token},
        })
        .then((res)=>{
            this.setState({friendRequests: res.data.requests});
        })
        .catch(error => {
            console.log(error);
        })
    }

    render() {
        let notificationsCount = 0;

        let friendRequests = this.state.friendRequests.map((request, index) => {
            notificationsCount++;
            return (
                <DropdownItem friendRequest data={request} key={index}/>
            )
        })

        let zeroNotifs;
        (notificationsCount<1) ? zeroNotifs = (
            <React.Fragment>
                <div className={classes.dropdownItem}>
                    <p>no notifications</p>
                </div>
                <hr />
            </React.Fragment>
        ) : zeroNotifs = null;
        

        console.log(this.state.friendRequests)

        return (
            <div className={classes.dropdown}>
                <div className={classes.center}><IoNotifications size="2em" color="#0a42a4"/>
                    <div className={classes.notificationNumber}>{notificationsCount}</div>
                </div> 
                <div className={classes.dropdownContent}>
                    <div onClick={this.getNotifications} className={classes.refreshIconContainer}>
                        <FiRefreshCcw size="2em" color="#0a42a4" className={classes.refreshIcon}/>
                    </div>
                    {friendRequests}
                    {zeroNotifs}
                </div>                    
            </div>  
        );
    }
}
 
export default Notifications;