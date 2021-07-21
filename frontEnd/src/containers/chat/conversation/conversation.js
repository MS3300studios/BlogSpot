import React, { Component } from 'react';

import classes from './conversation.module.css';
import Button from '../../../components/UI/button';
import getUserData from '../../../getUserData';

class Conversation extends Component {
    constructor(props) {
        let userData = getUserData();

        super(props);
        this.state = {
            messages: [
                { authorName: 'Jenny', content: 'I love ice cream lorem ipsum dolor sit amewwwwwwwwwwwwwwwwssssssssssswwwwwwt', hour: '23:03' },
                { authorName: 'Nick', content: 'I lovwdadwadadwadwadadadwadwwaswwwwwwt', hour: '12:03' },
            ],
            message: "",
            partner: null,
            user: userData
        }
        this.sendMessage.bind(this);
    }

    componentDidMount(){
    }   

    sendMessage = (e) => {
        e.preventDefault();
        if(this.state.message === "") return null
        else console.log(this.state.message)
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
                                return (
                                    <div className={classes.elongateMessage}>
                                        <div key={index} className={messageClassNames}>
                                            <div className={classes.centerAuthorData}>
                                                <p className={classes.author}>@{message.authorName}</p>
                                                <p className={classes.hour}>{message.hour}</p>
                                            </div>
                                            <p className={classes.content}>{message.content}</p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <input className={classes.input} value={this.state.message} type="text" onChange={(ev)=>this.setState({message: ev.target.value})}/>
                    <Button clicked={this.sendMessage}>Send</Button>
                </div>
            </div>
        );
    }
}
 
export default Conversation;