import React, { Component } from 'react';

import photoCommentClasses from './photoComment.module.css';

import CommentOptions from '../../userProfile/tabs/comments/optionsContainer/CommentOptions';
import formattedCurrentDate from '../../../formattedCurrentDate';
import UserPhoto from '../../../components/UI/userphoto';

class PhotoComment extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() { 
        return (
            <React.Fragment>
                <div className={photoCommentClasses.commentContainer}>
                    <div className={photoCommentClasses.topBar}>   
                        <div className={photoCommentClasses.userPhotoDiv}>
                            <UserPhoto userId={this.props.comment.authorId} small hideOnlineIcon/>
                        </div>
                        <p className={photoCommentClasses.nickName}>
                            <a href={"/user/profile/?id="+this.props.comment.authorId}>@{this.props.comment.authorNick}</a>
                        </p>
                        <p className={photoCommentClasses.Date}>{formattedCurrentDate(this.props.comment.createdAt)}</p>
                        {
                            (this.props.userId === this.props.comment.authorId) ? 
                                <CommentOptions 
                                    photoComment
                                    deleteComment={this.props.deleteCommentHandler}
                                    editComment={this.props.editCommentHandler} /> : null
                        }
                    </div>
                    <div className={photoCommentClasses.content}>
                        <p>{this.props.comment.content}</p>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
 
export default PhotoComment;