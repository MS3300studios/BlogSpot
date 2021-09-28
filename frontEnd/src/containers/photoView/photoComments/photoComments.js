import axios from 'axios';
import React, { Component } from 'react';
import Spinner from '../../../components/UI/spinner';
import getToken from '../../../getToken';
import getUserData from '../../../getUserData';
import { Link } from 'react-router-dom';
import { MAIN_URI } from '../../../config';

import formattedCurrentDate from '../../../formattedCurrentDate';
import { RiSendPlaneFill, RiSendPlaneLine } from 'react-icons/ri' 
import classes from '../photoView.module.css';
import newCommentClasses from '../../../components/UI/AddCommentForm.module.css'

import UserPhoto from '../../../components/UI/userphoto';
import CommentOptions from '../../userProfile/tabs/comments/optionsContainer/CommentOptions';
import EditCommentForm from '../../userProfile/tabs/comments/optionsContainer/EditCommentFrom';
import photoCommentClasses from '../photoComment/photoComment.module.css';

class PhotoComments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            comments: [],
            newCommentContent: "",
            sendPressed: false,
            editingIndex: null
        }

        this.token = getToken();
        this.userData = getUserData();

        this.getComments.bind(this);
        this.addComment.bind(this);
        this.deleteCommentHandler.bind(this);
        this.editCommentHandler.bind(this);
    }

    getComments = () => {
        axios({
            method: 'get',
            url: `${MAIN_URI}/photo/getComments/${this.props.photoId}`,
            headers: {'Authorization': this.token}
        })
        .then((res)=>{
            if(res.status===200){
                let arr = res.data.comments.reverse();
                this.setState({comments: arr, loading: false});
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    addComment = () => {
        let newComments = this.state.comments;
        newComments.splice(0,0,{
            self: true,
            authorId: this.userData._id,
            photoId: this.props.photoId,
            authorNick: this.userData.nickname,
            content: this.state.newCommentContent
        });
        this.setState({comments: newComments, newCommentContent: ""}); 
        axios({
            method: 'post',
            url: `${MAIN_URI}/photo/addComment`,
            headers: {'Authorization': this.token},
            data: {
                photoId: this.props.photoId,
                nickname: this.userData.nickname,
                content: this.state.newCommentContent,
                adressingUser: this.props.photoAuthorId
            }
        })
        .catch(error => {
            console.log(error);
            if(error.message === "Request failed with status code 403"){
                this.props.flash('You cannot post comments on this users activity');
                let commentsRdy = this.state.comments.filter(el => el.self ? false : true);
                this.setState({comments: commentsRdy});
            }
        })
    }

    deleteCommentHandler = (index) => {
        let newComments = this.state.comments;
        newComments.splice(index, 1);
        console.log(newComments);
        this.setState({comments: newComments});
        axios({
            method: 'post',
            url: `${MAIN_URI}/photo/comment/delete`,
            headers: {'Authorization': this.token},
            data: {
                photoId: this.props.photoId,
                content: this.state.comments[index].content
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    editCommentHandler = (index) => {
        console.log('editing at '+index)        
    }

    componentDidMount(){
        this.getComments();
    }

    render() { 
        return (
            <>
                <div className={classes.commentForm}>
                    <div className={newCommentClasses.mainContainer}>
                        <div className={newCommentClasses.userPhotoDiv}>
                            <UserPhoto userId={this.userData._id} smallPhotoCommentForm hideOnlineIcon/>
                        </div>
                        <div className={newCommentClasses.mainForm} style={{marginLeft: "-54px"}}>
                            <input 
                                value={this.state.newCommentContent} 
                                placeholder="write your comment here" 
                                onChange={ event => {
                                    console.log(event.key)
                                    this.setState({newCommentContent: event.target.value})
                                }}
                                // onKeyPress={ event => {
                                //     event.preventDefault();
                                //     if(event.key === "Enter") this.addComment();
                                // }}
                            />
                        </div>
                        <div 
                            onMouseDown={()=>{
                                this.addComment();
                                this.setState({sendPressed: true});
                            }}
                            onMouseUp={()=>this.setState({sendPressed: false})} 
                            className={newCommentClasses.sendIcon}>
                            {this.state.sendPressed ? <RiSendPlaneLine size="2em"/> : <RiSendPlaneFill size="2em" />}
                        </div>
                    </div>
                </div>
                {
                    this.state.loading ? <Spinner darkgreen /> : (
                        <div className={classes.commentsContainer}>
                            {
                                this.state.comments.map((comment, index) => (
                                    <div className={photoCommentClasses.commentContainer} key={index}>
                                        <div className={photoCommentClasses.topBar}>    
                                            <div className={photoCommentClasses.userPhotoDiv}>
                                                <UserPhoto userId={comment.authorId} small hideOnlineIcon/>
                                            </div>
                                            <p className={photoCommentClasses.nickName}>
                                                <Link to={"/user/profile/?id="+comment.authorId}>@{comment.authorNick}</Link>
                                            </p>
                                            <p className={photoCommentClasses.Date}>{comment.self ? "just now" : formattedCurrentDate(comment.createdAt)}</p>
                                            {
                                                (this.userData._id === comment.authorId) ? 
                                                    <CommentOptions 
                                                        photoComment
                                                        deleteComment={() => this.deleteCommentHandler(index)}
                                                        editComment={() => this.setState({editingIndex: index})} 
                                                    /> : null
                                            }
                                        </div>
                                        <div className={photoCommentClasses.content}>
                                            {
                                                this.state.editingIndex === index ? (
                                                    <>
                                                        <EditCommentForm 
                                                            photo
                                                            cancelEdit={()=>this.setState({editingIndex: null})}    
                                                            initialValue={comment.content}  
                                                            flashProp={this.props.flash}  
                                                            setContent={newContent => this.setState(prevState => {
                                                                let comments = prevState.comments;
                                                                comments[index].content = newContent;
                                                                return ({...prevState, comments: comments, editingIndex: null});
                                                            })}
                                                            photoId={this.props.photoId}                          
                                                        />  
                                                    </>
                                                ) : <p>{comment.content}</p>
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )
                }
            </>
        );
    }
}
 
export default PhotoComments;