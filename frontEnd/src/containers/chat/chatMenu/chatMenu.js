import React, { Component } from 'react';
import classes from './chatMenu.module.css';
import SelectPanel from '../addingConversation/selectPanel';
import axios from 'axios';

import { BsPlusSquareFill } from 'react-icons/bs';
import getToken from '../../../getToken';
import Spinner from '../../../components/UI/spinner';
import SearchBar from '../../../components/UI/searchBar';
import ConversationListItem from './conversationListItem';

class ChatMenu extends Component {
    constructor(props) {
        super(props);

        let token = getToken();

        this.state = {
            token: token,
            loading: true,
            addingConversation: false,
            conversations: [],
            filterIn: "",
            filterBy: ""
        }

        this.filterConversations.bind(this);
        this.filterSearchHandler.bind(this);
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

    filterSearchHandler = (option, string) => {
        if(string===""){
            this.setState({filterIn: option});
        }
        else{
            this.setState({filterIn: option, filterBy: string});
        }
    }

    filterConversations = () => {
        let conversationsJSX = []; //temporary array of all jsx friends, to be filtered and converted to conversationsRdy
        let conversationsRdy = [];
    
        conversationsJSX = this.state.conversations.map((el, index) => {
            return (
                <ConversationListItem 
                    selectChat={this.props.selectChat}
                    el={el}
                    key={index}
                />
            )
        });

        if(this.state.filterBy===""){
            conversationsRdy = conversationsJSX;
        }
        else{
            switch(this.state.filterIn){
                case "name":
                    conversationsRdy = conversationsJSX.filter((conversation)=>{
                        if(conversation.props.el.name.includes(this.state.filterBy)){
                            return true;
                        }
                        else return false;
                    });
                    break;
                case "id":
                    conversationsRdy = conversationsJSX.filter((conversation)=>{
                        if(conversation.props.el._id.includes(this.state.filterBy)){
                            return true;
                        }
                        else return false;
                    }); 
                    break;
                default: conversationsRdy = conversationsJSX;
                    break;
            }
        }

        if(conversationsRdy.length === 0){
            conversationsRdy = (
                <h1>No conversation with this {this.state.filterIn} was found!</h1>
            );
        }

        return conversationsRdy;
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
            conversations = this.filterConversations();
        } 
        return (
            <div className={classes.chatMenu}>
                <div className={classes.conversationContainer}>
                    <SearchBar 
                        placeholder="search conversations in..."
                        clicked={this.filterSearchHandler}
                        selectedOption={this.filterSearchHandler}
                        resetFilter={()=>{this.setState({filterIn: "", filterBy: ""})}}
                        selectValues={["name", "id"]}
                    />
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
                    <SelectPanel 
                        closeAddConversation={()=>this.setState({addingConversation: false})}
                    /> 
                    : null
                }
            </div>
        );
    }
}
 
export default ChatMenu;