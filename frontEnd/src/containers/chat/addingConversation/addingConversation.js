import React, { Component } from 'react';

import { AiOutlineCloseCircle } from 'react-icons/ai';
import FriendsListItem from '../../FriendsList/friendsListItem';
import { MAIN_URI } from '../../../config';


import axios from 'axios';
import getUserData from '../../../getUserData';
import getToken from '../../../getToken';
import getColor from '../../../getColor';
import Spinner from '../../../components/UI/spinner';
import SearchBar from '../../../components/UI/searchBar';
import Button from '../../../components/UI/button';

import Flash from '../../../components/UI/flash';
import { Redirect } from 'react-router-dom';

import classes from './addingConversation.module.css';
import greenClasses from './addingGreen.module.css';
import blueClasses from './addingBlue.module.css';
import getMobile from '../../../getMobile';

const colorScheme = getColor();
let colorClasses = greenClasses;
if(colorScheme === "blue"){
    colorClasses = blueClasses;
}

class AddingConversation extends Component {
    constructor(props) {
        super(props);

        let userData = getUserData();
        let token = getToken();

        this.state = {
            token: token,
            userData: userData,
            conversationName: "",
            selectedFriends: [],
            selectAll: false,
            nameComplete: false,
            loading: true,
            friends: [],
            flashMessage: "",
            flashNotClosed: true,
            filterBy: "",
            filterIn: "",
            redirect: false,
            redirectId: "",
            hideSelectAll: false
        }

        this.flash.bind(this);
        this.filterSearchHandler.bind(this);
        this.filterFriends.bind(this);
        this.addFriendSelect.bind(this);
        this.sendConversation.bind(this);
        this.checkFriendsParticipants.bind(this);
        this.selectAllFriends.bind(this);

        this.isMobile = getMobile();
    }

