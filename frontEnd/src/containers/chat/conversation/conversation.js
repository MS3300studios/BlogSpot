import React, { Component } from 'react';

import classes from './conversation.module.css';
import Button from '../../../components/UI/button';
import getUserData from '../../../getUserData';
import io from 'socket.io-client';

let socket;

class Conversation extends Component {
    constructor(props) {
        let userData = getUserData();

        super(props);
        this.state = {
            messages: [
                { authorName: 'Jenny', content: 'I love ice cream lorem ipsum dolor sit amewwwwwwwwwwwwwwwwssssssssssswwwwwwt', hour: '23:03' },
                { authorName: 'Nick', content: 'I lovwdadwadadwadwadadadwadwwaswwwwwwt', hour: '12:03' },
                { authorName: 'Admin', content: 'User joined the chat', hour: '12:03' },
            ],
            message: "",
            partner: null,
            user: userData,
        }
        this.messagesEnd = null;
        this.sendMessage.bind(this);
    }

    componentDidMount(){
        // socket = io('http://localhost:3001');
        // socket.emit('join', { name: "nick"})
        // socket.on('message', message => {
        //     let prevMessages = this.state.messages;
        //     prevMessages.push(message)
        //     this.setState({messages: prevMessages})
        // })

    }   

    componentDidUpdate(){
        if(this.state.message === ""){
            this.messagesEnd.scrollIntoView({ behavior: "smooth" });
        }
    }



    sendMessage = (e) => {
        e.preventDefault();
        if(this.state.message === "") return null
        else {
            let prevMessages = this.state.messages;
            prevMessages.push({authorName: 'Jenny', content: this.state.message, hour: '12:03'})
            this.setState({messages: prevMessages})
            //socket.emit('sendMessage', { authorName: this.state.user.name, content: this.state.message, hour: '00:10' })
        }
        this.setState({message: ""});
    }

    render() { 
        return (
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
        );
    }
}
 
export default Conversation;