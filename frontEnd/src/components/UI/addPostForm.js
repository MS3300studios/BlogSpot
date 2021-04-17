import React from 'react';
// import React, {useState} from 'react';

import imageX from '../../assets/gfx/x.png';
import classes from './addPostForm.module.css';
import Button from '../UI/button';

const AddPostForm = (props) => {
    // const [title, setTitle] = useState("");
    // const [content, setContent] = useState("");

    if(props.editing){
        return ( 
            <div className={classes.addPostFormContainer}>
                <img alt="exit adding post" src={imageX} title="close" onClick={props.closeBackdrop}/>
                <form>
                    <input 
                        type="text" 
                        placeholder="your title here!" 
                        className={classes.Input} 
                        onChange={props.titleChanged} 
                        value={props.editPostTitle}/>
                    <br/>
                    <textarea 
                        cols="120" 
                        rows="30" 
                        placeholder="your blog here!" 
                        className={classes.Textarea} 
                        onChange={props.contentChanged}
                        value={props.editPostContent}>
                    </textarea>
                    <br/>
                    <div className={classes.btnsContainer}>                    
                        <Button btnType="Continue" clicked={props.editFunction}>Submit</Button>
                        <Button btnType="Cancel" clicked={props.closeBackdrop}>Cancel</Button>
                    </div>
                </form>
            </div>
        );
    }
    else{
        return ( 
            <div className={classes.addPostFormContainer}>
                <img alt="exit adding post" src={imageX} title="close" onClick={props.closeBackdrop}/>
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
 
export default AddPostForm;