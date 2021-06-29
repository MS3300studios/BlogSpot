import classes from '../notifications.module.css';
import React, { Component } from 'react';
import getToken from '../../../getToken';
import axios from 'axios';

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
        console.log(this.props.data.friendId)
        axios({
            method: 'post',
            url: `http://localhost:3001/users/getUser/${this.props.data.friendId}`,
            headers: {'Authorization': this.state.token},
        })
        .then((res)=>{
            console.log(res.data.user)
            this.setState({friendRequestUser: res.data.user});
        })
        .catch(error => {
            console.log(error);
        })
    }

    render() { 
        console.log(this.state.friendRequestUser)


        let notification;
        if(this.props.friendRequest){
            notification = (
                <React.Fragment>
                    {/* <img src={this.state.friendRequestUser.photo} alt="this person wants to be your friend" className={classes.friendRequestPhoto}/> */}
                    {/* <p>{`${this.state.friendRequestUser.name} ${this.state.friendRequestUser.name} wants to be your friend`}</p> */}
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