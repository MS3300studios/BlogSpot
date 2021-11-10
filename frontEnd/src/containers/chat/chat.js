import React, { Component } from 'react';
import ChatMenu from './chatMenu/chatMenu';
import classes from './chat.module.css';
import Conversation from './conversation/conversation';

import BlockedUserPrevent from './conversation/conversationBlockedPreventWrapper';
import getMobile from '../../getMobile';

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedConversation: null
        }
        this.selectConversation.bind(this);
        this.isMobile = getMobile();
    }

    selectConversation = (conversation) => {
        this.setState({selectedConversation: conversation});
    }

    render() { 
        return (
            <>
                {
                    this.isMobile ? (
                        <div>
                            <ChatMenu isMobile/>
                        </div>
                    ) : (
                        <div className={classes.container}>
                        <ChatMenu selectChat={this.selectConversation}/>
                        {
                            this.state.selectedConversation ? (
                                <div className={classes.mainPanel}>
                                    {
                                        this.state.selectedConversation.conversationType === "group" ? 
                                            <Conversation conversation={this.state.selectedConversation}/> :
                                            <BlockedUserPrevent selectedConversation={this.state.selectedConversation}/>
                                    }
                                </div>
                            ) : (
                                <div className={classes.mainPanel}>
                                    <div className={classes.centerHeader}>
                                        <h1 className={classes.noConversationSelectedHeader}>Select a conversation from the left side panel</h1>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    )
                }
            </>
        );
    }
}
 
export default Chat;