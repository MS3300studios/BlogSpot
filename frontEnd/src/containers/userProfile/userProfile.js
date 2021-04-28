import React, { Component } from 'react';
import axios from 'axios';

import classes from './userProfile.module.css';
import photoFiller from '../../assets/userPhoto/image.jfif';
// import Like from '../../components/UI/like';

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

        if(props.location.pathname === "/myProfile"){
            userLogged = true;
            let local = localStorage.getItem('userData');
            let session = sessionStorage.getItem('userData');
            if(local !== null){
                userData = JSON.parse(local);
            }
            else if(session !== null){
                userData = JSON.parse(session);
            }
            userId = userData._id;
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
        if(this.state.userLogged === false){
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
    }

    render() { 
        return ( 
            <React.Fragment>
                <div className={classes.flexContainer}>
                    <div className={classes.mainContainer}>
                        <img src={photoFiller} alt="user" className={classes.userPhoto}/>
                        <div className={classes.textInfoContainer}>
                            <h1>@Jenny928</h1>
                            <h2>Jenny Nguyen</h2>
                            <div className={classes.bio}>
                                <p>Lorem ipsum dolor sit amet consectetur adipiscing elit class eget, laoreet arcu volutpat proin ligula etiam sapien nec auctor, donec est morbi taciti nibh felis gravida dui. Varius morbi dui augue imperdiet torquent, cursus ad placerat eget ultrices, cubilia orci ornare mi. Quisque vivamus tempor fringilla nisi pellentesque quis potenti sed, netus praesent pulvinar tincidunt interdum vehicula penatibus, lacus sollicitudin tempus taciti inceptos fermentum purus. Risus montes eros dignissim etiam sodales velit non natoque, facilisi potenti vivamus consequat auctor mus dui.</p>
                            </div>
                        </div>
                    </div>                    
                 </div>
             </React.Fragment>
        );
    }
}
 
export default UserProfile;


// <Like size="2em" color="blue"/>
// <Like dislike size="2em" color="blue"/>