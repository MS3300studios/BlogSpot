import React, { Component } from 'react';
import getToken from '../../getToken';
import axios from 'axios';
import classes from './FriendsList.module.css';

class FriendsListItem extends Component {
    constructor(props) {
        super(props);

        let token = getToken();

        this.state = {
            token: token,
            friend: {}
        }
    }

    componentDidMount(){
        axios({
            method: 'get',
            url: `http://localhost:3001/users/getUser/${this.props.id}`,
            headers: {'Authorization': this.state.token},
        })
        .then((res)=>{
            if(res.status===200){
                this.setState({friend: res.data.user});
                this.props.sendInfo(res.data.user);
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    render() { 
        return (
            <a href={"/user/profile/?id="+this.props.id} key={this.props.index} className={classes.containerLink}>
                <div className={classes.listElement}>
                    <div className={classes.smallFaceContainer}>
                        <img src={this.state.friend.photo} alt="friend's face"/>
                    </div>
                    <div className={classes.namesContainer}>
                        <h1>{this.state.friend.name} {this.state.friend.surname}</h1>
                        <p>@{this.state.friend.nickname}</p>
                    </div>
                </div>
                <hr/>
            </a>
        );
    }
}
 
export default FriendsListItem;