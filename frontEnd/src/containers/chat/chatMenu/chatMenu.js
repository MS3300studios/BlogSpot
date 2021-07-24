import React, { Component } from 'react';
import classes from './chatMenu.module.css';
import AddingConversation from '../addingConversation/addingConversation';

import { BsPlusSquareFill } from 'react-icons/bs';

class ChatMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addingConversation: false,
            converstaions: [],
        }
    }

    componentDidMount(){
        
    }

    render() { 
        let conversations;
        if(this.state.converstaions.length === 0) conversations = (
            <div className={classes.noConversationsContainer}>
                <div>
                    <h1>You don't have any conversations yet!</h1>
                    <div className={classes.addConversationIcon} onClick={()=>this.setState({addingConversation: true})}>
                        <BsPlusSquareFill size="2em" color="#53c253"/>
                        <p>Add a conversation</p>
                    </div>
                </div>
            </div>
        )
        else {
            conversations = this.state.converstaions.map((el, index) => {
                return (
                    <div className={classes.converstaion} onClick={()=>this.props.selectChat(index)} key={index}>
                        <h1>{el.user}</h1>
                        <p>{el.message}</p>
                    </div>
                )
            })
        } 
        return (
            <div className={classes.chatMenu}>
                {conversations}
                {
                    this.state.addingConversation ? 
                    <AddingConversation 
                        closeAddConversation={()=>this.setState({addingConversation: false})}
                    /> 
                    : null
                }
            </div>
        );
    }
}
 
export default ChatMenu;







/* 
    {
        user: "Monica",
        message: "Hello, how are you doing?"
    },
    {
        user: "Andrew",
        message: "Sup my man!"
    },
    {
        user: "Mike",
        message: "I like gherkins"
    },
    {
        user: "Kate",
        message: "I love react"
    }
*/