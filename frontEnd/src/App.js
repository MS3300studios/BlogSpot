import React, { Component } from 'react';
import { Route, Switch, withRouter, Router } from 'react-router-dom';
import { connect } from 'react-redux';
// import io from 'socket.io-client';

import './App.css';

import Menu from './components/menu/menu';
import UserProfile from './containers/userProfile/userProfile';
import FriendsList from './containers/FriendsList/FriendsList';
import Dashboard from './containers/dashboard/dashboard';
import PostView from './components/postView/postView';
import Gate from './containers/gate/gate';
import Login from './containers/gate/login/login';
import Registration from './containers/gate/registration/registration';
import URLnotFound from './components/URLnotfound/404';
import axios from 'axios';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoggedIn: false
    }
    // const socket = io.connect('http://localhost:3001')
  }
  

  componentDidMount(){
    let session = sessionStorage.getItem('token');
    let local = localStorage.getItem('token');
    if(session!==null||local!==null){
      this.setState({isLoggedIn: true}); //user gets access to dashboard and posts views
    }
    
  }

  render() {
    let content; 
    let gate;
    if(this.state.isLoggedIn){
      content = (
        <React.Fragment>
          <Menu />
            <Switch>
              <Route path="/post/" component={PostView} />
              <Route path="/user/profile/" component={UserProfile} />
              <Route path="/user/friends/" component={FriendsList} />
              <Route path="/" render={()=><Dashboard />} />
            </Switch>
        </React.Fragment>
      );
      gate = null;
    }
    else{
      content = null;
      gate = (
        <React.Fragment>
          <Switch>
            <Route path="/register" exact component={Registration} />
            <Route path="/login" exact component={Login} />
            <Route path="/" render={ () => <Gate /> } />
          </Switch>
        </React.Fragment>
      )
    }

    return ( 
      <React.Fragment>
        <Switch>
          {content}
          {gate}
          <Route component={URLnotFound} />
        </Switch>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    postsData: state.posts,
    postID: state.id
  };
}

export default connect(mapStateToProps)(App);


// <button onClick={()=>{
//           console.log("ok")
//           axios({
//               method: 'post',
//               url: `http://localhost:3001/checkIfLikedAlready`,
//               headers: {'Authorization': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1vbmljYS5oYXJyaXNvbkBnbWFpbC5jb20iLCJ1c2VySWQiOiI2MDk1Mjc1ZTYxMzdhMTUyZjhiZDVhODciLCJpYXQiOjE2MjA0MDk2MzIsImV4cCI6MTYyMDQxMzIzMn0.zlAkqH4OF54ojOheDalXNYXhmgxNUIkI3_iyB1kMjKc"},
//               data: {
//                 authorId: "6095275e6137a152f8bd5a87", //6095275e6137a152f8bd5a87 -> harrison
//                 blogId: "6095a80236f0f333f8e9dbd7" //6095279a6137a152f8bd5a88 -> this is my first post
//               }
//           })
//           .then((res)=>{
//               console.log("ok?")
//               console.log(res);
//           })
//           .catch(error => {
//               console.log("erororor:",error);
//           })
//         }}>like</button>