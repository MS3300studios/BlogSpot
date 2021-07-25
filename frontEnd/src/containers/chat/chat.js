import React, { Component } from 'react';
import ChatMenu from './chatMenu/chatMenu';
import classes from './chat.module.css';
import Conversation from './conversation/conversation';

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedConversation: null
        }
        this.selectConversation.bind(this);
    }

    selectConversation = (conversation) => {
        this.setState({selectedConversation: conversation});
    }

    render() { 
        return (
            <div className={classes.container}>
                <ChatMenu selectChat={this.selectConversation}/>
                <div className={classes.mainPanel}>
                    <Conversation conversation={this.state.selectedConversation}/>
                </div>
            </div>
        );
    }
}
 
export default Chat;