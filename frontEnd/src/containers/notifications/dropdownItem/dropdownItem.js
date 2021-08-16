import classes from '../notifications.module.css';
import React, { Component } from 'react';
import getToken from '../../../getToken';
import axios from 'axios';
import Spinner from '../../../components/UI/spinner';

class DropdownItem extends Component {
    constructor(props) {
        super(props);

        let token = getToken();

        this.state = {
            token: token,
            user: null,
        }

        this.getuserData.bind(this);
    }

    componentDidMount(){
        let userToGetId;
        if(this.props.data.senderId !== undefined){
            userToGetId = this.props.data.senderId;
        }
        else{
            userToGetId = this.props.data.userId;
        }

        console.log(userToGetId)
        this.getuserData(userToGetId);
    }

    getuserData = (userId) => {
        axios({
            method: 'get',
            url: `http://localhost:3001/users/getUser/${userId}`,
            headers: {'Authorization': this.state.token},
        })
        .then((res)=>{
            this.setState({user: res.data.user});
        })
        .catch(error => {
            console.log(error);
        })
    }

    render() { 
        let notification = <Spinner darkgreen />;
        if(this.state.user != null && this.props.data.senderId === undefined){
            notification = (
                <React.Fragment>
                    <a href={"/user/profile/?id="+this.state.user._id} className={classes.notificationLink}>
                        <img src={this.state.user.photo} alt="this person wants to be your friend" className={classes.friendRequestPhoto}/>
                        <div><p className={classes.bold}>{`@${this.state.user.nickname}`}</p> wants to be your friend</div> 
                    </a>
                </React.Fragment>
            )
        }
        else if(this.state.user != null){
            notification = <p>notification</p>
            notification = (
                <React.Fragment>
                    <a href={"/user/profile/?id="+this.state.user._id} className={classes.notificationLink}>
                        <img src={this.state.user.photo} alt="friend" className={classes.friendRequestPhoto}/>
                        <div><p className={classes.bold}>{`@${this.state.user.nickname}`}</p>{this.props.data.actionType} on your {this.props.data.objectType}</div> 
                    </a>
                </React.Fragment>
            )
        }

        return (
            <React.Fragment>
                <div className={classes.dropdownItem}>
                    {notification}
                </div>
                <hr />
            </React.Fragment>
        );
    }
}
 
export default DropdownItem;