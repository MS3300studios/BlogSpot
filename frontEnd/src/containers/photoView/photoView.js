import React, { Component } from 'react';
import axios from 'axios';
import getToken from '../../getToken';
import getUserData from '../../getUserData';

import Like from '../../components/UI/like';
import { FaCommentAlt } from 'react-icons/fa';
import classes from './photoView.module.css';
import newCommentClasses from '../../components/UI/AddCommentForm.module.css'
import Button from '../../components/UI/button';
import formattedCurrentDate from '../../formattedCurrentDate';
import UserPhoto from '../../components/UI/userphoto';
import Spinner from '../../components/UI/spinner';
// import PhotoComment from './photoComment/photoComment';
import { RiSendPlaneFill, RiSendPlaneLine } from 'react-icons/ri' 
import Flash from '../../components/UI/flash';

import photoCommentClasses from './photoComment/photoComment.module.css';
import CommentOptions from '../userProfile/tabs/comments/optionsContainer/CommentOptions';

class photoView extends Component {
    constructor(props) {
        super(props);

        let token = getToken();
        let userData = getUserData();

        this.state = {
            token: token,
            userData: userData,
            loading: true,
            photo: null,
            flashMessage: "",
            flashNotClosed: true,
            newCommentContent: "",
            sendPressed: false,
            comments: []
        }
        this.getPhoto.bind(this);
        this.sendComment.bind(this);
        this.flash.bind(this);
    }

