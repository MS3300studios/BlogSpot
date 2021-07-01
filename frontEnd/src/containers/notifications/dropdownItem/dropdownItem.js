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
            friendRequestUser: null,
        }

        this.getFriendRequestUserData.bind(this);
    }

    componentDidMount(){
        this.getFriendRequestUserData();
    }

    getFriendRequestUserData = () => {
        //it has to be data.userId because it is the user that submitted the request
        axios({
            method: 'get',
            url: `http://localhost:3001/users/getUser/${this.props.data.userId}`,
            headers: {'Authorization': this.state.token},
        })
        .then((res)=>{
            this.setState({friendRequestUser: res.data.user});
        })
        .catch(error => {
            console.log(error);
        })
    }

    render() { 
        let notification = <Spinner darkgreen />;
        if(this.state.friendRequestUser != null){
            notification = (
                <React.Fragment>
                    <a href={"/user/profile/?id="+this.state.friendRequestUser._id} className={classes.notificationLink}>
                        <img src={this.state.friendRequestUser.photo} alt="this person wants to be your friend" className={classes.friendRequestPhoto}/>
                        <div><p className={classes.bold}>{`@${this.state.friendRequestUser.nickname}`}</p> wants to be your friend</div> 
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