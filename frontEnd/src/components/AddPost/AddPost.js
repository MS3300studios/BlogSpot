import React, { useState } from 'react';

import classes from './AddPost.module.css';

import axios from 'axios';
import getToken from '../../getToken';
import Button from '../UI/button';
import Flash from '../UI/flash';
import { Redirect } from 'react-router';
import PostForm from '../UI/PostForm';


const AddPost = (props) => {
    const [Title, setTitle] = useState("");
    const [Content, setContent] = useState("");
    const [redirectToMyActivity, setredirectToMyActivity] = useState(false);
    const [flashNotClosed, setflashNotClosed] = useState(true);
    const [flashMessage, setflashMessage] = useState("");
    const [redirectToSocialBoard, setredirectToSocialBoard] = useState(false);

    const flash = (message) => {
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

    const sendData = () => {
        if(Title === "" || Content === ""){
            flash("you cannot send an empty post");
        }
        else{
            const token = getToken();
            axios({
                method: 'post',
                url: `http://localhost:3001/blogs/new`,
                params: {},
                headers: {'Authorization': token},
                data: {
                    title: Title, //data is equivalent to req.body inside the server
                    content: Content
                }
            })
            .then((res)=>{
                if(res.status===200){
                    setredirectToMyActivity(true);
                }
            })
            .catch(error => {
                console.log('inside posts form: \n', error);
            })
        }
    }


    let flashContent = null;
    if(flashMessage && flashNotClosed){
        flashContent = <Flash>{flashMessage}</Flash>
    }
    else if(flashMessage && flashNotClosed === false){
        flashContent = <Flash close>{flashMessage}</Flash>
    }


    return (
        <div className={classes.mainContainer}>
            <div className={classes.center}>
                <h1>Add a post</h1>
            </div>
            <div className={classes.center}>
                <input 
                    type="text" 
                    placeholder="your title here!" 
                    className={classes.Input} 
                    onChange={(e)=> setTitle(e.target.value)} 
                    value={Title}
                />
            </div>
            <div className={classes.center}>
                <textarea 
                    placeholder="your blog here!" 
                    className={classes.Textarea} 
                    onChange={(e)=> setContent(e.target.value)}
                    value={Content}>
                </textarea>
            </div>
            <div className={classes.buttonsContainer}>
                <Button btnType="Cancel" clicked={()=>setredirectToSocialBoard(true)}>Cancel</Button>
                <Button btnType="Continue" clicked={sendData}>Continue</Button>
            </div>
            {
                flashContent
            }
            {
                redirectToMyActivity ? <Redirect to="/user/activity"/> : null
            }
            {
                redirectToSocialBoard ? <Redirect to="/"/> : null
            }
        </div>
    );
}
 
export default AddPost;