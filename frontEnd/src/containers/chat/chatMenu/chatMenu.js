import React, { Component } from 'react';
import classes from './chatMenu.module.css';
import AddingConversation from '../addingConversation/addingConversation';
import axios from 'axios';

import { BsPlusSquareFill } from 'react-icons/bs';
import getToken from '../../../getToken';
import Spinner from '../../../components/UI/spinner';

class ChatMenu extends Component {
    constructor(props) {
        super(props);

        let token = getToken();

        this.state = {
            token: token,
            loading: true,
            addingConversation: false,
            conversations: [],
        }
    }

    componentDidMount(){
        axios({
            method: 'get',
            url: `http://localhost:3001/conversations`,
            headers: {'Authorization': this.state.token},
        })
        .then((res)=>{
            if(res.status === 200){
                this.setState({conversations: res.data.conversations, loading: false});
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    render() { 
        let conversations;
        if(this.state.loading===true){
            conversations = <Spinner />;
        }
        else if(this.state.conversations.length === 0){
            conversations = (
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
        }
        else {
            conversations = this.state.conversations.map((el, index) => {
                return (
                    <div className={classes.conversation} onClick={()=>this.props.selectChat(el)} key={index}>
                        <h1>{el.name}</h1>
                        <div className={classes.participantContainer}>
                            {
                                el.participants.map((participant, index) => (
                                    <p key={index}>{participant.name}</p>
                                ))
                            }
                        </div>
                    </div>
                )
            })
        } 
        return (
            <div className={classes.chatMenu}>
                <div className={classes.conversationContainer}>
                    {conversations}
                    <div className={classes.center}>
                        <div className={classes.addConversationIconSmall} onClick={()=>this.setState({addingConversation: true})}>
                            <BsPlusSquareFill size="2em" color="#53c253"/>
                            <p>Add a conversation</p>
                        </div>
                    </div>
                </div>
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