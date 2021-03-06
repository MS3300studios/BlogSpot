import React, { Component } from 'react';
import { Redirect, withRouter, Link } from 'react-router-dom';
import axios from 'axios';
import { MAIN_URI } from '../../config';


import Comments from '../../containers/userProfile/tabs/comments/comments';
import Spinner from '../UI/spinner';
import Button from '../UI/button';
import PostForm from '../UI/PostForm';
import Backdrop from '../UI/backdrop';
import formattedCurrentDate from '../../formattedCurrentDate';
import LikesCommentsNumbers from '../UI/likesCommentsNumbers';

import getUserData from '../../getUserData';
import getColor from '../../getColor';

import classes from './postView.module.css';
import greenClasses from './greenClasses.module.css';
import blueClasses from './blueClasses.module.css';
import getMobile from '../../getMobile';

const colorScheme = getColor();
let colorClasses = greenClasses;
if(colorScheme === "blue"){
    colorClasses = blueClasses;
}

class PostView extends Component {
    constructor(props){
        super(props);
        
        //getting Id from search param
        let queryParams = new URLSearchParams(this.props.location.search);
        let postId = queryParams.get('id'); 

        //getting user nickname
        let userData = getUserData();

        this.state = {
            postId: postId,
            post: {},
            error: null,
            authorData: null,
            redirect: false,
            loading: true,
            userData: userData,
            deletePending: false,
            showPostForm: false
        }

        this.deletePost.bind(this);
        this.displayPostForm.bind(this);
        this.cleanUpEditSucc.bind(this);
        this.getBlogOnInit.bind(this);

        this.isMobile = getMobile();
    }

