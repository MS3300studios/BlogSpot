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
import EditCommentForm from '../userProfile/tabs/comments/optionsContainer/EditCommentFrom';
import { Redirect, withRouter } from 'react-router-dom';

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
            comments: [],
            commentsEditing: [],
            likeFill: false,
            dislikeFill: false,
            redirect: false,
            socialStateWasChanged: false
        }
        this.getPhoto.bind(this);
        this.sendComment.bind(this);
        this.flash.bind(this);
        this.deleteCommentHandler.bind(this);
        this.editCommentHandler.bind(this);
        this.indexComments.bind(this);
        this.sendLikeAction.bind(this);
        this.checkFills.bind(this);
        this.deletePhotoHandler.bind(this);
        this.editPhotoDescHandler.bind(this);
    }

    componentDidMount(){
        this.getPhoto();
        console.log(this.props)
    }

    deletePhotoHandler = () => {
        axios({
            method: 'post',
            url: `http://localhost:3001/photo/delete`,
            headers: {'Authorization': this.state.token},
            data: {
                id: this.state.photo._id
            }
        })
        .then((res)=>{
            console.log(res)
            if(res.status===200){
                this.setState({redirect: true})
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    }    

    editPhotoDescHandler = () => {

    }

    sendLikeAction = (like) => {
        axios({
            method: 'post',
            url: `http://localhost:3001/photo/rate`,
            headers: {'Authorization': this.state.token},
            data: {
                photoId: this.state.photo._id,
                like: like
            }
        })
        .then((res)=>{
            let fills = this.checkFills(res.data.photo);
            this.setState({photo: res.data.photo, likeFill: fills.likeFill, dislikeFill: fills.dislikeFill, socialStateWasChanged: true});
            //socialStateWasChanged kiedy klikniemy close to odpali się funkcja w propsach która sprawdzi ten stan i będzie wiedzieć czy odświeżyć czy nie
        })
        .catch(error => {
            console.log(error);
        })
    }

    editCommentHandler = (index, cancelEdit) => {
        let editComArr = this.state.commentsEditing;
        let temp = true;
        if(cancelEdit){
            temp = false;
        }
        editComArr[index] = temp;
        this.setState({commentsEditing: editComArr});
    }

    editCommentCleanUp = (photo) => {
        this.indexComments();
        this.setState({
            photo: photo
        })
    }

    deleteCommentHandler = (index) => {
        axios({
            method: 'post',
            url: `http://localhost:3001/photo/comment/delete`,
            headers: {'Authorization': this.state.token},
            data: {
                photoId: this.state.photo._id,
                content: this.state.comments[index].content
            }
        })
        .then((res)=>{
            if(res.status===200){
                this.setState({photo: res.data.photo, socialStateWasChanged: true});
                this.indexComments();
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
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
        
        let editingComments = [];
        let comments = this.props.photo.comments.map((comment, index) => {
            editingComments.push(false);
            comment.index = index;
            return comment
        })
        let fills = this.checkFills(this.props.photo);
        this.setState({
            photo: this.props.photo, 
            loading: false, 
            comments: comments, 
            commentsEditing: editingComments,
            likeFill: fills.likeFill, 
            dislikeFill: fills.dislikeFill});
        
        //this.setState({loading: true});
        // axios({
        //     method: 'get',
        //     url: `http://localhost:3001/photos/getone/60eadacbd90e8d374c9759a1`,
        // })
        // .then((res)=>{
        //     if(res.status===200){
        //         //indexComments:
        //         let editingComments = [];
        //         let comments = res.data.photo.comments.map((comment, index) => {
        //             editingComments.push(false);
        //             comment.index = index;
        //             return comment
        //         })
        //         let fills = this.checkFills(res.data.photo);
        //         this.setState({
        //             photo: res.data.photo, 
        //             loading: false, 
        //             comments: comments, 
        //             commentsEditing: editingComments,
        //             likeFill: fills.likeFill, 
        //             dislikeFill: fills.dislikeFill});
        //         return;
        //     }
        //     else{
        //         this.flash("Error: wrong request, photo not found")
        //     }
        // })
        // .catch(error => {
        //     console.log(error);
        // })
    }

    checkFills = (photo) => {
        let likeFill = false;
        photo.likes.forEach(like => {
            if(like.authorId===this.state.userData._id) likeFill = true
        })
        let dislikeFill = false;
        photo.dislikes.forEach(dislike => {
            if(dislike.authorId===this.state.userData._id) dislikeFill = true
        })
        return ({
            likeFill: likeFill,
            dislikeFill: dislikeFill
        })
    }

    indexComments = () => {
        let editingComments = [];
        let comments = this.state.photo.comments.map((com, index) => {
            editingComments.push(false);
            com.index = index;
            return com
        })
        this.setState({comments: comments, commentsEditing: editingComments});
    }

    sendComment = () => {
        if(this.state.newCommentContent !== ""){
            axios({
                method: 'post',
                url: `http://localhost:3001/photo/addComment`,
                headers: {'Authorization': this.state.token},
                data: {
                    photoId: this.state.photo._id,
                    nickname: this.state.userData.nickname,
                    content: this.state.newCommentContent
                }
            })
            .then((res)=>{
                if(res.status===201){
                    this.setState({photo: res.data.photo, newCommentContent: "", socialStateWasChanged: true})
                    return;
                }
            })
            .catch(error => {
                console.log(error);
            })
        }
        else{
            this.flash("you cannot send an empty comment")
        }
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
                    <Button className={classes.CloseButton} clicked={()=>this.props.closeBigPhoto(this.state.socialStateWasChanged)}>Close</Button>
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
                                {
                                    (this.state.userData._id === this.state.photo.authorId) ? (
                                        <div>
                                            <CommentOptions 
                                                photoComment
                                                deleteComment={() => this.deletePhotoHandler()}
                                                editComment={() => this.editPhotoDescHandler()} />
                                        </div>
                                    ) : null
                                    
                                }
                                <div className={classes.LikesCommentsNumbers}>
                                    <div className={classes.like}><Like
                                        sendAction={()=>this.sendLikeAction(true)}
                                        fill={this.state.likeFill}
                                        number={this.state.photo.likes.length}
                                        size="1.5em" 
                                        color="#0a42a4" 
                                        photoView/></div>
                                    <div className={classes.dislike}><Like
                                        dislike 
                                        sendAction={()=>this.sendLikeAction(false)}
                                        fill={this.state.dislikeFill}
                                        number={this.state.photo.dislikes.length}
                                        size="1.5em" 
                                        color="#0a42a4" 
                                        photoView/></div>
                                    <div className={classes.comment}>
                                        <FaCommentAlt size="1em" color="#0a42a4" className={classes.commenticon}/>
                                        <p>{this.state.photo.comments.length}</p>
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
                                        <input value={this.state.newCommentContent} placeholder="write your comment here" onChange={(event)=>this.setState({newCommentContent: event.target.value})}/>
                                    </form>
                                    <div 
                                        onMouseDown={(e)=>{
                                            this.setState({sendPressed: true})
                                            this.sendComment()
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
                                                                        deleteComment={() => this.deleteCommentHandler(index)}
                                                                        editComment={() => this.editCommentHandler(index, false)} /> : null
                                                            }
                                                        </div>
                                                        <div className={photoCommentClasses.content}>
                                                            {
                                                                this.state.commentsEditing[index] ? 
                                                                <EditCommentForm 
                                                                    photo
                                                                    cancelEdit={()=>this.editCommentHandler(index, true)}    
                                                                    initialValue={comment.content}  
                                                                    flashProp={this.flash}  
                                                                    afterSend={this.editCommentCleanUp}  
                                                                    photoId={this.state.photo._id}                          
                                                                /> : <p>{comment.content}</p>
                                                            }
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
                {flashView}
                {this.state.redirect ? <Redirect to="/myActivity" /> : null}
            </div> 
        );
    }
}
 
export default withRouter(photoView);