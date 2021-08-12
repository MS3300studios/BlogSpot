import React, { Component } from 'react';
import { Route, Switch} from 'react-router-dom';
import { connect } from 'react-redux';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import io from 'socket.io-client';

//for debug only:
import axios from 'axios';
import getToken from './getToken';
import getUserData from './getUserData';
//end for debug only

import termsAndConditions from './termsAndConditions';
import './App.css';

import Menu from './components/menu/menu';
import UserProfile from './containers/userProfile/userProfile';
import Chat from './containers/chat/chat';
import FriendsList from './containers/FriendsList/FriendsList';
import PostView from './components/postView/postView';
import Gate from './containers/gate/gate';
import Login from './containers/gate/login/login';
import Registration from './containers/gate/registration/registration';
import URLnotFound from './components/URLnotfound/404';

import PhotoForm from './containers/PhotoForm/photoForm';
import PhotoView from './containers/photoView/photoView';
import YourActivities from './components/activites/youractivities';
import SocialBoard from './containers/socialBoard/socialBoard';
import ScrollListener from './components/scrollListener/scrollListener';
import EditUserProfile from './containers/userProfile/editUserProfile/editUserProfile';
import ConversationContainer from './containers/chat/conversation/conversationContainer/conversationContainer';
import AddingConversation from './containers/chat/addingConversation/addingConversation';
import JoiningConversation from './containers/chat/addingConversation/joiningConversation';

class App extends Component {
  constructor(props){
    super(props);

    let showCookies = localStorage.getItem('showCookies');
    if(showCookies === null){
      localStorage.setItem('showCookies', true);
      showCookies = true;
    }

    this.state = {
      isLoggedIn: false,
      cookiesBannerOpened: showCookies,
    }

    this.socket = io('http://localhost:3001');
    this.closeBanner.bind(this);
  }
  

  componentDidMount(){
    let session = sessionStorage.getItem('token');
    let local = localStorage.getItem('token');
    if(session!==null||local!==null){
      this.setState({isLoggedIn: true}); //user gets access to dashboard and posts views
    }
    
  }

  closeBanner = () => {
    this.setState({cookiesBannerOpened: false}, () => {
      localStorage.setItem('showCookies', false);
    })
  }

  render() {
    let content; 
    let gate;
    if(this.state.isLoggedIn){
      content = (
        <React.Fragment>
          <ScrollListener>
            <Menu />
            <Switch>
              <Route path="/conversation/" component={ConversationContainer} />
              <Route path="/addConversation/" component={AddingConversation} />
              <Route path="/joinConversation/" component={JoiningConversation} />
              <Route path="/editProfile" exact component={EditUserProfile} />
              <Route path="/photo/view" exact component={PhotoView} />
              <Route path="/photo/add" exact component={PhotoForm} />
              <Route path="/user/activity" exact component={YourActivities} />
              <Route path="/chat/" component={Chat} />
              <Route path="/post/" component={PostView} />
              <Route path="/user/profile/" component={UserProfile} />
              <Route path="/user/friends/" component={FriendsList} />
              <Route path="/" render={()=><SocialBoard />} />
            </Switch>
          </ScrollListener>
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
            <Route path="/termsAndConditions" exact component={termsAndConditions} />
            <Route path="/" render={ () => <Gate /> } />
          </Switch>
        </React.Fragment>
      )
    }

    let cookiesBanner = null;
    if(this.state.cookiesBannerOpened === true){
      cookiesBanner = (
        <div className="cookiesBanner">
          <p>This website utilizes cookies to function properly. 
            By closing this banner you consent to cookies being stored on your computer. 
            If you don't agree with this, leave this site now.</p>
            <div className="closeCookiesBannerIcon" onClick={this.closeBanner}>
              <AiOutlineCloseCircle size="2em" color="#0a42a4" />
            </div>
        </div>
      )
    } 

    return ( 
      <React.Fragment>
        <Switch>
          {content}
          {gate}
          <Route component={URLnotFound} />
        </Switch>
        {cookiesBanner}
        <button onClick={()=>{
            this.socket.emit("logOnlineUsers");
        }} style={
          {
            backgroundColor: "black",
            cursor: "pointer",
            position: "fixed",
            top: "10px",
            left: "400px"
          }
        }>check users on server</button> 
        <button onClick={()=>{
            let token = getToken();
            axios({
                method: 'get',
                url: `http://localhost:3001/lastReadMessage/60fc2ad143515d2e8cc44be0`,
                headers: {'Authorization': token}
            })
            .then((res)=>{
                if(res.status===200){
                    console.log(res.data);
                    return;
                }
            })
            .catch(error => {
                console.log(error);
            })
        }} style={
          {
            backgroundColor: "black",
            cursor: "pointer",
            position: "fixed",
            top: "10px",
            left: "600px"
          }
        }>test get lastReadMessage</button> 
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