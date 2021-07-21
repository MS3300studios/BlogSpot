import React, { Component } from 'react';
import axios from 'axios';
import classes from './notifications.module.css';

import { FiRefreshCcw } from 'react-icons/fi';
import { IoNotifications } from 'react-icons/io5';
import getToken from '../../getToken';
import Spinner from '../../components/UI/spinner';
import DropdownItem from './dropdownItem/dropdownItem';

import { connect } from 'react-redux';

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
    }

    componentDidMount(){
        this.getNotifications();
    }

    componentDidUpdate(prevProps){
        if(prevProps.idToDrop !== this.props.idToDrop){
            this.getNotifications();
            // console.log(this.state.friendRequests)
            // let notifCount = 0;
            // let requestsTrimmed = this.state.friendRequests.filter(el => el.userId !== this.props.idToDrop);
            // console.log(requestsTrimmed[0])
            // let friendsRdy = requestsTrimmed.map((request, index) => {
            //     notifCount++;
            //     return (
            //         <DropdownItem friendRequest data={request} key={index}/>
            //     )
            // })
            // this.setState({friendRequestsJSX: friendsRdy, notificationsCount: notifCount});
        }
    }

    getNotifications = () => {
        this.setState({refreshing: true});
        axios({
            method: 'post',
            url: `http://localhost:3001/notifications/getFriendRequests`,
            headers: {'Authorization': this.state.token},
        })
        .then((res)=>{
            let notifCount = 0;
            let friendsRdy = res.data.requests.map((request, index) => {
                notifCount++;
                return (
                    <DropdownItem friendRequest data={request} key={index}/>
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
        (this.state.notificationsCount<1) ? zeroNotifs = (
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
                    {this.state.notificationsCount<1 ? null : (
                        <div className={classes.notificationNumber}>{this.state.notificationsCount}</div>
                    )}
                </div> 
                <div className={classes.dropdownContent}>
                    <div 
                        onClick={this.getNotifications}
                        className={classes.refreshIconContainer}
                    >
                        <FiRefreshCcw size="2em" color="#0a42a4" className={classes.refreshIcon}/>
                    </div>
                    {this.state.refreshing ? <Spinner darkgreen /> : this.state.friendRequestsJSX}
                    {zeroNotifs}
                </div>                    
            </div>  
        );
    }
}
 
const mapStateToProps = state => {
    return {
        idToDrop: state.friendReqIdToBeRemoved
    };
}

export default connect(mapStateToProps)(Notifications);