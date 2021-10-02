import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

import classes from './comments.module.css';

import { BsThreeDots } from 'react-icons/bs';
import { MAIN_URI } from '../../../../config';
import EditCommentForm from './optionsContainer/EditCommentFrom';
import formattedCurrentDate from '../../../../formattedCurrentDate';
import LikesCommentsNumbers from '../../../../components/UI/likesCommentsNumbers';
import UserPhoto from '../../../../components/UI/userphoto';
// import CommentOptions from './optionsContainer/CommentOptions';
import Flash from '../../../../components/UI/flash';
import axios from 'axios';
import getToken from '../../../../getToken';

const Comment = (props) => {
    const [flashMessage, setflashMessage] = useState("");
    const [flashNotClosed, setflashNotClosed] = useState(true);
    const [editing, setediting] = useState(false);
    const [optionsOpened, setoptionsOpened] = useState(false);
    const [commentContent, setcommentContent] = useState(props.comment.content);
    const [comment, setcomment] = useState(props.comment);
    const [visible, setvisible] = useState(true);

    useEffect(() => {
        setcommentContent(props.comment.content)
    }, [props.comment])

    let flashHandle = (message) => {
        setflashMessage(message);
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

    let deleting = () => {
        const token = getToken();
        axios({
            method: 'delete',
            url: `${MAIN_URI}/comments/delete/${props.comment._id}`,
            headers: {'Authorization': token}
        })
        .then((res)=>{
            if(res.status===200){
                setvisible(false);
                flashHandle("comment deleted");
            }
        })
        .catch(error => {
            console.log(error);
        })
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
            {visible ? (
                <div className={classes.commentContainer}>
                <div className={classes.topBar}>   
                    <div className={classes.userPhotoDiv}>
                        <Link to={"/user/profile/?id="+props.comment.author}>
                            <UserPhoto userId={props.comment.author} small hideOnlineIcon/>
                        </Link>
                    </div>
                    <p className={props.authorClassArr}>
                        <Link to={"/user/profile/?id="+props.comment.author}>
                            @{props.comment.authorNick}
                        </Link>
                    </p>
                    <p>{formattedCurrentDate(props.comment.createdAt)}</p>
                    <div className={classes.positionNumberContainer}>
                        <LikesCommentsNumbers objectId={props.comment._id} userId={props.comment.author} small={props.small}/>
                    </div>
                    {
                        (props.userId === props.comment.author) ? 
                        (<>
                            <div className={classes.optionsDiv} onClick={()=>setoptionsOpened(!optionsOpened)}>
                                <BsThreeDots size="1.5em" color="#0a42a4" className={classes.threeDotsIcon}/>
                                { optionsOpened ? (
                                    <div className={classes.optionsContainer}>
                                        <option onClick={()=>setediting(true)} style={{color: "black"}}>edit</option>
                                        <option onClick={deleting} style={{color: "black"}}>delete</option>
                                    </div>
                                ) : null }
                            </div>
                        </>) : null
                    }
                    </div>
                    {
                        editing ? (
                            <EditCommentForm 
                                commentId={props.comment._id} 
                                flashProp={flashHandle} 
                                commentContent={props.comment.content} 
                                afterEdit={(newContent)=>{
                                    setcommentContent(newContent);
                                    setediting(false); //close editing form
                                }} 
                                cancelEdit={()=>setediting(false)}
                                initialValue={commentContent}
                            />
                        ) : <p className={classes.commentContent}>{commentContent}</p>
                    }
                </div>
            ) : null}
            {flash}
        </React.Fragment>
    );
}
 
export default Comment;

    //      const token = getToken();
    //     axios({
    //         method: 'get',
    //         url: `http://localhost:3001/comments/one/${props.comment._id}`,
    //         headers: {'Authorization': token}
    //     })
    //     .then((res)=>{
    //         if(res.status===200){
    //             setcomment(res.data.comment);
    //             return;
    //         }
    //     })
    //     .catch(error => {
    //         console.log(error);
    //     })