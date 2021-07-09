import React, {useState} from 'react';

import classes from './comments.module.css';

import EditCommentForm from './optionsContainer/EditCommentFrom';
import formattedCurrentDate from '../../../../formattedCurrentDate';
import LikesCommentsNumbers from '../../../../components/UI/likesCommentsNumbers';
import UserPhoto from '../../../../components/UI/userphoto';
import CommentOptions from './optionsContainer/CommentOptions';
import Flash from '../../../../components/UI/flash';

const Comment = (props) => {
    const [flashMessage, setflashMessage] = useState("");
    const [flashNotClosed, setflashNotClosed] = useState(true);
    const [editing, setediting] = useState(false)

    let flashHandle = (message) => {
        setflashMessage(message);
        props.getComments();
        
        setTimeout(()=>{
            setflashNotClosed(false);
        }, 2000)

        setTimeout(()=>{
            setflashMessage("");
        }, 3000);
    
        setTimeout(()=>{
            setflashNotClosed(true);
        }, 3000);
    }

    let editCommentHandler = () => {
        setediting(true);
    }

    let flash = null;
    if(flashMessage && flashNotClosed){
        flash = <Flash>{flashMessage}</Flash>
    }
    else if(flashMessage && flashNotClosed === false){
        flash = <Flash close>{flashMessage}</Flash>
    }

    return (
        <React.Fragment>
            <div className={classes.commentContainer}>
                <div className={classes.topBar}>   
                    <div className={classes.userPhotoDiv}>
                        <a href={"/user/profile/?id="+props.comment.author}>
                            <UserPhoto userId={props.comment.author} small />
                        </a>
                    </div>
                    <p className={props.authorClassArr}>
                        <a href={"/user/profile/?id="+props.comment.author}>@{props.comment.authorNick}</a>
                    </p>
                    <p>{formattedCurrentDate(props.comment.createdAt)}</p>
                    <div className={classes.positionNumberContainer}>
                        <LikesCommentsNumbers objectId={props.comment._id} userId={props.comment.author}/>
                    </div>
                    {
                        (props.userId === props.comment.author) ? 
                            <CommentOptions 
                                flashProp={flashHandle}
                                editComment={editCommentHandler} 
                                commentId={props.comment._id}/> : null
                    }
                </div>
                {
                    editing ? (
                        <EditCommentForm commentContent={props.comment.content} cancelEdit={()=>setediting(false)} />
                    ) : <p className={classes.commentContent}>{props.comment.content}</p>
                }
            </div>
            {flash}
        </React.Fragment>
    );
}
 
export default Comment;