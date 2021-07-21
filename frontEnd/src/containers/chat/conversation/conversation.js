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
                { authorName: 'Nick', content: 'I love ice cream', hour: '23:03' }
            ],
            message: "",
            partner: null,
            user: userData
        }
        this.sendMessage.bind(this);
    }

    componentDidMount(){
        console.log(this.state.user)
    }   

    sendMessage = () => {

    }

    render() { 
        return (
            <div className={classes.mainContainer}>
                <div className={classes.messages}>
                    {
                        this.state.messages.map((message, index) => {
                            return (
                                <div key={index} className={classes.message}>
                                    <p>{message.authorName}</p>
                                    <p>{message.content}</p>
                                    <p>{message.hour}</p>
                                </div>
                            )
                        })
                    }
                </div>
                <input type="text" onChange={()=>this.setState()}/>
                <Button>Send</Button>
            </div>
        );
    }
}
 
export default Conversation;