import React, { Component } from 'react';
import axios from 'axios';

import classes from './JoiningConversation.module.css';
import classes2 from './addingConversation.module.css';
import classes3 from '../../FriendsList/addUser/addUser.module.css';

import {AiOutlineSearch} from 'react-icons/ai';
import { Redirect } from 'react-router-dom';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import SearchBar from '../../../components/UI/searchBar';
import Spinner from '../../../components/UI/spinner';
import Button from '../../../components/UI/button';
import Flash from '../../../components/UI/flash';
import getToken from '../../../getToken';
import getUserData from '../../../getUserData';
import ConversationListItem from '../chatMenu/conversationListItem';

class JoiningConversation extends Component {
    constructor(props) {
        super(props);

        let token = getToken();
        let userData = getUserData();

        this.state = {
            token: token,
            userData: userData,
            redirectChat: false,
            filterIn: "name",
            filterBy: "",
            loading: false,
            flashMessage: "",
            flashNotClosed: true,
            conversations: [],
            hasSearched: false
        }
        this.filterSearchHandler.bind(this);
        this.searchNewConversation.bind(this);
        this.join.bind(this);
        this.flash.bind(this);
    }

    flash = (message) => {
        this.setState({flashMessage: message});
        
        setTimeout(()=>{
            this.setState({flashNotClosed: false});
        }, 2000)

        setTimeout(()=>{
            this.setState({flashMessage: ""});
        }, 3000);
    
        setTimeout(()=>{
            this.setState({flashNotClosed: true});
        }, 3000);
    }

    filterSearchHandler = (option, string) => {
        if(string===""){
            this.setState({filterIn: option});
        }
        else{
            this.setState({filterIn: option, filterBy: string});
        }
    }

    searchNewConversation = () => {
        if(this.state.filterBy === ""){
            this.flash('you need to write the name or Id of the conversation in the searchbar');
        }
        else{
            this.setState({loading: true, hasSearched: true}, () => {
                if(this.state.filterIn === "name"){
                    axios({
                        method: 'post',
                        url: `http://localhost:3001/conversations/search`,
                        headers: {'Authorization': this.state.token},
                        data: {
                            searchString: this.state.filterBy
                        }
                    })
                    .then((res)=>{
                        if(res.status===200){
                            this.setState({loading: false, conversations: res.data.conversations})
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
                }
                else if(this.state.filterIn === "id"){
                    axios({
                        method: 'get',
                        url: `http://localhost:3001/conversation/${this.state.filterBy}`,
                        headers: {'Authorization': this.state.token},
                    })
                    .then((res)=>{
                        if(res.status===200){
                            if(res.data.error){
                                this.setState({loading: false}, ()=>{
                                    this.flash(res.data.error)
                                })
                            }
                            else{
                                let newConversations = [res.data.conversation];
                                this.setState({loading: false, conversations: newConversations})
                            }
                        }
                    })
                    .catch(error => {
                        this.flash(error.message)
                    })
                }
            })
        }
    }

    join = (id) => {
        axios({
            method: 'post',
            url: `http://localhost:3001/conversation/join/${id}`,
            headers: {'Authorization': this.state.token},
            data: { name: this.state.userData.name }
        })
        .then((res)=>{
            if(res.status===200){
                this.flash("you joined the conversation!")
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    render() { 
        let flash = null;
        if(this.state.flashMessage && this.state.flashNotClosed){
            flash = <Flash>{this.state.flashMessage}</Flash>
        }
        else if(this.state.flashMessage && this.state.flashNotClosed === false){
            flash = <Flash close>{this.state.flashMessage}</Flash>
        }

        let conversations = null; 
        if(this.state.loading === true) conversations = <Spinner darkgreen/>
        else{
            if(this.state.conversations.length === 0){
                conversations = (
                    <div className={classes.center}>
                        <h1 className={classes.infoHeader}>No conversations with the matching {this.state.filterIn} were found</h1>
                    </div>
                )
            }
            else{
                conversations = this.state.conversations.map((conversation, index) => (
                    <ConversationListItem 
                        key={index}
                        el={conversation}
                        join={this.join}
                    />
                ))
            }
        }

        return (
            <div className={classes2.backDrop}>
                <div className={classes2.addUserContainer}>
                    <div className={classes2.closeIcon} onClick={()=>this.setState({redirectChat: true})}>
                        <AiOutlineCloseCircle size="2em" color="#0a42a4" />
                    </div>
                    <div className={classes.searchingContainer}>
                        <SearchBar 
                            placeholder="search conversations in..."
                            clicked={this.filterSearchHandler}
                            selectedOption={this.filterSearchHandler}
                            resetFilter={()=>{this.setState({filterIn: "name", filterBy: "", hasSearched: false, loading: false})}}
                            selectValues={["name", "id"]}
                        />
                        <div className={classes3.buttonMinifier}>
                            <Button className={classes3.SearchBtnAddUser}>
                                {
                                    this.state.loading ? <Spinner darkgreen small /> : (
                                        <div 
                                            style={{display: "flex", justifyContent:"center", alignItems: "center"}}
                                            onClick={this.searchNewConversation}
                                        >
                                            search<AiOutlineSearch size="2em" color="#0a42a4" />
                                        </div>
                                    )
                                }
                            </Button>
                        </div>
                    </div>
                    <div>
                        {
                            this.state.hasSearched ? (
                                <div>
                                    {conversations}
                                </div>
                            ) : (
                                <div className={classes.center}>
                                    <h1 className={classes.infoHeader}>write something in the searchbar and click search</h1>
                                </div>
                            ) 
                        }
                    </div>
                </div>
            {this.state.redirectChat ? <Redirect to="/chat/" /> : null}
            {flash}
        </div>
        );
    }
}
 
export default JoiningConversation;