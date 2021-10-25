import React, { Component } from 'react';
import axios from 'axios';
import classes from './notifications.module.css';
import { MAIN_URI } from '../../config';

import { FiRefreshCcw } from 'react-icons/fi';
import { FaRegTrashAlt } from 'react-icons/fa';
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
            friendRequests: [],
            friendRequestsJSX: [],
            notificationsCount: 0
        }
        this.getNotifications.bind(this);
        this.removeNotifs.bind(this);
        this.decrementCounter.bind(this);
    }

    componentDidMount(){
        this.getNotifications();
    }

    componentDidUpdate(prevProps){
        if(prevProps.idToDrop !== this.props.idToDrop){
            this.getNotifications();
        }
    }

    decrementCounter = () => {
        this.setState(prevState => {
            let count = prevState.notificationsCount-1;
            return {
                ...prevState,
                notificationsCount: count,
            };
        })
    }

    removeNotifs = (friendRequest, all, data) => {
        if(this.state.friendRequestsJSX.length!==0){
            if(all){
                this.setState({friendRequestsJSX: [], notificationsCount: 0});
                //axios call to delete all notifications (incl friend requests)
                axios({
                    method: 'get',
                    url: `${MAIN_URI}/notifications/delete/all`,
                    headers: {'Authorization': this.state.token}
                })
                .catch(error => {
                    console.log(error);
                })
            }
            else if(friendRequest){
                setTimeout(()=>{
                    this.setState(prevState => {
                        let count = prevState.notificationsCount-1;
                        return {
                            ...prevState,
                            notificationsCount: count,
                        };
                    })
                }, 600); //wait 600ms for the closing animation to finish
                axios({
                    method: 'post',
                    url: `${MAIN_URI}/revokeRequestById`,
                    headers: {'Authorization': this.state.token},
                    data: {friendReqId: data.friendReqId}
                })
                .then((res)=>{
                    if(res.status===200){
                        
                        return;
                    }
                })
                .catch(error => {
                    console.log(error);
                })
            }
            else{
                setTimeout(()=>{
                    this.setState(prevState => {
                        let count = prevState.notificationsCount-1;
                        return {
                            ...prevState,
                            notificationsCount: count,
                        };
                    })
                }, 600); //wait 600ms for the closing animation to finish
    
                axios({
                    method: 'post',
                    url: `${MAIN_URI}/notifications/delete/one`,
                    headers: {'Authorization': this.state.token},
                    data: {data}
                })
                .then((res)=>{
                    if(res.status===200){
                        
                        return;
                    }
                })
                .catch(error => {
                    console.log(error);
                })
            }
        }
    }

    getNotifications = () => {
        this.setState({refreshing: true});
        axios({
            method: 'get',
            url: `${MAIN_URI}/notifications`,
            headers: {'Authorization': this.state.token},
        })
        .then((res)=>{
            let notifCount = 0;
            let friendsRdy = res.data.notifications.map((notification, index) => {
                if(notification.wasSeen === false || notification.friendId){
                    notifCount++;
                }

                return (
                    <DropdownItem data={notification} key={index} elKey={index} deleteNotif={this.removeNotifs} decrementCounter={this.decrementCounter} />
                )
            })
            this.setState({friendRequests: res.data.requests, friendRequestsJSX: friendsRdy, notificationsCount: notifCount});
        })
        .catch(error => {
            console.log(error);
        })

        setTimeout(() => {
            this.setState({refreshing: false});
        }, 1000)
    }

    render() {
        let zeroNotifs;
        (this.state.friendRequestsJSX.length<1) ? zeroNotifs = (
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
                    {this.state.notificationsCount < 1 ? null : (
                        <div className={classes.notificationNumber}>{this.state.notificationsCount}</div>
                    )}
                </div> 
                <div className={classes.dropdownContent}>
                    <div className={classes.iconsContainer}>
                        <div
                            onClick={()=>this.removeNotifs(false, true)} 
                            className={classes.deleteAllIconContainer}
                        >
                            <FaRegTrashAlt size="2em" color="#0a42a4"/>
                        </div>
                        <div 
                            onClick={this.getNotifications}
                            className={classes.refreshIconContainer}
                        >
                            <FiRefreshCcw size="2em" color="#0a42a4" className={classes.refreshIcon}/>
                        </div>
                    </div>
                    <hr />
                    {this.state.refreshing ? <Spinner darkgreen /> : this.state.friendRequestsJSX}
                    {zeroNotifs}
                </div>                    
            </div>  
        );
    }
}
 
export default Notifications;

/*
deleting one notification mechanism for later
this.setState(prevState => {
    let newNotifications = prevState.friendRequests.filter(notif => notif.objectId === data.id && notif.actionType === data.action)
    let count = 0;
    let newNotifsJSX = newNotifications.map((notif, index) => {
        count++
        return (
            <DropdownItem data={notif} key={index} deleteNotif={this.removeNotifs}/>
        )
    })
    return {
        ...prevState,
        friendRequests: newNotifications,
        friendRequestsJSX: newNotifsJSX,
        notificationsCount: count
    }
})
*/


/*
    axios({
        method: 'post',
        url: `${MAIN_URI}/notifications/delete/one`,
        headers: {'Authorization': this.state.token},
        data: {
            data: data
        }
    })
    .then((res)=>{
        if(res.status===200){
            //this.getNotifications();
            return;
        }
    })
    .catch(error => {
        console.log(error);
    })
*/