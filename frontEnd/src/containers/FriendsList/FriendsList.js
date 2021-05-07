import React, { Component } from 'react';

import classes from './FriendsList.module.css';


class FriendsList extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }
    render() { 
        return (
            <div className={classes.mainContainer}>
                friends
            </div>
        );
    }
}
 
export default FriendsList;