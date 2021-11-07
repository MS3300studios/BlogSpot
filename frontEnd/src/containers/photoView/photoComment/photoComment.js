import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import photoCommentClasses from './photoComment.module.css';

import CommentOptions from '../../userProfile/tabs/comments/optionsContainer/CommentOptions';
import formattedCurrentDate from '../../../formattedCurrentDate';
import UserPhoto from '../../../components/UI/userphoto';

class PhotoComment extends Component {
    render() { 
        return (
            <React.Fragment>
                <div className={photoCommentClasses.commentContainer}>
                    <div className={photoCommentClasses.topBar}>   
                        <div className={photoCommentClasses.userPhotoDiv}>
                            <UserPhoto userId={this.props.comment.authorId} small hideOnlineIcon/>
                        </div>
                        <p className={photoCommentClasses.nickName} style={{marginLeft: "5px"}}>
                            <Link to={"/user/profile/?id="+this.props.comment.authorId}>
                                @{this.props.comment.authorNick}
                            </Link>
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