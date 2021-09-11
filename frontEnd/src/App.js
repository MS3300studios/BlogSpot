import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import termsAndConditions from './termsAndConditions';
import './App.css';

import Test from './test';
import Menu from './components/menu/menu';
import UserProfile from './containers/userProfile/userProfile';
import Chat from './containers/chat/chat';
import FriendsList from './containers/FriendsList/FriendsList';
import PostView from './components/postView/postView';
import Gate from './containers/gate/gate';
import Login from './containers/gate/login/login';
import Registration from './containers/gate/registration/registration';
import URLnotFound from './components/URLnotfound/404';
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
    }
  }
  

  componentDidMount(){
    let session = sessionStorage.getItem('token');
    let local = localStorage.getItem('token');
    if(session!==null||local!==null){
      this.setState({isLoggedIn: true}); //user gets access to dashboard and posts views
    }  
  }

  // componentWillUnmount(){
  //   this.socket.emit('leaveConversation', {conversationId: this.props.conversation._id});
  // }

  render() {
    let content; 
    let gate;
    if(this.state.isLoggedIn){
      content = (
        <React.Fragment>
          <ScrollListener>
            <Menu />
            <Switch>
              <Route path="/test" exact render={()=><Test />} />
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

    return ( 
      <React.Fragment>
        <CookiesBanner show={this.state.cookiesBannerOpened} />
        <Switch>
          {content}
          {gate}
          <Route component={URLnotFound} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;