    componentDidMount(){
        let id = this.state.userData._id;
        axios({
            method: 'get',
            url: `${MAIN_URI}/friends/all/${id}`,
            headers: {'Authorization': this.state.token},
        })
        .then((res)=>{
            if(res.status===200){   
                if(this.props.addingUsers){
                    this.checkFriendsParticipants(true, res.data.friends);
                }             
                else{
                    this.setState({loading: false, friends: res.data.friends});
                }
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    selectAllFriends = () => {
        this.setState(prevState => {
            let temp = prevState.friends.map(friend => ({name: friend.name, userId: friend._id}));
            if(prevState.selectAll === true) temp = [];
            return(
                {selectAll: !prevState.selectAll, selectedFriends: temp}
            )
        })
    }

    sendConversation = () => {
        if(this.props.addingUsers){
            if(this.state.selectedFriends.length >= 1){
                axios({
                    method: 'post',
                    url: `${MAIN_URI}/conversation/edit/participants/add/${this.props.conversationId}`,
                    headers: {'Authorization': this.state.token},
                    data: {
                        participantsToAdd: this.state.selectedFriends
                    }
                })
                .then((res)=>{
                    if(res.status===200){
                        window.location.reload();
                    }
                    else{
                        this.flash('there has been some kind of an error. Please reload the page');
                    }
                })
                .catch(error => {
                    console.log(error);
                })
            }
            else if(this.state.selectedFriends.length === 0){
                this.flash("you need to select at least one user!");
            }
        }
        else{
            if(this.state.selectedFriends.length >= 1 && this.state.conversationName !== ""){
                //adding the user himself to the conversation participants array
                let participants = this.state.selectedFriends;
                participants.push({
                    name: this.state.userData.name,
                    userId: this.state.userData._id
                })
    
                axios({
                    method: 'post',
                    url: `${MAIN_URI}/conversations/new`,
                    headers: {'Authorization': this.state.token},
                    data: {
                        participants: participants,
                        name: this.state.conversationName
                    }
                })
                .then((res)=>{
                    if(res.status===201){
                        window.location.reload();
                        // this.setState({
                        //     redirect: true,
                        //     redirectId: res.data.conversation._id
                        // });
                        return;
                    }
                })
                .catch(error => {
                    console.log(error);
                })
            }
            else if(this.state.conversationName === ""){
                this.flash("the conversation has to have a name!");
            }
            else if(this.state.selectedFriends.length === 0){
                this.flash("you need to select at least one user!");
            }
        }
    }

    filterSearchHandler = (option, string) => {
        if(string===""){
            this.setState({filterIn: option});
        }
        else{
            this.setState({filterIn: option, filterBy: string});
        }
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

    addFriendSelect = (friend, adding) => {
        let temp = this.state.selectedFriends;
        if(adding === true) temp.push(friend);
        else if(adding === false){
            let temp2 = temp.filter(user => user.userId !== friend.userId)
            temp = temp2;
        }
        this.setState({selectedFriends: temp});
    }

    checkFriendsParticipants = (manipulateState, allfriends) => {
        let newFriends = [];

        for(let i=0; i<allfriends.length; i++){
            let flag = false;
            for(let j=0; j<this.props.participants.length; j++){
                if(allfriends[i]._id === this.props.participants[j].userId) flag = true;
            }
            if(flag === false) newFriends.push(allfriends[i]);
        }

        if(manipulateState === true){
            let hide = newFriends.length === 0;
            this.setState({hideSelectAll: hide, friends: newFriends, loading: false});
        }
        else return newFriends;
    }

    filterFriends = (filterIn, filterBy) => {
        let friendsJSX = []; //temporary array of all jsx friends, to be filtered and converted to friendsRdy
        let friendsRdy = [];
        
        if(this.props.addingUsers === true){
            friendsJSX = this.state.friends.map((friend, index)=>{
                return (
                    <FriendsListItem 
                        hideOnlineIcon
                        friendNumber={index}
                        id={friend._id} 
                        name={friend.name}
                        nickname={friend.nickname}
                        surname={friend.surname}
                        photo={friend.photo}
                        friendSelect
                        selectAll={this.state.selectAll}
                        friendWasSelected={this.addFriendSelect}
                    />
                )
            });
        }
        else{
            friendsJSX = this.state.friends.map((friend, index)=>{
                if(friend === null) return null
                return (
                    <FriendsListItem 
                        hideOnlineIcon
                        friendNumber={index}
                        id={friend._id} 
                        name={friend.name}
                        nickname={friend.nickname}
                        surname={friend.surname}
                        photo={friend.photo}
                        friendSelect
                        selectAll={this.state.selectAll}
                        friendWasSelected={this.addFriendSelect}
                    />
                )
            });
        }

        if(filterBy==="" || filterIn===""){
            friendsRdy = friendsJSX;
        }
        else{
            switch(filterIn){
                case "nickname":
                    friendsRdy = friendsJSX.filter((friend)=>{
                        if(friend.props.nickname.includes(filterBy)){
                            return true;
                        }
                        else return false;
                    });
                    break;
                case "name":
                    friendsRdy = friendsJSX.filter((friend)=>{
                        if(friend.props.name.includes(filterBy)){
                            return true;
                        }
                        else return false;
                    }); 
                    break;
                case "surname": 
                    friendsRdy = friendsJSX.filter((friend)=>{
                        if(friend.props.surname.includes(filterBy)){
                            return true;
                        }
                        else return false;
                    })
                    break;
                default: friendsRdy = friendsJSX;
                    break;
            } 
        }

        let wrappedFriends = <h1>You don't have any friends to add to this conversation</h1>;

        if(friendsRdy.length === 0){
            friendsRdy = (
                <React.Fragment>
                    <h1>Ooops, you don't have a friend with that {this.state.filterIn}!</h1>
                    <hr />
                    <p>Click here to add new friends: <Button clicked={()=>this.setState({showAddFriendCoponent: true})}>Search users</Button></p>
                </React.Fragment>
            );
        }
        else{
            wrappedFriends = friendsRdy.map((friend, index) => {
                return (
                    <div className={colorClasses.friendsListItemOutline} key={index}>
                        {friend}
                    </div>
                )
            })
        }

        return wrappedFriends;
    } 

    render() { 
        let flash = null;
        if(this.state.flashMessage && this.state.flashNotClosed){
            flash = <Flash>{this.state.flashMessage}</Flash>
        }
        else if(this.state.flashMessage && this.state.flashNotClosed === false){
            flash = <Flash close>{this.state.flashMessage}</Flash>
        }

        let friends;
        if(this.state.friends.length===0){
            friends = (
                <div className={classes.nameListContainer}>
                    <h1>There are no more people to add to this conversation. If you want to add someone it has to be a friend.</h1>
                </div>
            );
        }
        else{
            friends = (
                <div className={classes.nameListContainer}>
                    {this.filterFriends(this.state.filterIn, this.state.filterBy)}
                </div>
            );
        }

        return (
            <div className={classes.backDrop}>
                {
                    this.state.loading ? <Spinner /> : (
                        <div className={colorClasses.addUserContainer} style={this.isMobile ? {width: "85%", height: "80%", margin: "unset", overflow: "auto"} : null}>
                            <div className={classes.closeIcon} onClick={()=>{
                                if(this.props.closeWindow) this.props.closeWindow();
                                else this.setState({redirectChat: true})
                            }}>
                                <AiOutlineCloseCircle size="2em" color="#0a42a4" />
                            </div>

                            <div>
                                {
                                    this.props.addingUsers ? (
                                        <div className={classes.floatRightNextButton}>
                                            <button  
                                                className={classes.nextBtn}
                                                onClick={this.sendConversation}
                                            >
                                                CONTINUE
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                        {
                                            this.isMobile ? (
                                                <>
                                                <div>
                                                    <button  
                                                        className={classes.nextBtn}
                                                        onClick={this.sendConversation}
                                                    >
                                                        ADD CONVERSATION
                                                    </button>
                                                    <h1 style={{color: "white", fontSize: "20px", fontWeight: "550"}}>Give the conversation a name:</h1>
                                                    <input 
                                                        className={classes.Input}
                                                        style={{
                                                            minWidth: "unset",
                                                            marginBottom: "10px"
                                                        }}
                                                        type="text" 
                                                        onChange={(e)=>this.setState({conversationName: e.target.value})}
                                                    />
                                                </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className={classes.centerInput}>
                                                        <h1>Give the conversation a name:</h1>
                                                        <div>
                                                            <input 
                                                                className={classes.Input}
                                                                type="text" 
                                                                onChange={(e)=>this.setState({conversationName: e.target.value})}
                                                            />
                                                        </div>
                                                        <button  
                                                            className={classes.nextBtn}
                                                            onClick={this.sendConversation}
                                                        >
                                                            ADD CONVERSATION
                                                        </button>
                                                    </div>
                                                </>
                                            )
                                        }
                                        </>
                                    )
                                }

                                <div className={classes.addingUsers}>
                                    {
                                        this.isMobile ? (
                                            <div style={{marginLeft: "15%"}}>
                                                <h1 style={{fontSize: "20px", fontWeight: "550"}}>Add users to the conversation: </h1>
                                                <SearchBar 
                                                    placeholder="search friends in..."
                                                    clicked={this.filterSearchHandler}
                                                    resetFilter={()=>{this.setState({filterIn: "", filterBy: ""})}}
                                                    selectValues={["nickname", "name", "surname", "id"]}
                                                    selectedOption={this.filterSearchHandler}
                                                />
                                            </div>
                                        ) : (
                                            <>
                                            <h1>Add users to the conversation: </h1>
                                            <SearchBar 
                                                placeholder="search friends in..."
                                                clicked={this.filterSearchHandler}
                                                resetFilter={()=>{this.setState({filterIn: "", filterBy: ""})}}
                                                selectValues={["nickname", "name", "surname", "id"]}
                                                selectedOption={this.filterSearchHandler}
                                            />
                                            </>
                                        )
                                    }
                                    {
                                        this.state.hideSelectAll ? null : (
                                            <div className={classes.selectAllContainer} style={this.isMobile ? {margin: "15px 0px", width: "65%"} : null}>
                                                <div className={classes.selectAllContainerInner}>
                                                    <p>select all</p>
                                                    <input 
                                                        type="checkbox" 
                                                        onClick={this.selectAllFriends}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    }
                                    <div className={classes.center}>
                                        <div className={classes.friendsList} style={this.isMobile ? {width: "unset"} : null}>
                                            { friends }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
                {flash}
                {
                    this.state.redirect ? <Redirect to={"/conversation/?id="+this.state.redirectId}/> : null
                }
                {
                    this.state.redirectChat ? <Redirect to="/chat"/> : null
                }
            </div>
        );
    }
}
 
export default AddingConversation;
