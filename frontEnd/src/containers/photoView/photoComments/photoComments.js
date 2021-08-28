/*import React, { useState, useEffect, useCallback } from 'react';

import axios from 'axios';
import getToken from '../../../getToken';
import formattedCurrentDate from '../../../formattedCurrentDate';
import getUserData from '../../../getUserData';
import { RiSendPlaneFill, RiSendPlaneLine } from 'react-icons/ri' 
import classes from '../photoView.module.css';
import newCommentClasses from '../../../components/UI/AddCommentForm.module.css'

import Spinner from '../../../components/UI/spinner';
import UserPhoto from '../../../components/UI/userphoto';
import CommentOptions from '../../userProfile/tabs/comments/optionsContainer/CommentOptions';
import EditCommentForm from '../../userProfile/tabs/comments/optionsContainer/EditCommentFrom';
import photoCommentClasses from '../photoComment/photoComment.module.css';

const PhotoComments = (props) => {
    const [loading, setloading] = useState(true);
    const [comments, setcomments] = useState([]);
    const [commentsEditing, setcommentsEditing] = useState([]);
    const [newCommentContent, setnewCommentContent] = useState("");
    const [sendPressed, setsendPressed] = useState(false);

    const token = getToken();
    const userData = getUserData();
    
    let indexComments = () => {
        let editingComments = [];
        let commentsReady = comments.map((com, index) => {
            editingComments.push(false);
            com.index = index;
            return com
        })

        setcommentsEditing(editingComments);
        setcomments(commentsReady);
    }

    let editCommentHandler = (index, cancelEdit) => {
        let editComArr = commentsEditing;
        let temp = true;
        if(cancelEdit){
            temp = false;
        }
        editComArr[index] = temp;
        setcommentsEditing(editComArr);
    }

    let deleteCommentHandler = (index) => {
        axios({
            method: 'post',
            url: `http://localhost:3001/photo/comment/delete`,
            headers: {'Authorization': token},
            data: {
                photoId: props.photoId,
                content: comments[index].content
            }
        })
        .then((res)=>{
            if(res.status===200){
                indexComments();
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    let sendComment = () => {
        console.log('sending')
        if(newCommentContent !== ""){
            axios({
                method: 'post',
                url: `http://localhost:3001/photo/addComment`,
                headers: {'Authorization': token},
                data: {
                    photoId: props.photoId,
                    nickname: userData.nickname,
                    content: newCommentContent,
                    adressingUser: props.photoAuthorId
                }
            })
            .then((res)=>{
                if(res.status===201){
                    setcomments(res.data.photo.comments);
                    indexComments();
                    setnewCommentContent("");
                    props.sendNotification();
                }
            })
            .catch(error => {
                console.log(error)
                if(error.message === "Request failed with status code 403"){
                    props.flash('You cannot post comments on this users activity');
                }
            })
        }
        else{
            props.flash("you cannot send an empty comment");
        }
    }

    let getComments = useCallback(() => {
        axios({
            method: 'get',
            url: `http://localhost:3001/photo/getComments/${props.photoId}`,
            headers: {"Authorization": token}
        })
        .then((res)=>{
            if(res.status===200){
                let editingComments = [];
                let commentsReady = res.data.comments.map((comment, index) => {
                    editingComments.push(false);
                    comment.index = index;
                    return comment
                })

                setcommentsEditing(editingComments);
                setcomments(commentsReady);
                setloading(false);
            }
        })
        .catch(error => {
            console.log(error);
        })
    }, [props.photoId, token]);

    useEffect(() => {
        getComments();
    }, [comments, getComments]);

    let smallClass = newCommentClasses.mainForm;
    if(props.small){
        smallClass = [newCommentClasses.mainForm, newCommentClasses.smallForm].join(" ");
    }

    return (
        <>
            <div className={classes.commentForm}>
                <div className={newCommentClasses.mainContainer}>
                    <div className={newCommentClasses.userPhotoDiv}>
                        <UserPhoto userId={userData._id} smallPhotoCommentForm hideOnlineIcon/>
                    </div>
                    <div className={smallClass} style={{marginLeft: "-54px"}}>
                        <input 
                            value={newCommentContent} 
                            placeholder="write your comment here" 
                            onChange={ event => setnewCommentContent(event.target.value) }
                            onKeyPress={ev => ev.key === "Enter" ? sendComment() : null}
                        />
                    </div>
                    <div 
                        onMouseDown={(e)=>{
                            setsendPressed(true);
                            sendComment();
                        }}
                        onMouseUp={()=>setsendPressed(false)} 
                        className={newCommentClasses.sendIcon}>
                        {sendPressed ? <RiSendPlaneLine size="2em"/> : <RiSendPlaneFill size="2em" />}
                    </div>
                </div>
            </div>
            <div className={classes.commentsContainer}>
                {
                    loading ? <Spinner darkgreen /> : (
                        <>
                            {
                                comments.map((comment, index) => {
                                    return(
                                    <div key={index}>
                                        <div className={photoCommentClasses.commentContainer}>
                                            <div className={photoCommentClasses.topBar}>   
                                                <div className={photoCommentClasses.userPhotoDiv}>
                                                    <UserPhoto userId={comment.authorId} small hideOnlineIcon/>
                                                </div>
                                                <p className={photoCommentClasses.nickName}>
                                                    <a href={"/user/profile/?id="+comment.authorId}>@{comment.authorNick}</a>
                                                </p>
                                                <p className={photoCommentClasses.Date}>{formattedCurrentDate(comment.createdAt)}</p>
                                                {
                                                    (userData._id === comment.authorId) ? 
                                                        <CommentOptions 
                                                            photoComment
                                                            deleteComment={() => deleteCommentHandler(index)}
                                                            editComment={() => editCommentHandler(index, false)} 
                                                        /> : null
                                                }
                                            </div>
                                            <div className={photoCommentClasses.content}>
                                                {
                                                    commentsEditing[index] ? 
                                                    <EditCommentForm 
                                                        photo
                                                        cancelEdit={()=>editCommentHandler(index, true)}    
                                                        initialValue={comment.content}  
                                                        flashProp={props.flash}  
                                                        afterSend={props.afterSend}  
                                                        photoId={props.photoId}                          
                                                    /> : <p>{comment.content}</p>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )})
                            }
                        </>
                    )
                }
            </div>
        </>
    );
}
 
export default PhotoComments; */

import axios from 'axios';
import React, { Component } from 'react';
import Spinner from '../../../components/UI/spinner';
import getToken from '../../../getToken';
import getUserData from '../../../getUserData';

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
            url: `http://localhost:3001/photo/getComments/${this.props.photoId}`,
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
            url: `http://localhost:3001/photo/addComment`,
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
            url: `http://localhost:3001/photo/comment/delete`,
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
                                                <a href={"/user/profile/?id="+comment.authorId}>@{comment.authorNick}</a>
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


/*editContent => this.setState(prevState => {
    let comments = prevState.comments;
    comments[index].content = editContent
    return ({...prevState, comments: comments})
})*/