import React, { Component } from 'react';
import getToken from '../../getToken';
import axios from 'axios';
import classes from './FriendsList.module.css';

import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';

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
        if(this.props.getData){
            axios({
                method: 'get',
                url: `http://localhost:3001/users/getUser/${this.props.id}`,
                headers: {'Authorization': this.state.token},
            })
            .then((res)=>{
                if(res.status===200){
                    this.setState({friend: res.data.user});
                    if(this.props.getData){
                        this.props.redux_add_friend(res.data.user);
                    }
                }
            })
            .catch(error => {
                console.log(error);
            })
        }
    }

    render() { 
        if(this.props.getData){
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
        else return (
            <a href={"/user/profile/?id="+this.props.id} key={this.props.index} className={classes.containerLink}>
                <div className={classes.listElement}>
                    <div className={classes.smallFaceContainer}>
                        <img src={this.props.friend.photo} alt="friend's face"/>
                    </div>
                    <div className={classes.namesContainer}>
                        <h1>{this.props.friend.name} {this.props.friend.surname}</h1>
                        <p>@{this.props.friend.nickname}</p>
                    </div>
                </div>
                <hr/>
            </a>
        )
    }
}
 
const mapStateToProps = state => {
    return {
        state: state
    };
}

const mapDispatchToProps = dispatch => {
    return {
        redux_add_friend: (friend) => dispatch({type: actionTypes.ADD_FRIEND, data: friend}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendsListItem);