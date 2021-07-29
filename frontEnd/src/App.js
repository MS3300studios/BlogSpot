import React, { Component } from 'react';
import { Route, Switch} from 'react-router-dom';
import { connect } from 'react-redux';
// import io from 'socket.io-client';

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
import Conversation from './containers/chat/conversation/conversation';
import AddingConversation from './containers/chat/addingConversation/addingConversation';
import JoiningConversation from './containers/chat/addingConversation/joiningConversation';

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
          <ScrollListener>
            <Menu />
            <Switch>
              <Route path="/conversation/" component={Conversation} />
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