import React, { useState } from 'react';
import axios from 'axios';
import getToken from '../../getToken';

import { FiSend } from 'react-icons/fi' 

import classes from './AddCommentForm.module.css';

const AddCommentForm = () => {
    let token = getToken();
    const [content, setcontent] = useState();
    const [ready, setready] = useState();

    let sendComment = (content) => {
        axios({
            method: 'post',
            url: `http://localhost:3001/`,
            headers: {'Authorization': token},
            data: {
                content: content
            }
        })
        .then((res)=>{
            if(res.status===200){
                
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    }   

    return (
        <div className={classes.mainContainer}>
            <form>
                <input placeholder="write your comment here" onClick={(event)=>setcontent(event.target.value)}/>
            </form>
            <div className={classes.send} onClick={() => sendComment(content)}>
                <FiSend />
            </div>
        </div>
    );
}
 
export default AddCommentForm;