import React from 'react';
import {useState} from 'react';
import axios from 'axios';

import getToken from '../../getToken';
import imageX from '../../assets/gfx/x.png';
import classes from './PostForm.module.css';
import Button from './button';

const PostForm = (props) => {
    let editingTitle;
    let editingContent;
    if(props.editing){
        editingTitle = props.editPostTitle;
        editingContent = props.editPostContent;
    }

    let token = getToken();

    const [title, setTitle] = useState(editingTitle);
    const [content, setContent] = useState(editingContent);

    let submitEdit = (event) => {
        event.preventDefault();
        let blogId = props.editId;
        axios({
            method: 'post',
            url: `http://localhost:3001/blogs/edit/${blogId}`,
            params: {},
            headers: {'Authorization': token},
            data: {
                title: title, //data is equivalent to req.body inside the server
                content: content
            }
        })
        .then((res)=>{
            if(res.status===200){
                props.editFunction();
            }
        })
        .catch(error => {
            console.log('inside posts form: \n', error);
        })
    }

    if(props.editing){
        return ( 
            <div className={classes.addPostFormContainer}>
                <img alt="exit adding post" src={imageX} title="close" onClick={props.closeBackdrop} className={classes.imageX}/>
                <form>
                    <input 
                        type="text" 
                        placeholder="your title here!" 
                        className={classes.Input} 
                        onChange={(e)=> setTitle(e.target.value)} 
                        value={title}/>
                    <br/>
                    <textarea 
                        cols="120" 
                        rows="30" 
                        placeholder="your blog here!" 
                        className={classes.Textarea} 
                        onChange={(e)=> setContent(e.target.value)}
                        value={content}>
                    </textarea>
                    <br/>
                    <div className={classes.btnsContainer}>                    
                        <Button btnType="Continue" clicked={submitEdit}>Submit</Button>
                        <Button btnType="Cancel" clicked={props.closeBackdrop}>Cancel</Button>
                    </div>
                </form>
            </div>
        );
    }
    else{
        return ( 
            <div className={classes.addPostFormContainer}>
                <img alt="exit adding post" src={imageX} title="close" onClick={props.closeBackdrop} className={classes.imageX}/>
                <form>
                    <input type="text" placeholder="your title here!" className={classes.Input} onChange={props.titleChanged}/>
                    <br/>
                    <textarea cols="120" rows="30" placeholder="your blog here!" className={classes.Textarea} onChange={props.contentChanged}></textarea>
                    <br/>
                    <div className={classes.btnsContainer}>                    
                        <Button btnType="Continue" clicked={props.addPost}>Submit</Button>
                        <Button btnType="Cancel" clicked={props.closeBackdrop}>Cancel</Button>
                    </div>
                </form>
            </div>
        );
    }
}
 
export default PostForm;