import React from 'react';
import {useState} from 'react';
import axios from 'axios';
import { MAIN_URI } from '../../config';


import getToken from '../../getToken';
import imageX from '../../assets/gfx/x.png';
import classes from './PostForm.module.css';
import Button from './button';
import getColor from '../../getColor';
import getMobile from '../../getMobile';

const colorScheme = getColor();

const PostForm = (props) => {
    let editingTitle;
    let editingContent;
    if(props.editing){
        editingTitle = props.editPostTitle;
        editingContent = props.editPostContent;
    }

    const token = getToken();
    const isMobile = getMobile();

    const [title, setTitle] = useState(editingTitle);
    const [content, setContent] = useState(editingContent);

    let submitEdit = (event) => {
        event.preventDefault();
        let blogId = props.editId;
        axios({
            method: 'post',
            url: `${MAIN_URI}/blogs/edit/${blogId}`,
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

    let backgroundColor = {backgroundColor: "#82ca66"};
    if(colorScheme === "blue"){
        backgroundColor = {backgroundColor: "hsl(210deg 66% 52%)"};
    }
    

    if(props.editing){
        return (
            <>
                {
                    isMobile ? (
                        <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <div style={{...backgroundColor, padding: "10px", width: "85%", borderRadius: "10px"}}>
                                <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
                                    <input 
                                        type="text" 
                                        placeholder="your title here!" 
                                        onChange={(e)=> setTitle(e.target.value)} 
                                        value={title}
                                        style={{width: "90%", borderRadius: "10px", padding: "5px", fontSize: "20px", fontWeight: "500", border: "none"}}
                                    />
                                </div>
                                <div style={{display: "flex", justifyContent: "center", width: "100%", marginTop: "10px"}}>
                                    <textarea 
                                        placeholder="your blog here!" 
                                        onChange={(e)=> setContent(e.target.value)}
                                        value={content}
                                        style={{width: "90%", minHeight: "200px", borderRadius: "10px", padding: "5px", fontSize: "16px", fontWeight: "450", border: "none", fontFamily: "inherit"}}
                                    >
                                    </textarea>
                                </div>
                                <div style={{display: "flex", justifyContent: "space-evenly", marginTop: "10px"}}>                    
                                    <Button btnType="Continue" clicked={submitEdit}>Submit</Button>
                                    <Button btnType="Cancel" clicked={props.closeBackdrop}>Cancel</Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={classes.addPostFormContainer} style={backgroundColor}>
                            <img alt="exit adding post" src={imageX} title="close" onClick={props.closeBackdrop} className={classes.imageX}/>
                            <h1>wdawadw</h1>
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
                    )
                }
            </> 
        );
    }
    else{
        return ( 
            <>
                {
                    isMobile ? (
                        <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <div style={{...backgroundColor, padding: "10px", width: "85%", borderRadius: "10px"}}>
                                <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
                                    <input 
                                        type="text" 
                                        placeholder="your title here!" 
                                        onChange={props.titleChanged} 
                                        value={title}
                                        style={{width: "90%", borderRadius: "10px", padding: "5px", fontSize: "20px", fontWeight: "500", border: "none"}}
                                    />
                                </div>
                                <div style={{display: "flex", justifyContent: "center", width: "100%", marginTop: "10px"}}>
                                    <textarea 
                                        placeholder="your blog here!" 
                                        onChange={props.contentChanged}
                                        value={content}
                                        style={{width: "90%", minHeight: "200px", borderRadius: "10px", padding: "5px", fontSize: "16px", fontWeight: "450", border: "none", fontFamily: "inherit"}}
                                    >
                                    </textarea>
                                </div>
                                <div style={{display: "flex", justifyContent: "space-evenly", marginTop: "10px"}}>                    
                                    <Button btnType="Continue" clicked={props.addPost}>Submit</Button>
                                    <Button btnType="Cancel" clicked={props.closeBackdrop}>Cancel</Button>
                                </div>
                            </div>
                        </div>
                    ) : (
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
                    )
                }
            </>
        );
    }
}
 
export default PostForm;