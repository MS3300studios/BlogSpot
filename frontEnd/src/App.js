import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import axios from 'axios';

import termsAndConditions from './termsAndConditions';
import './App.css';
import { MAIN_URI } from './config';

import Menu from './components/menu/menu';
import UserProfile from './containers/userProfile/userProfile';
import Chat from './containers/chat/chat';
import FriendsList from './containers/FriendsList/FriendsList';
import PostView from './components/postView/postView';
import Gate from './containers/gate/gate';
import Login from './containers/gate/login/login';
import Registration from './containers/gate/registration/registration';
import CookiesBanner from './components/UI/cookiesBanner';

import PhotoForm from './containers/PhotoForm/photoForm';
import YourActivities from './components/activites/youractivities';
import SocialBoard from './containers/socialBoard/socialBoard';
import ScrollListener from './components/scrollListener/scrollListener';
import EditUserProfile from './containers/userProfile/editUserProfile/editUserProfile';
import ConversationContainer from './containers/chat/conversation/conversationContainer/conversationContainer';
import AddingConversation from './containers/chat/addingConversation/addingConversation';
import JoiningConversation from './containers/chat/addingConversation/joiningConversation';
import SinglePhotoHOC from './containers/photoView/singlePhotoHOC/singlePhotoHOC';
import Settings from './components/settings/settings';
import AddPost from './components/AddPost/AddPost';
import getColor from './getColor';
import Reporting from './components/reporting/reporting';
import Reports from './components/reports/reports';
import Banning from './components/banning/banning';
import Footer from './components/footer/footer';

class App extends Component {
  constructor(props){
    super(props);

    let showCookies = localStorage.getItem('showCookies');
    let setConstrVal; 
    if(showCookies === "true"){
      setConstrVal = true;
    }
    else if(showCookies === "false"){
      setConstrVal = false;
    }
    if(showCookies === null){
      localStorage.setItem('showCookies', true);
      setConstrVal = true;
    }

    this.state = {
      isLoggedIn: false,
      cookiesBannerOpened: setConstrVal,
      isBanned: false,
      checkingIfBanned: false
    }
  }
  

  componentDidMount(){
    const session = sessionStorage.getItem('token');
    const local = localStorage.getItem('token');
    if(session!==null||local!==null){
      let id;
      if(session !== null){
        id = JSON.parse(sessionStorage.getItem('userData'))._id
      }
      else if(local !== null){
        id = JSON.parse(localStorage.getItem('userData'))._id
      }

      this.setState({checkingIfBanned: true}, ()=>{
        axios({
          method: 'get',
          url: `${MAIN_URI}/isBanned/${id}`
        })
        .then((res)=>{
          if(res.data.isBanned === true){
            this.setState({isLoggedIn: false, isBanned: true, checkingIfBanned: false});
          }
          else this.setState({isLoggedIn: true, checkingIfBanned: false});
        })
        .catch(error => {
          console.log(error);
        })
      })
    }  
    
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
              <Route path="/reports" exact component={Reports} />
              <Route path="/banning" exact component={Banning} />
              <Route path="/addPost" exact component={AddPost} />
              <Route path="/conversation/" component={ConversationContainer} />
              <Route path="/addConversation/" component={AddingConversation} />
              <Route path="/joinConversation/" component={JoiningConversation} />
              <Route path="/editProfile/" exact component={EditUserProfile} />
              <Route path="/addPhoto/" exact component={PhotoForm} />
              <Route path="/settings/" exact component={Settings} />
              <Route path="/user/activity/" exact component={YourActivities} />
              <Route path="/chat/" component={Chat} />
              <Route path="/post/" component={PostView} />
              <Route path="/photo/" component={SinglePhotoHOC} />
              <Route path="/user/profile/" component={UserProfile} />
              <Route path="/user/friends/" component={FriendsList} />
              <Route path="/termsAndConditions" exact component={termsAndConditions} />
              <Route path="/reporting" component={Reporting} />
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
            <Route path="/" render={()=><Gate isBanned={this.state.isBanned} />} />
          </Switch>
        </React.Fragment>
      )
    }

    const colorScheme = getColor();
    let background = { backgroundColor: "seagreen"};
    if(colorScheme === "blue"){
      background = { backgroundColor: "hsl(201deg 98% 32%)"};
    }

    const bannedHeaderStyle = {
      color: "white",
      marginLeft: "20px",
      fontWeight: "550",
      fontSize: "20px"
    }

    return ( 
      <HashRouter>
        <div style={{...background, width: "100%", height: "100%", position: "fixed", top: "0", left: "0", overflow: "auto"}}>
          { this.state.isBanned ? <p style={bannedHeaderStyle}>This account has been banned from BragSpot, contact the administrator to reverse this process</p> : null}
          <CookiesBanner show={this.state.cookiesBannerOpened} />
          {content}
          {gate}
          <Footer />
        </div>
      </HashRouter>
    );
  }
}

export default App; 