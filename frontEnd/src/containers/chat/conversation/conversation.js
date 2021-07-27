import React, { Component } from 'react';
import classes from './conversation.module.css';

import getUserData from '../../../getUserData';
import getToken from '../../../getToken';
import io from 'socket.io-client';
import { withRouter } from 'react-router';
import axios from 'axios';

import Button from '../../../components/UI/button';
import Spinner from '../../../components/UI/spinner';

class Conversation extends Component {
    constructor(props) {
        let userData = getUserData();
        let token = getToken();

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
            token: token,
            conversationId: id,
            conversationUsers: [],
            skip: 0,
            loading: true
        }
        this.messagesEnd = null;
        this.sendMessage.bind(this);
        this.fetchMessages.bind(this);
        this.socket = io('http://localhost:3001');
    }

    componentDidMount(){
        this.socket.emit('join', {name: this.state.user.name, conversationId: this.props.conversation._id })
        this.socket.on('message', message => {
            let prevMessages = this.state.messages;
            prevMessages.push(message)
            this.setState({messages: prevMessages})
        })
        this.fetchMessages();
    }   

    componentDidUpdate(prevProps, prevState){
        if(this.state.message === ""){
            this.messagesEnd.scrollIntoView({ behavior: "smooth" });
        }

        if(prevProps.conversation._id !== this.props.conversation._id){
            this.socket.emit('leaveConversation', {conversationId: prevProps.conversation._id}) //leaving old conversation
            this.socket.emit('join', {name: this.state.user.name, conversationId: this.props.conversation._id }); //joining new conversation
            this.setState({skip: 0})
            this.fetchMessages();
        }

    }

    componentWillUnmount(){
        this.socket.emit('leaveConversation', {conversationId: this.props.conversation._id})
    }

    fetchMessages = () => {
        axios({
            method: 'post',
            url: `http://localhost:3001/messages/${this.props.conversation._id}`,
            headers: {'Authorization': this.state.token},
            data: {skip: this.state.skip}
        })
        .then((res)=>{
            if(res.status===200){
                let newSkip = this.state.skip+5;
                this.setState({messages: res.data.messages, skip: newSkip, loading: false});
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    sendMessage = (e) => {
        e.preventDefault();
        if(this.state.message === "") return null
        else {
            //processing time
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


            axios({
                method: 'post',
                url: `http://localhost:3001/messages/add`,
                headers: {'Authorization': this.state.token},
                data: {
                    authorId: this.state.user._id,
                    content: this.state.message,
                    conversationId: this.props.conversation._id,
                    hour: time
                }
            })
        }
        this.setState({message: ""});
    }

    render() { 
        console.log(this.state.messages.length)
        let messages;
        if(this.state.loading === true){
            messages = <Spinner />
        }
        else if(this.state.messages.length === 0){
            messages = <h1>There are no messages in this conversation yet!</h1>
        }
        else{
            messages = this.state.messages.map((message, index) => {
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

        return (
            <>
            <div className={classes.conversationBanner}>
                <h1>{this.props.conversation.name}</h1>
            </div>
            <div className={classes.center}>
                <div className={classes.mainContainer}>
                    <div className={classes.messages}>
                        {
                            messages
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