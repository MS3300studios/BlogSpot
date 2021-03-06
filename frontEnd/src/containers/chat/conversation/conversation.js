import React, { Component } from 'react';
import { MAIN_URI } from '../../../config';

import getUserData from '../../../getUserData';
import getToken from '../../../getToken';
import getColor from '../../../getColor';

import { withRouter, Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';

import { IoIosArrowBack, IoIosArrowDown } from 'react-icons/io';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { IoIosArrowUp } from 'react-icons/io';
import { FiUserPlus } from 'react-icons/fi';
import { ImExit } from 'react-icons/im';
import { BsPencil } from 'react-icons/bs';
import { AiFillDelete } from 'react-icons/ai';
import {BsInfoCircle, BsInfoCircleFill} from 'react-icons/bs';
import { BiBlock } from 'react-icons/bi';
import Button from '../../../components/UI/button';
import Spinner from '../../../components/UI/spinner';
import Participant from './participant';
import AddingConversation from '../addingConversation/addingConversation';

import classes from './conversation.module.css';
import greenClasses from './greenClasses.module.css';
import blueClasses from './blueClasses.module.css';
import UserPhoto from '../../../components/UI/userphoto';
import getMobile from '../../../getMobile';

const colorScheme = getColor();
let colorClasses = greenClasses;
if(colorScheme === "blue"){
    colorClasses = blueClasses;
}

class Conversation extends Component {
    constructor(props) {
        let userData = getUserData();
        let token = getToken();

        super(props);
        this.state = {
            messages: [],
            message: "",
            partner: null,
            user: userData,
            token: token,
            conversationUsers: [],
            skip: 0,
            loading: true,
            infoOpened: false,
            editConversationName: false,
            newConversationName: props.conversation.name,
            addingUser: false,
            showParticipants: false,
            loadingNewMessages: false,
            filterParticipantsString: "",
            conversationStartReached: false,
            redirectToDashboard: false,
            loadingBlocked: true,
            redirectToChat: false
        }
        
        this.sendMessage.bind(this);
        this.sendConversationName.bind(this);
        this.fetchMessages.bind(this);
        this.addUser.bind(this);
        this.leaveConversation.bind(this);
        this.filterParticipants.bind(this);
        this.handleScroll.bind(this);
        this.deleteConversation.bind(this);
        this.sendLastReadMessage.bind(this);
        this.getOtherUserNameAndId.bind(this);
        this.blockUserInPrivateConversation.bind(this);
        
        this.scrollPosition = React.createRef();
        this.scrollPosition.current = 201;
        this.messagesEnd = null;
        this.lastCurrentMessage = null;
        this.isMobile = getMobile();
    }

    componentDidMount(){
        this.fetchMessages();
        // this.props.socket.emit('join', {name: this.state.user.name, conversationId:  this.props.conversation._id});

        this.props.socket.on('message', message => {
            console.log('[conversation.js] socket: message was received')
            if(message.conversationId === this.props.conversation._id){
                let prevMessages = this.state.messages;
                prevMessages.push(message);
                this.setState({messages: prevMessages});
                this.sendLastReadMessage(message.content, this.props.conversation._id);    
            }
        })
    }   

    componentDidUpdate(prevProps, prevState){
        if(prevProps.conversation._id !== this.props.conversation._id){
            // console.log('leaving conversation '+prevProps.conversation._id)
            // this.props.socket.emit('leaveConversation', {conversationId: prevProps.conversation._id});
            // console.log('joining conversation '+this.props.conversation._id)
            // this.props.socket.emit('join', {name: this.state.user.name, conversationId: this.props.conversation._id});

            this.setState({skip: 0, infoOpened: false, loadingNewMessages: false, messages: [], conversationStartReached: false}, () => {
                this.scrollPosition.current = 201;
                this.fetchMessages();
            })
        }else if(this.props.scrBot){
            this.messagesEnd.scrollIntoView({ behavior: "smooth" });
        }
        if(this.state.message === "" && this.scrollPosition.current > 200){ 
            this.messagesEnd.scrollIntoView({ behavior: "smooth" });
        }
    }

    // componentWillUnmount(){
    //     this.props.socket.emit('leaveConversation', {conversationId: this.props.conversation._id});
    //     console.log('leaving conversation '+this.props.conversation._id)
    // }

    sendLastReadMessage = (content, conversationId) => {
        axios({
            method: 'post',
            url: `${MAIN_URI}/lastReadMessage/create`,
            headers: {'Authorization': this.state.token},
            data: {
                conversationId: conversationId,
                content: content 
            }
        });
    }

    handleScroll = (e) => {
        this.scrollPosition.current = e.target.scrollTop;

        if(e.target.scrollTop === 0 && this.state.loadingNewMessages !== true && this.state.messages.length >= 10){
            this.setState({loadingNewMessages: true}, ()=> {
                this.fetchMessages(true);
            })
        }
    }

    fetchMessages = (scrollToPosition) => {
        if(this.state.conversationStartReached === true) this.setState({loading: false, loadingNewMessages: false});
        else{
            axios({
                method: 'post',
                url: `${MAIN_URI}/messages`,
                headers: {'Authorization': this.state.token},
                data: {skip: this.state.skip, conversationId: this.props.conversation._id}
            })
            .then((res)=>{
                if(res.status===200){
                    let newSkip = this.state.skip+10;
                    let newState = {messages: res.data.messages.concat(this.state.messages), skip: newSkip, loading: false, loadingNewMessages: false}
                    if(res.data.messages.length === 0){
                        newState = {skip: newSkip, loading: false, loadingNewMessages: false, conversationStartReached: true }
                    }
                    this.setState(newState, () => {
                        if(scrollToPosition) {
                            if(res.data.messages.length < 10) return null; //if no more messages are available, do nothing
                            else this.lastCurrentMessage.scrollIntoView();
                        }
                        else if(!scrollToPosition){
                            this.messagesEnd.scrollIntoView({ behavior: "smooth" });                            
                            res.data.messages.forEach((el, index) => {
                                if(index===res.data.messages.length-1){
                                    this.sendLastReadMessage(el.content, this.props.conversation._id); 
                                }
                            })
                        }
                    });
                    return;
                }
            })
            .catch(error => {
                console.log(error);
            })
        }
    }

    deleteConversation = () => {
        axios({
            method: 'get',
            url: `${MAIN_URI}/conversation/delete/${this.props.conversation._id}`,
            headers: {'Authorization': this.state.token}
        })
        .then((res)=>{
            if(res.status===200){
                this.setState({redirectToDashboard: true});
            }
        })
        .catch(error => {
            console.log(error);
        }) 
    }

    blockUserInPrivateConversation = () => {
        let friendId = null;
        this.props.conversation.participants.forEach(participant => {
            if(participant.userId !== this.state.user._id){
                friendId = participant.userId;
            }
        });

        axios({
            method: 'post',
            url: `${MAIN_URI}/blocking/addBlock`,
            headers: {'Authorization': this.state.token},
            data: {userToBeBlockedId: friendId}
        })
        .then((res)=>{
            if(res.status===200){
                //trigger props function that resets component
                this.props.refreshAfterBlock();
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    sendMessage = () => {
        if(this.state.message === "") return null
        else {
            //processing time
            let hour = new Date().getHours();
            if(hour<10) hour = "0"+hour;
            let minute = new Date().getMinutes()
            if(minute<10) minute = "0"+minute;
            let time = `${hour}:${minute}`

            this.props.socket.emit('sendMessage', {
                authorId: this.state.user._id,
                authorName: this.state.user.name, 
                content: this.state.message, 
                conversationId: this.props.conversation._id, 
                hour: time 
            });

            this.messagesEnd.scrollIntoView({ behavior: "smooth" });
        }
        this.setState({message: ""});
    }

    sendConversationName = () => {
        if(this.state.newConversationName !== ""){
            axios({
                method: 'post',
                url: `${MAIN_URI}/conversation/edit/name/${this.props.conversation._id}`,
                headers: {'Authorization': this.state.token},
                data: {
                    newName: this.state.newConversationName
                }
            })
            .then((res)=>{
                if(res.status===200){
                    this.props.history.go(0);
                    return;
                }
            })
            .catch(error => {
                console.log(error);
            })
        }
        else{
            console.log('conversation name cannot be empty');
        }
    }

    leaveConversation = () => {
        axios({
            method: 'get',
            url: `${MAIN_URI}/conversation/leave/${this.props.conversation._id}`,
            headers: {"Authorization": this.state.token}
        })
        .then((res)=>{
            if(res.status===200){
                if(this.isMobile) this.setState({redirectToChat: true});
                else this.props.history.go(0);
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    addUser = () => {
        this.setState({addingUser: true});
    }

    filterParticipants = () => {
        let participantsJSX = []; //temporary array of all jsx friends, to be filtered and converted to friendsRdy
        let participantsRdy = [];
    
        participantsJSX = this.props.conversation.participants.map((el, index) => {
            return (
                <Participant el={el} key={index} />
            )
        });

        if(this.state.filterParticipantsString===""){
            participantsRdy = participantsJSX;
        }
        else{
            participantsRdy = participantsJSX.filter((participant)=>{
                if(participant.props.el.name.includes(this.state.filterParticipantsString)){
                    return true;
                }
                else return false;
            })
        }

        if(participantsRdy.length === 0){
            participantsRdy = (
                <h1>There is no user with this name in this conversation</h1>
            );
        }

        return participantsRdy;
    } 

    getOtherUserNameAndId = () => {
        let friendName = null;
        let friendId = null;
        this.props.conversation.participants.forEach(participant => {
            if(participant.userId !== this.state.user._id){
                friendName = participant.name;
                friendId = participant.userId;
            }
        });
        
        return ({friendName: friendName, friendId: friendId})
    }

    render() { 
        let messages;
        if(this.state.loading === true){
            messages = <Spinner />
        }
        else if(this.state.messages.length === 0){
            messages = (
                <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
                    <h1 style={{margin: "0 auto", color: "white"}}>There are no messages in this conversation yet!</h1>
                </div>
            )
        }
        else{
            messages = this.state.messages.map((message, index) => {
                let messageClassNames = [classes.message, colorClasses.partnerColor].join(" ");
                if(message.authorName === this.state.user.name) messageClassNames = [classes.message, colorClasses.userLoggedColor].join(" ");
                else if(message.authorName === "Admin") messageClassNames = [classes.message, classes.adminColor].join(" ");
                
                return (
                    <div className={classes.elongateMessage} key={index}>
                        <div className={messageClassNames} ref={el => {
                            if(index === 9) this.lastCurrentMessage = el //if index is 9 a ref is overwritten, else do nothing
                            else return null
                        }}>
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

        let conversationName = <h1>{this.props.conversation.name}</h1>
        if(this.props.conversation.conversationType === "private"){
            const data = this.getOtherUserNameAndId();
            conversationName = (
                <div className={classes.conversationName}>
                    <UserPhoto userId={data.friendId}/>
                    <Link to={`/user/profile/?id=${data.friendId}`} style={{color: "unset", textDecoration: "none", marginLeft: "-50px"}}>
                        <h1>{data.friendName}</h1>
                    </Link>
                </div>
            )
        }

        return (
            <>
            <div className={colorClasses.conversationBanner}>
                {this.isMobile ? (
                    <Link to="/chat">
                        <IoIosArrowBack size="2em" color="#fff"/>
                    </Link>
                ) : null}
                {conversationName}
                <div className={classes.infoCircle} onClick={()=>this.setState((prevState)=>({infoOpened: !prevState.infoOpened}))}>
                    {
                        this.state.infoOpened ? <BsInfoCircleFill size="2em" color="#04255f"/> : <BsInfoCircle size="2em" color="#04255f"/>
                    }
                </div>
            </div>
            <div className={classes.center} style={this.isMobile ? {overflowX: "hidden"} : null}>
                <div className={classes.mainContainer}>
                    <div className={classes.messages} onScroll={this.handleScroll}>
                        {
                            this.state.loadingNewMessages ? <Spinner small/> : (
                                <div ref={this.top} className={classes.messagesTopDiv}>
                                    {(this.state.conversationStartReached && this.state.messages.length!==0) ? <h1>You've reached the start of the conversation</h1> : null}
                                </div>
                            )
                        }
                        {messages}
                        <div style={{visibility: "none"}} ref={el => this.messagesEnd = el}></div>
                    </div>
                    <div className={classes.inputAndButtonContainer}>
                        <input 
                            className={classes.input} 
                            value={this.state.message} 
                            type="text" 
                            onChange={(ev)=>this.setState({message: ev.target.value})}
                            onKeyPress={event => event.key === 'Enter' ? this.sendMessage(event) : null}
                            />
                        <button onClick={this.sendMessage} className={classes.glowOnHover}>Send</button>
                    </div>
                </div>
                {
                    this.state.infoOpened ? (
                        <>
                            {
                                this.isMobile ? (
                                    <div 
                                        style={{
                                            position: "fixed", 
                                            top: "0px", 
                                            left: "0px", 
                                            width: "100%",
                                            height: "100%",
                                            backgroundColor: "rgba(0,0,0,0.5)"
                                        }}
                                    >
                                        <div className={colorClasses.sidePanel} style={this.isMobile ? {width: "100%", height: "60%", position: "fixed", overflow: "auto"} : null}>
                                            <div 
                                                style={{
                                                    fontSize: "20px",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    padding: "12px"
                                                }} 
                                                onClick={()=>this.setState({infoOpened: false})}
                                            >
                                                <AiOutlineCloseCircle color="#fff" size="2em"/>
                                            </div>
                                            <div style={{display: "flex", justifyContent: "center", width: "100%", marginBottom: "-40px"}}>
                                                <p style={{color: "white", fontWeight: "500"}}>conversation id: {this.props.conversation._id}</p>
                                            </div>
                                            {
                                                (this.props.conversation.conversationType === "private") ? (
                                                    <div className={colorClasses.centerTop}>
                                                        <div style={{margin: "0 auto"}}>
                                                            <div className={[classes.operationButton,classes.leave].join(" ")} onClick={()=>this.deleteConversation(false)}>
                                                                <AiFillDelete size="2em" color="#fff"/>
                                                                <p>Delete conversation</p>
                                                            </div>
                                                            <br />
                                                            <div className={[classes.operationButton,classes.leave].join(" ")} onClick={this.blockUserInPrivateConversation}>
                                                                <BiBlock size="2em" color="#fff"/>
                                                                <p>Block user</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {
                                                            this.state.editConversationName ? (
                                                                <div className={classes.editingContainer}>
                                                                    <div className={classes.inputContainer}>
                                                                        <input 
                                                                            type="text" 
                                                                            className={classes.editConversationNameInput}
                                                                            value={this.state.newConversationName}
                                                                            onChange={(e)=>this.setState({newConversationName: e.target.value})}
                                                                        />
                                                                    </div>
                                                                    <div className={classes.btnContainer}>
                                                                        <Button btnType="Continue" clicked={this.sendConversationName}>Continue</Button>
                                                                        <Button btnType="Cancel" clicked={()=>this.setState({editConversationName: false})}>Cancel</Button>
                                                                    </div>
                                                                </div>
                                                            )
                                                                : ( 
                                                                <div className={classes.conversationName}>
                                                                    <h1>{this.props.conversation.name}</h1>
                                                                    <div className={classes.pencilContainer}>
                                                                        <BsPencil 
                                                                            size="2em" 
                                                                            color="#0a42a4" 
                                                                            onClick={()=>this.setState({editConversationName: true})}/>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                        <hr />
                                                        <div className={classes.center}>
                                                            <div className={[classes.operationButton,classes.leave].join(" ")} onClick={this.leaveConversation}>
                                                                <ImExit size="2em" color="#fff"/>
                                                                <p>Leave conversation</p>
                                                            </div>
                                                        </div>
                                                        <div className={classes.center}>
                                                            <div className={[classes.operationButton,classes.addUser].join(" ")} onClick={this.addUser}>
                                                                <FiUserPlus size="1.7em" color="#fff"/>
                                                                <p>Add a user</p>
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className={classes.collapsibleParticipants}>
                                                            <div className={classes.collapsiblePanel} onClick={()=>this.setState((prevState)=>({showParticipants: !prevState.showParticipants}))}> 
                                                                {
                                                                    this.state.showParticipants ? <IoIosArrowUp size="2em" color="#fff"/> : <IoIosArrowDown size="2em" color="#fff"/>
                                                                }
                                                                <p>participants</p>
                                                            </div>
                                                            {
                                                                this.state.showParticipants ? (
                                                                    <div>
                                                                        <input 
                                                                            type="text" 
                                                                            placeholder="search participants by name"
                                                                            className={classes.input}
                                                                            onChange={(e)=>this.setState({filterParticipantsString: e.target.value})}
                                                                        />
                                                                        <div className={classes.participantsContainer}>
                                                                            {this.filterParticipants()}
                                                                        </div>
                                                                    </div>
                                                                ) : null
                                                            }
                                                        </div>
                                                    </>
                                                )
                                            }
                                        </div>
                                    </div>
                                ) : (
                                    <div className={colorClasses.sidePanel} style={this.isMobile ? {width: "100%", height: "60%", position: "fixed", overflow: "auto"} : null}>
                                        {
                                            (this.props.conversation.conversationType === "private") ? (
                                                <div className={colorClasses.centerTop}>
                                                    <div style={{margin: "0 auto"}}>
                                                        <div className={[classes.operationButton,classes.leave].join(" ")} onClick={()=>this.deleteConversation(false)}>
                                                            <AiFillDelete size="2em" color="#fff"/>
                                                            <p>Delete conversation</p>
                                                        </div>
                                                        <br />
                                                        <div className={[classes.operationButton,classes.leave].join(" ")} onClick={this.blockUserInPrivateConversation}>
                                                            <BiBlock size="2em" color="#fff"/>
                                                            <p>Block user</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    {
                                                        this.state.editConversationName ? (
                                                            <div className={classes.editingContainer}>
                                                                <div className={classes.inputContainer}>
                                                                    <input 
                                                                        type="text" 
                                                                        className={classes.editConversationNameInput}
                                                                        value={this.state.newConversationName}
                                                                        onChange={(e)=>this.setState({newConversationName: e.target.value})}
                                                                    />
                                                                </div>
                                                                <div className={classes.btnContainer}>
                                                                    <Button btnType="Continue" clicked={this.sendConversationName}>Continue</Button>
                                                                    <Button btnType="Cancel" clicked={()=>this.setState({editConversationName: false})}>Cancel</Button>
                                                                </div>
                                                            </div>
                                                        )
                                                            : ( 
                                                            <div className={classes.conversationName}>
                                                                <h1>{this.props.conversation.name}</h1>
                                                                <div className={classes.pencilContainer}>
                                                                    <BsPencil 
                                                                        size="2em" 
                                                                        color="#0a42a4" 
                                                                        onClick={()=>this.setState({editConversationName: true})}/>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                    <hr />
                                                    <div className={classes.center}>
                                                        <div className={[classes.operationButton,classes.leave].join(" ")} onClick={this.leaveConversation}>
                                                            <ImExit size="2em" color="#fff"/>
                                                            <p>Leave conversation</p>
                                                        </div>
                                                    </div>
                                                    <div className={classes.center}>
                                                        <div className={[classes.operationButton,classes.addUser].join(" ")} onClick={this.addUser}>
                                                            <FiUserPlus size="1.7em" color="#fff"/>
                                                            <p>Add a user</p>
                                                        </div>
                                                    </div>
                                                    <hr />
                                                    <div className={classes.collapsibleParticipants}>
                                                        <div className={classes.collapsiblePanel} onClick={()=>this.setState((prevState)=>({showParticipants: !prevState.showParticipants}))}> 
                                                            {
                                                                this.state.showParticipants ? <IoIosArrowUp size="2em" color="#fff"/> : <IoIosArrowDown size="2em" color="#fff"/>
                                                            }
                                                            <p>participants</p>
                                                        </div>
                                                        {
                                                            this.state.showParticipants ? (
                                                                <div>
                                                                    <input 
                                                                        type="text" 
                                                                        placeholder="search participants by name"
                                                                        className={classes.input}
                                                                        onChange={(e)=>this.setState({filterParticipantsString: e.target.value})}
                                                                    />
                                                                    <div className={classes.participantsContainer}>
                                                                        {this.filterParticipants()}
                                                                    </div>
                                                                </div>
                                                            ) : null
                                                        }
                                                    </div>
                                                </>
                                            )
                                        }
                                    </div>
                                )
                            }
                        </>
                        ) : null
                }
                {
                    this.state.addingUser ? (
                        <AddingConversation 
                            isMobile={this.isMobile}
                            addingUsers
                            closeWindow={()=>this.setState({addingUser: false})}
                            participants={this.props.conversation.participants}
                            conversationId={this.props.conversation._id}
                        />
                    )
                    : null
                }
            </div>
            {
                this.state.redirectToDashboard ? <Redirect to="/"/> : null
            }
            {
                this.state.redirectToChat ? <Redirect to="/chat"/> : null
            }
            </>
        );
    }
}

const mapStateToProps = socket => {
    return socket;
}

export default connect(mapStateToProps)(withRouter(Conversation));