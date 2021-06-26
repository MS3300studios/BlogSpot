import React, { Component } from 'react';
import ChatMenu from './chatMenu/chatMenu';
import classes from './chat.module.css';
import MainPanel from './mainPanel/mainPanel';

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedChat: 0
        }
        this.selectChat.bind(this);
    }

    selectChat = (chatId) => {
        this.setState({selectedChat: chatId});
    }

    render() { 
        return (
            <div className={classes.container}>
                <ChatMenu selectChat={this.selectChat}/>
                <MainPanel chatId={this.state.selectedChat}/>
            </div>
        );
    }
}
 
export default Chat;