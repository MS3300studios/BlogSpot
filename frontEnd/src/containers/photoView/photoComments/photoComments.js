import React, { useState, useEffect } from 'react';

import axios from 'axios';
import getToken from '../../../getToken';
import formattedCurrentDate from '../../../formattedCurrentDate';
import getUserData from '../../../getUserData';

import Spinner from '../../../components/UI/spinner';
import UserPhoto from '../../../components/UI/userphoto';
import CommentOptions from '../../userProfile/tabs/comments/optionsContainer/CommentOptions';
import EditCommentForm from '../../userProfile/tabs/comments/optionsContainer/EditCommentFrom';
import photoCommentClasses from '../photoComment/photoComment.module.css';

const PhotoComments = (props) => {
    const [loading, setloading] = useState(true);
    const [comments, setcomments] = useState([]);
    const [commentsEditing, setcommentsEditing] = useState([]);
    const token = getToken();
    const userData = getUserData();

    useEffect(() => {
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
    }, [])

    return (
        <>
            {
                loading ? <Spinner darkgreen /> : (
                    <>
                        {
                            comments.map((comment, index) => (
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
                                                        deleteComment={() => this.deleteCommentHandler(index)}
                                                        editComment={() => this.editCommentHandler(index, false)} /> : null
                                            }
                                        </div>
                                        <div className={photoCommentClasses.content}>
                                            {
                                                commentsEditing[index] ? 
                                                <EditCommentForm 
                                                    photo
                                                    cancelEdit={()=>this.editCommentHandler(index, true)}    
                                                    initialValue={comment.content}  
                                                    flashProp={props.flash}  
                                                    afterSend={this.editCommentCleanUp}  
                                                    photoId={props.photoId}                          
                                                /> : <p>{comment.content}</p>
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </>
                )
            }
        </>
    );
}
 
export default PhotoComments;