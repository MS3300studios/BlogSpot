import React, { Component } from 'react';
import axios from 'axios';
import classes from './notifications.module.css';

import { FiRefreshCcw } from 'react-icons/fi';
import { IoNotifications } from 'react-icons/io5';
import getToken from '../../getToken';
import Spinner from '../../components/UI/spinner';
import DropdownItem from './dropdownItem/dropdownItem';

class Notifications extends Component {
    constructor(props) {
        super(props);

        let token = getToken();

        this.state = {
            token: token,
            refreshing: false,
            friendRequests: []
        }
        this.getNotifications.bind(this);
    }

    componentDidMount(){
        this.getNotifications();
    }

    getNotifications = () => {
        this.setState({refreshing: true});
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

        setTimeout(() => {
            this.setState({refreshing: false});
        }, 1000)
    }

    render() {
        let notificationsCount = 0;

        let friendRequests;
        if(this.props.refreshNotifs){
            let requestsTrimmed = this.state.friendRequests.filter(req => req._id === this.props.idToDrop);
            friendRequests = requestsTrimmed.map((request, index) => {
                notificationsCount++;
                return (
                    <DropdownItem friendRequest data={request} key={index}/>
                )
            })
        }
        else {
            friendRequests = this.state.friendRequests.map((request, index) => {
                notificationsCount++;
                return (
                    <DropdownItem friendRequest data={request} key={index}/>
                )
            })
        }

        let zeroNotifs;
        (notificationsCount<1) ? zeroNotifs = (
            <React.Fragment>
                <div className={classes.dropdownItem}>
                    <p>no notifications</p>
                </div>
                <hr />
            </React.Fragment>
        ) : zeroNotifs = null;
        
        return (
            <div className={classes.dropdown}>
                <div className={classes.center}><IoNotifications size="2em" color="#0a42a4"/>
                    <div className={classes.notificationNumber}>{notificationsCount}</div>
                </div> 
                <div className={classes.dropdownContent}>
                    <div 
                        onClick={this.getNotifications}
                        className={classes.refreshIconContainer}
                    >
                        <FiRefreshCcw size="2em" color="#0a42a4" className={classes.refreshIcon}/>
                    </div>
                    {this.state.refreshing ? <Spinner darkgreen /> : friendRequests}
                    {zeroNotifs}
                </div>                    
            </div>  
        );
    }
}
 
export default Notifications;