    componentDidMount(){
        this.getPhoto();
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

    getPhoto = () => {
        this.setState({loading: true});
        axios({
            method: 'get',
            url: `http://localhost:3001/photos/getone/60eadacbd90e8d374c9759a1`,
        })
        .then((res)=>{
            if(res.status===200){
                let comments = res.data.photo.comments.map((comment, index) => {
                    comment.index = index;
                    return comment
                })
                this.setState({photo: res.data.photo, loading: false, comments: comments});
                return;
            }
            else{
                this.flash("Error: wrong request, photo not found")
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    sendComment = () => {
        axios({
            method: 'post',
            url: `http://localhost:3001/photo/addComment`,
            headers: {'Authorization': this.state.token},
            data: {
                photoId: "60eadacbd90e8d374c9759a1",
                nickname: this.state.userData.nickname,
                content: this.state.content
            }
        })
        .then((res)=>{
            if(res.status===201){
                this.setState({photo: res.data.photo})
                this.props.afterSend();
                return;
            }
        })
        .catch(error => {
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
        let smallClass = newCommentClasses.mainForm;
        if(this.props.small){
            smallClass = [newCommentClasses.mainForm, newCommentClasses.smallForm].join(" ");
        }

        return (
            <div className={classes.backdrop}>
                <div className={classes.photoViewContainer}>
                    <Button clicked={()=>console.log('this.props.close')}>Close</Button>
                    <div className={classes.imgContainer}>
                        {
                            this.state.loading ? <Spinner darkgreen /> : <img src={this.state.photo.data} alt="refresh your page"/>
                        }
                    </div>
                    {
                        this.state.loading ? <Spinner darkgreen /> : (
                            <div className={classes.dataContainer}>
                                <div className={classes.authorInfoContainer}>
                                    <div className={classes.authorPhoto}>
                                        {
                                            this.state.loading ? <Spinner darkgreen /> : <UserPhoto userId={this.state.photo.authorId} small />
                                        }
                                    </div>
                                    <div className={classes.authorData}>
                                        <p>@Princess89</p>
                                        <p>{formattedCurrentDate(this.state.photo.createdAt)}</p>
                                    </div>
                                </div>
                                <div className={classes.LikesCommentsNumbers}>
                                    <div className={classes.like}><Like
                                        sendAction={this.sendAction}
                                        fill={true}
                                        number={12}
                                        size="1.5em" 
                                        color="#0a42a4" 
                                        photoView/></div>
                                    <div className={classes.dislike}><Like
                                        dislike 
                                        sendAction={this.sendAction}
                                        fill={false}
                                        number={7}
                                        size="1.5em" 
                                        color="#0a42a4" 
                                        photoView/></div>
                                    <div className={classes.comment}>
                                        <FaCommentAlt size="1em" color="#0a42a4" className={classes.commenticon}/>
                                        <p>10</p>
                                    </div>
                                </div>
                                <hr />
                                <div className={classes.description}>
                                    <p>{this.state.photo.description}</p>
                                </div>
                                <hr />
                                <div className={classes.commentForm}>
                                <div className={newCommentClasses.mainContainer}>
                                    <div className={newCommentClasses.userPhotoDiv}>
                                        <UserPhoto userId={this.state.userData._id} smallPhotoCommentForm />
                                    </div>
                                    <form className={smallClass} style={{marginLeft: "-54px"}}>
                                        <input value={this.state.content} placeholder="write your comment here" onChange={(event)=>this.setState({content: event.target.value})}/>
                                    </form>
                                    <div 
                                        onMouseDown={(e)=>{
                                            this.setState({sendPressed: true})
                                            this.sendComment(e, this.state.content)
                                        }}
                                        onMouseUp={()=>{this.setState({sendPressed: false})}} 
                                        className={newCommentClasses.sendIcon}>
                                        {this.state.sendPressed ? <RiSendPlaneLine size="2em"/> : <RiSendPlaneFill size="2em" />}
                                    </div>
                                </div>
                                </div>
                                <div className={classes.commentsContainer}>
                                    {
                                        this.state.photo.comments.map((comment, index) => {
                                            return (
                                                <div key={index}>
                                                    {/* <PhotoComment comment={comment} userId={this.state.userData.userId}/> */}
                                                    <div className={photoCommentClasses.commentContainer}>
                                                        <div className={photoCommentClasses.topBar}>   
                                                            <div className={photoCommentClasses.userPhotoDiv}>
                                                                <UserPhoto userId={comment.authorId} small />
                                                            </div>
                                                            <p className={photoCommentClasses.nickName}>
                                                                <a href={"/user/profile/?id="+comment.authorId}>@{comment.authorNick}</a>
                                                            </p>
                                                            <p className={photoCommentClasses.Date}>{formattedCurrentDate(comment.createdAt)}</p>
                                                            {
                                                                (this.state.userData._id === comment.authorId) ? 
                                                                    <CommentOptions 
                                                                        photoComment
                                                                        deleteComment={this.deleteCommentHandler}
                                                                        editComment={this.editCommentHandler} /> : null
                                                            }
                                                        </div>
                                                        <div className={photoCommentClasses.content}>
                                                            <p>{comment.content}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        )
                    }
                </div> 
                <button style={{backgroundColor: "black"}} onClick={()=>{
                    axios({
                        method: 'post',
                        url: `http://localhost:3001/photo/addComment`,
                        headers: {'Authorization': this.state.token},
                        data: {
                            photoId: "60eadacbd90e8d374c9759a1",
                            nickname: this.state.userData.nickname,
                            content: "Good for me!"
                        }
                    })
                    .then((res)=>{
                        if(res.status===201){
                            this.setState({photo: res.data.photo})
                            return;
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
                }}>
                    add comment
                </button>
                <button style={{backgroundColor: "black"}} onClick={()=>{
                    axios({
                        method: 'post',
                        url: `http://localhost:3001/photo/deleteComment`,
                        headers: {'Authorization': this.state.token},
                        data: {
                            photoId: "60eadacbd90e8d374c9759a1",
                            content: "Good for me!"
                        }
                    })
                    .then((res)=>{
                        if(res.status===200){
                            this.setState({photo: res.data.photo})
                            return;
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
                }}>
                    delete comment
                </button>
                {flashView}
            </div> 
        );
    }
}
 
export default photoView;