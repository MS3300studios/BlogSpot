import React, { useState } from 'react';
import axios from 'axios';
import getToken from '../../getToken';
import Flash from './flash';
import { FiSend } from 'react-icons/fi' 
import classes from './AddCommentForm.module.css';

const AddCommentForm = () => {
    let token = getToken();
    const [content, setcontent] = useState();
    const [ready, setready] = useState();
    const [flashMessage, setflashMessage] = useState("");
    const [flashNotClosed, setflashNotClosed] = useState(true);

    let flash = (message) => {
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

    let sendComment = (content) => {
        axios({
            method: 'post',
            url: `http://localhost:3001/comments/new`,
            headers: {'Authorization': token},
            data: {
                content: content
            }
        })
        .then((res)=>{
            if(res.status===200){
                flash("you posted a comment!");
                return;
            }
        })
        .catch(error => {
            flash(error);
            console.log(error);
        })
    }   

    let flashView = null;
    if(flashMessage && flashNotClosed){
        flashView = <Flash>{flashMessage}</Flash>
    }
    else if(flashMessage && flashNotClosed === false){
        flashView = <Flash close>{flashMessage}</Flash>
    }

    return (
        <React.Fragment>
            <div className={classes.mainContainer}>
                <form>
                    <input placeholder="write your comment here" onClick={(event)=>setcontent(event.target.value)}/>
                </form>
                <div onClick={() => sendComment(content)} className={classes.sendIcon}>
                    <FiSend size="2em"/>
                </div>
            </div>
            {flashView}
        </React.Fragment>
    );
}
 
export default AddCommentForm;