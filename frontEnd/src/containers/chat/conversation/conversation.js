import React, { Component } from 'react';

import classes from './conversation.module.css';
import Button from '../../../components/UI/button';
import getUserData from '../../../getUserData';
import io from 'socket.io-client';
import { withRouter } from 'react-router';

class Conversation extends Component {
    constructor(props) {
        let userData = getUserData();

        let id;
        if(props.conversation){
            id = props.conversation._id
        }
        else{
            let queryParams = new URLSearchParams(props.location.search);
            id = queryParams.get('id'); 
        }

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
        this.socket.emit('join', {name: this.state.user.name, conversationId: this.props.conversation._id })
        this.socket.on('message', message => {
            let prevMessages = this.state.messages;
            prevMessages.push(message)
            this.setState({messages: prevMessages})
        })
    }   

    componentDidUpdate(prevProps, prevState){
        if(this.state.message === ""){
            this.messagesEnd.scrollIntoView({ behavior: "smooth" });
        }

        if(prevProps.conversation._id !== this.props.conversation._id){
            this.socket.emit('leaveConversation', {conversationId: prevProps.conversation._id}) //leaving old conversation
            this.socket.emit('join', {name: this.state.user.name, conversationId: this.props.conversation._id }); //joining new conversation
        }

    }

    componentWillUnmount(){
        this.socket.emit('leaveConversation', {conversationId: this.props.conversation._id})
    }

    sendMessage = (e) => {
        e.preventDefault();
        if(this.state.message === "") return null
        else {
            let hour = new Date().getHours();
            if(hour<10) hour = "0"+hour;
            let minute = new Date().getMinutes()
            if(minute<10) minute = "0"+minute;
            let time = `${hour}:${minute}`
            this.socket.emit('sendMessage', {
                conversationId: this.props.conversation._id, 
                authorName: this.state.user.name, 
                content: this.state.message, 
                hour: time 
            });
        }
        this.setState({message: ""});
    }

    render() { 
        return (
            <>
            <div className={classes.conversationBanner}>
                <h1>{this.props.conversation.name}</h1>
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
                    <Button clicked={()=>this.socket.emit('allUsers')}>Users</Button>
                </div>
            </div>
            </>
        );
    }
}
 
export default withRouter(Conversation);