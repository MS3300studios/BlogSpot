import React, { Component } from 'react';
import axios from 'axios';

import classes from './comments.module.css';
import Button from '../../../../components/UI/button';
import AddCommentForm from '../../../../components/UI/AddCommentForm';
import LikesCommentsNumbers from '../../../../components/UI/likesCommentsNumbers';
import UserPhoto from '../../../../components/UI/userphoto';
import CommentOptions from './optionsContainer/CommentOptions';
import Flash from '../../../../components/UI/flash';
import EditCommentForm from './optionsContainer/EditCommentFrom';

import getToken from '../../../../getToken';
import getUserData from '../../../../getUserData';
import formattedCurrentDate from '../../../../formattedCurrentDate';


class Comments extends Component {
    constructor(props){
        super(props);
        let token = getToken();
        let userData = getUserData();

        this.state = {
            test: '',
            token: token,
            userData: userData,
            limit: 2,
            blogId: props.blogId,
            comments: [],
            editing: false,
            flashMessage: "",
            flashNotClosed: true
        }

        this.loadmorehandler.bind(this);
        this.getComments.bind(this);
        this.flash.bind(this);
    }

    componentDidMount(){
        this.getComments();
    }

    getComments = (newLimit) => {
        let limit = this.state.limit;
        if(newLimit){
            this.setState({limit: newLimit});
            limit = newLimit;
        }

        axios({
            method: 'post',
            url: `http://localhost:3001/comments/limited`,
            headers: {'Authorization': this.state.token},
            data: {
                limit: limit,
                blogId: this.state.blogId
            }
        })
        .then((res)=>{
            if(res.status===200){
                let commentsRdy = [];
                res.data.comments.forEach(element => {
                    commentsRdy.push(element);
                });
                this.setState({comments: commentsRdy})
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    loadmorehandler = () => {
        let newLimit = this.state.limit+2;
        this.getComments(newLimit);
    }

    editCommentHandler = () => {
        this.setState({editing: true});
    }

    flash = (message) => {
        this.setState({flashMessage: message});
        this.getComments();
        
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

    render() { 
        let authorClassArr = classes.commentAuthor;
        let setSmall = false;
        if(this.props.small) {
            authorClassArr = [classes.smallAuthorClass, classes.commentAuthor].join(" ");
            setSmall = true;
        }
        
        let comments = this.state.comments.map((comment, index) => { 
            return ( 
                <React.Fragment key={index}>
                    <div className={classes.commentContainer}>
                        <div className={classes.topBar}>   
                            <div className={classes.userPhotoDiv}>
                                <a href={"/user/profile/?id="+comment.author}>
                                    <UserPhoto userId={comment.author} small />
                                </a>
                            </div>
                            <p className={authorClassArr}>
                                <a href={"/user/profile/?id="+comment.author}>@{comment.authorNick}</a>
                            </p>
                            <p>{formattedCurrentDate(comment.createdAt)}</p>
                            <div className={classes.positionNumberContainer}>
                                <LikesCommentsNumbers objectId={comment._id} userId={comment.author}/>
                            </div>
                            {
                                (this.state.userData._id === comment.author) ? 
                                    <CommentOptions 
                                        flashProp={this.flash}
                                        editComment={this.editCommentHandler} 
                                        commentId={comment._id}/> : null
                            }
                        </div>
                        {
                            this.state.editing ? (
                                <EditCommentForm commentContent={comment.content} cancelEdit={()=>this.setState({editing: false})} />
                            ) : <p className={classes.commentContent}>{comment.content}</p>
                        }
                    </div>
                </React.Fragment>                
            )
        })

        let flash = null;
        if(this.state.flashMessage && this.state.flashNotClosed){
            flash = <Flash>{this.state.flashMessage}</Flash>
        }
        else if(this.state.flashMessage && this.state.flashNotClosed === false){
            flash = <Flash close>{this.state.flashMessage}</Flash>
        }

        return (
            <div className={classes.commentsContainer}>
                <AddCommentForm blogId={this.state.blogId} afterSend={this.getComments} small={setSmall}/>
                {comments}
                <Button clicked={this.loadmorehandler}>Load more comments</Button>
                {flash}
            </div>
        );
    }
}
 
export default Comments;