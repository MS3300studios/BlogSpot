import React, { Component } from 'react';
import axios from 'axios';

import classes from './userProfile.module.css';
import Like from '../../components/UI/like';

class UserProfile extends Component {
    constructor(props){
        super(props);

        //getting token
        let token;
        let local = localStorage.getItem('token');
        let session = sessionStorage.getItem('token');
        if(local !== null){
            token = local;
        }
        else if(session !== null){
            token = session;
        }


        let userData = {};
        let userId;
        let userLogged = false;

        if(props.location.name === "/myProfile"){
            let local = localStorage.getItem('userData');
            let session = sessionStorage.getItem('userData');
            if(local !== null){
                userData = JSON.parse(local);
            }
            else if(session !== null){
                userData = JSON.parse(session);
            }
            userId = userData._id;
            userLogged = true;
        }
        else{
            let queryParams = new URLSearchParams(props.location.search);
            userId = queryParams.get('id'); 
        }        

        this.state = { 
            token: token,
            userId: userId,
            userData: userData,
            userLogged: userLogged
        }

    }

    componentDidMount () {
        axios({
            method: 'post',
            url: `http://localhost:3001/users/getUser/${this.state.postId}`,
            headers: {'Authorization': this.state.token},
        }).then((res) => {
            console.log(res)
            const user = {
                nickname: res.data.user.nickname,
                name: res.data.user.name,
                surname: res.data.user.surname,
                email: res.data.user.email,
                createdAt: res.data.user.createdAt
            };
            this.setState({userData: user});
        })
        .catch(error => {
            console.log(error);
        })
    }

    render() { 
        return ( 
            <React.Fragment>
                <div className={classes.MainContainer}>
                    <h1>
                        this is your user profile!
                    </h1>
                    <h6>your id: {}</h6>
                    <Like size="2em" color="blue"/>
                    <Like dislike size="2em" color="blue"/>
                 </div>
             </React.Fragment>
        );
    }
}
 
export default UserProfile;


// style={{height: '10em', width: '10em'}}