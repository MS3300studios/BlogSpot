import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import './App.css';

import Menu from './components/menu/menu';
import Dashboard from './containers/dashboard/dashboard';
import PostView from './components/postView/postView';
import Gate from './containers/gate/gate';
import Login from './containers/gate/login/login';
import Registration from './containers/gate/registration/registration';
import URLnotFound from './components/URLnotfound/404';

class App extends Component {
  state = {
    isLoggedIn: false
  }

  componentDidMount(){
    let session = sessionStorage.getItem('token');
    let local = localStorage.getItem('token');
    if(session!==null||local!==null){
      this.setState({isLoggedIn: true}); //user gets access to dashboard and posts views
    }
    //check every 5 minutes if the token is still present
    // setInterval(()=>{
    //   console.log('checking if token still exists')
    //   let session = sessionStorage.getItem('token');
    //   let local = localStorage.getItem('token');
    //   if(session!==null||local!==null){
    //     this.setState({isLoggedIn: true}); //user gets access to dashboard and posts views
    //   }
    //   else{
    //     this.setState({isLoggedIn: false});
    //   }
    // },2000);
  }

  render() {
    let content; 
    let gate;
    if(this.state.isLoggedIn){
      content = (
        <React.Fragment>
          <Menu />
          <Route path="/" render={()=><Dashboard />} />
          <Route path="/post" component={PostView} />
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

