import React, { Component } from 'react';

import classes from './conversation.module.css';
import Button from '../../../components/UI/button';
import getUserData from '../../../getUserData';
import io from 'socket.io-client';

class Conversation extends Component {
    constructor(props) {
        let userData = getUserData();

        let queryParams = new URLSearchParams(props.location.search);
        let id = queryParams.get('id'); 

        super(props);
        this.state = {
            messages: [],
            message: "",
            partner: null,
            user: userData,
            conversationId: id,
            conversationUsers: []
        }
        this.messagesEnd = null;
        this.sendMessage.bind(this);
        this.socket = io('http://localhost:3001');
    }

    componentDidMount(){
        this.socket.emit('join', { name: this.state.user.name, conversationId: this.state.conversationId })
        this.socket.emit('askForUsers', this.state.conversationId);

        this.socket.on('message', message => {
            let prevMessages = this.state.messages;
            prevMessages.push(message)
            this.setState({messages: prevMessages})
        })
        this.socket.on('usersInConversation', users => {
            this.setState({conversationUsers: users})
        })
    }   

    componentDidUpdate(){
        if(this.state.message === ""){
            this.messagesEnd.scrollIntoView({ behavior: "smooth" });
        }
    }

    componentWillUnmount(){
        this.socket.emit('leaveConversation', this.state.conversationId)
    }

    sendMessage = (e) => {
        e.preventDefault();
        if(this.state.message === "") return null
        else {
            let hour = new Date().getHours();
            if(hour<10) hour = "0 "+hour;
            let minute = new Date().getMinutes()
            if(minute<10) minute = "0 "+minute;
            let time = `${hour}:${minute}`
            this.socket.emit('sendMessage', { authorName: this.state.user.name, content: this.state.message, hour: time});
        }
        this.setState({message: ""});
    }

    render() { 
        return (
            <>
            <div className={classes.conversationBanner}>
                {this.state.conversationUsers.map((user, index) => {
                    if(index===this.state.conversationUsers.length-1) return <h1 key={index}>{user.name}</h1>
                    else return <React.Fragment key={index}><h1>{user.name}</h1><h1>+</h1></React.Fragment>
                })}
            </div>
            <div className={classes.center}>
                <div className={classes.mainContainer}>
                    <div className={classes.messages}>
                        {
                            this.state.messages.map((message, index) => {
                                let messageClassNames = [classes.message, classes.partnerColor].join(" ");
                                if(message.authorName === this.state.user.name) messageClassNames = [classes.message, classes.userLoggedColor].join(" ");
                                else if(message.authorName === "Admin") messageClassNames = [classes.message, classes.adminColor].join(" ");
                                return (
                                    <div className={classes.elongateMessage} key={index}>
                                        <div className={messageClassNames}>
                                            {
                                                message.authorName !== "Admin" ? (
                                                    <div className={classes.centerAuthorData}>
                                                        <p className={classes.author}>@{message.authorName}</p>
                                                        <p className={classes.hour}>{message.hour}</p>
                                                    </div>
                                                ) : null
                                            }
                                            <p className={classes.content}>{message.content}</p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        <div style={{visibility: "none"}} ref={el => this.messagesEnd = el}></div>
                    </div>
                    <input 
                        className={classes.input} 
                        value={this.state.message} 
                        type="text" 
                        onChange={(ev)=>this.setState({message: ev.target.value})}
                        onKeyPress={event => event.key === 'Enter' ? this.sendMessage(event) : null}
                        />
                    <Button clicked={this.sendMessage}>Send</Button>
                </div>
            </div>
            </>
        );
    }
}
 
export default Conversation;