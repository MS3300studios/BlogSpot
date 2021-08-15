import React, { Component } from 'react';
import axios from 'axios';
import classes from './AddCommentForm.module.css';
import getToken from '../../getToken';
import Flash from './flash';
import { RiSendPlaneFill, RiSendPlaneLine } from 'react-icons/ri' 
import getUserData from '../../getUserData';
import UserPhoto from '../UI/userphoto';

class AddCommentForm extends Component {
    constructor(props){
        super(props);
        let token = getToken();
        let userData = getUserData();
        
        this.state = {
            token: token,
            userData: userData,
            content: "",
            flashMessage: "",
            flashNotClosed: true,
            sendPressed: false
        }

        this.flash.bind(this);
        this.sendComment.bind(this);
        this.sendNotification.bind(this);
    }
    
    flash = (message) => {
        this.setState({flashMessage: message});

        setTimeout(()=>{
            this.setState({flashNotClosed: false})
        }, 2000)

        setTimeout(()=>{
            this.setState({flashMessage: ""});
        }, 3000);
    
        setTimeout(()=>{
            this.setState({flashNotClosed: true})
        }, 3000);
    }

    sendNotification = () => {
        let data = {
            receiverId: this.props.blogAuthorId,
            senderId: this.state.userData._id,
            senderNick: this.state.userData.nickname,
            objectType: "created-comment",
            objectId: this.props.blogId,
            actionType: "commented",
            isDeleting: false
        };
        axios({
            method: 'post',
            url: `http://localhost:3001/notifications/create`,
            headers: {'Authorization': this.state.token},
            data: data
        })
        .catch(error => {
            console.log(error);
        })
    }

    sendComment = (content) => {
        if(content === ""){
            this.flash("you cannot send an empty comment");
            return;
        }

        // this.props.afterSend({
        //     content: content,
        //     author: this.state.userData._id,
        //     authorNick: this.state.userData.nickname,
        //     blogId: this.props.blogId
        // }, true);

        axios({
            method: 'post',
            url: `http://localhost:3001/comments/new`,
            headers: {'Authorization': this.state.token},
            data: {
                content: content,
                author: this.state.userData._id,
                authorNick: this.state.userData.nickname,
                blogId: this.props.blogId
            }
        })
        .then((res)=>{
            if(res.status===200){
                this.flash("you posted a comment!");
                this.setState({content: ""});
                this.sendNotification();
                this.props.afterSend(res.data.comment, true);
            }
        })
        .catch(error => {
            this.flash(error);
            console.log(error);
        })

    }   

    render() { 
        let flashView = null;
        if(this.state.flashMessage && this.state.flashNotClosed){
            flashView = <Flash>{this.state.flashMessage}</Flash>
        }
        else if(this.state.flashMessage && this.state.flashNotClosed === false){
            flashView = <Flash close>{this.state.flashMessage}</Flash>
        }
        let smallClass = classes.mainForm;
        if(this.props.small){
            smallClass = [classes.mainForm, classes.smallForm].join(" ");
        }
        return (
            <React.Fragment>
                <div className={classes.mainContainer}>
                    <div className={classes.userPhotoDiv}>
                        <UserPhoto userId={this.state.userData._id} smallPhotoCommentForm hideOnlineIcon/>
                    </div>
                    <div className={smallClass}>
                        <input 
                            value={this.state.content} 
                            placeholder="write your comment here" 
                            onChange={ event =>this.setState({content: event.target.value})}
                            onKeyDown={event =>{
                                if(event.key === "Enter") this.sendComment(this.state.content);
                                else return null
                            }}
                        />
                    </div>
                    <div 
                        onMouseDown={()=>{
                            this.setState({sendPressed: true})
                            this.sendComment(this.state.content);
                        }}
                        onMouseUp={()=>{this.setState({sendPressed: false})}} 
                        className={classes.sendIcon}>
                        {this.state.sendPressed ? <RiSendPlaneLine size="2em"/> : <RiSendPlaneFill size="2em" />}
                    </div>
                </div>
                {flashView}
            </React.Fragment>
        );
    }
}
 
export default AddCommentForm;