    componentDidMount(){
        this.getBlogOnInit(this.state.postId);
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.location.search !== prevProps.location.search){
            /* let queryParams = new URLSearchParams(this.props.location.search);
            let postId = queryParams.get('id'); 
            this.setState({postId: postId});
            this.getBlogOnInit(postId); */
            window.location.reload();
        }
    }

    getBlogOnInit = (postId) => {
        axios({
            method: 'get',
            url: `${MAIN_URI}/blogs/one/${postId}`,
            headers: {'Authorization': this.state.token},
        }).then((res) => {
            const post = {
                author: res.data.blog.author,
                title: res.data.blog.title,
                content: res.data.blog.content,
                createdAt: res.data.blog.createdAt,
                updatedAt: res.data.blog.updatedAt
            };
            this.setState({loading: false, post: post, authorData: res.data.authorData});
        })
        .catch(error => {
            console.log(error.message === "Request failed with status code 404");
            this.setState({loading: false, error: "404: this blog doesn't exist anymore"});
        }) 
    }

    displayPostForm = () => {
        this.setState({showPostForm: true});
    }
    
    cleanUpEditSucc = () => {
        this.setState({showPostForm: false});
        window.location.reload();
    }

    deletePost = (id) => {
        this.setState({deletePending: true});
        axios({
            method: 'delete',
            url: `${MAIN_URI}/blogs/delete/${id}`,
            headers: {'Authorization': this.state.token},
        })
        .catch(error => {
            console.log('error deleting post')
            console.log(error);
        });

        this.setState({deletePending: false, redirect: true});
    }

    render() { 
        let smallSpinner = this.state.deletePending ? <Spinner small darkgreen /> : null;

        let info;
        if(this.state.loading){
            info = <Spinner />
        }
        else if(this.state.error !== null){
            info = (
                <div style={{display: "flex", alignItems: "center"}}>
                    <h1 style={{color: "white", marginRight: "2vw"}}>{this.state.error}</h1>
                    <Link to="/" style={{color: 'unset', textDecoration: "none"}}>
                        <Button>Back to main page</Button>
                    </Link>
                </div>
            )
        }
        else {
            info = (
                <div className={classes.blogCards}>
                    <div className={classes.blogFaceContainer}>
                        <div className={colorClasses.blogFace}>
                            <p className={classes.postTitle}>{this.state.post.title}</p>
                            <div className={classes.userDataContainer}>
                                <img className={classes.userPhoto} src={this.state.authorData.photo} alt="users face"/>
                                <Link to={"/user/profile/?id="+this.state.authorData._id} className={classes.userProfileLink}>
                                    <p className={classes.postAuthor}>@{this.state.authorData.nickname}</p>
                                </Link>
                            </div>
                            <p>started at: {formattedCurrentDate(this.state.post.createdAt)}</p>
                            <p>latest edit: {formattedCurrentDate(this.state.post.updatedAt)}</p>
                            <div className={classes.positionSocialData}>
                                <LikesCommentsNumbers 
                                    objectId={this.state.postId} 
                                    userId={this.state.authorData._id} 
                                    comments 
                                    objectIsBlog 
                                />
                            </div>
                            {
                                this.state.userData._id === this.state.post.author ? (
                                    <div className={classes.btnsContainer}>
                                        <Button clicked={this.displayPostForm}>Edit</Button>
                                        <Button clicked={()=>this.deletePost(this.state.postId)}>Delete</Button>
                                        <div className={classes.smallSpinnerLocation}>
                                            {smallSpinner}
                                        </div>
                                    </div>
                                ) : <div style={{marginBottom: "25px"}}></div>
                            }
                        </div>
                        <div className={[classes.blogFace, colorClasses.commentsContainer].join(" ")}>
                            <Comments blogId={this.state.postId} blogAuthorId={this.state.authorData._id} small/>
                        </div>
                    </div>
                    <div className={colorClasses.cardBig} >
                        <p>{this.state.post.content}</p>
                    </div>
                </div>
            )
        }
        
        let formForBlogs = null;
        if(this.state.showPostForm){
            formForBlogs = (
                <React.Fragment>
                    <Backdrop show>
                        <PostForm 
                            closeBackdrop={()=>this.setState({showPostForm: false})} 
                            editing
                            editPostTitle={this.state.post.title}
                            editPostContent={this.state.post.content}
                            editId={this.state.postId}
                            editFunction={this.cleanUpEditSucc}
                        />
                    </Backdrop>
                </React.Fragment>
            );
        }


        return (
            <div className={this.isMobile ? null : classes.MainContainer}>
                {this.state.redirect ? <Redirect to="/" /> : null}
                {formForBlogs}
                {
                    this.isMobile && !this.state.loading ? (
                        <div style={{overflowX: "hidden"}}>
                            <div>
                                <div>
                                    <div style={{color: "white", padding: "10px"}}>
                                        <p className={classes.postTitle}>{this.state.post.title}</p>
                                        <div className={classes.userDataContainer}>
                                            <img className={classes.userPhoto} src={this.state.authorData.photo} alt="users face"/>
                                            <Link to={"/user/profile/?id="+this.state.authorData._id} className={classes.userProfileLink}>
                                                <p className={classes.postAuthor}>@{this.state.authorData.nickname}</p>
                                            </Link>
                                        </div>
                                        <p>started at: {formattedCurrentDate(this.state.post.createdAt)}</p>
                                        <p>latest edit: {formattedCurrentDate(this.state.post.updatedAt)}</p>
                                        {
                                            this.state.userData._id === this.state.post.author ? (
                                                <div className={classes.btnsContainer} style={{marginTop: "10px"}}>
                                                    <Button clicked={this.displayPostForm}>Edit</Button>
                                                    <Button clicked={()=>this.deletePost(this.state.postId)}>Delete</Button>
                                                    <div className={classes.smallSpinnerLocation}>
                                                        {smallSpinner}
                                                    </div>
                                                </div>
                                            ) : <div style={{marginBottom: "25px"}}></div>
                                        }
                                    </div>
                                    <hr />
                                    <div style={{overflowWrap: "anywhere", padding: "5px", fontSize: "20px", color: "white"}}>
                                        <p>{this.state.post.content}</p>
                                    </div>
                                    <hr style={{marginBottom: "20px"}}/>
                                    <div className={classes.positionSocialData} style={{marginBottom: "50px", width: "88%", marginTop: '-25px'}}>
                                        <LikesCommentsNumbers 
                                            objectId={this.state.postId} 
                                            userId={this.state.authorData._id} 
                                            comments 
                                            objectIsBlog 
                                        />
                                    </div>
                                </div>
                                <div className={[classes.blogFace, colorClasses.commentsContainer].join(" ")} style={{width: "90%", display: "flex", justifyContent: "center"}}>
                                    <Comments blogId={this.state.postId} blogAuthorId={this.state.authorData._id} small/>
                                </div>
                            </div>
                        </div>
                    ) : <>{info}</>
                }
            </div>
        );
    }
}
 

export default withRouter(PostView);