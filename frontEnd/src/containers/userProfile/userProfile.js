import React, { Component } from 'react';

import classes from './userProfile.module.css';

class UserProfile extends Component {
    constructor(props){
        //used to determine relation between logged in user and the user whoose profile is viewed
        let currentUserData;
        let local = localStorage.getItem('userData');
        let session = sessionStorage.getItem('userData');
        if(local !== null){
            currentUserData = JSON.parse(local);
        }
        else if(session !== null){
            currentUserData = JSON.parse(session);
        }

        //obtaining user id for later requests
        let queryParams = new URLSearchParams(this.props.location.search);
        let userId = queryParams.get('id'); 

        let userLoggedInViewing = false;
        if(userId === currentUserData._id){
            userLoggedInViewing = true
        }

        super(props);
        this.state = { 
            userData: {},
            userId: userId,
            userLoggedInViewing: userLoggedInViewing
        }

    }
    render() { 
        let view;
        if(this.state.userLoggedInViewing){
            view = (
                <React.Fragment>
                <div className={classes.MainContainer}>
                    <h1>
                        this is your user profile!
                    </h1>
                    <h6>your id: {}</h6>
                </div>
            </React.Fragment>
            )
        }
        else{
            view = (
                <React.Fragment>
                    <div className={classes.MainContainer}>
                        <h1>
                            this is some other user profile!
                        </h1>
                        <h6>users id: {}</h6>
                    </div>
                </React.Fragment>
            )
        }
        return ( 
            {view}
        );
    }
}
 
export default UserProfile;