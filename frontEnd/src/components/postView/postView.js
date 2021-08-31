import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import axios from 'axios';

import Comments from '../../containers/userProfile/tabs/comments/comments';
import Spinner from '../UI/spinner';
import classes from './postView.module.css';
import Button from '../UI/button';
import PostForm from '../UI/PostForm';
import Backdrop from '../UI/backdrop';
import formattedCurrentDate from '../../formattedCurrentDate';
import getUserData from '../../getUserData';
import LikesCommentsNumbers from '../UI/likesCommentsNumbers';

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
            url: `http://localhost:3001/blogs/one/${postId}`,
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
            this.setState({loading: false, error: error.message});
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
            url: `http://localhost:3001/blogs/delete/${id}`,
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
            info = <h1>{this.state.error}</h1>
        }
        else {
            info = (
                <div className={classes.blogCards}>
                    <div className={classes.blogFaceContainer}>
                        <div className={classes.blogFace}>
                            <p className={classes.postTitle}>{this.state.post.title}</p>
                            <div className={classes.userDataContainer}>
                                <img className={classes.userPhoto} src={this.state.authorData.photo} alt="users face"/>
                                <a href={"/user/profile/?id="+this.state.authorData._id} className={classes.userProfileLink}>
                                    <p className={classes.postAuthor}>@{this.state.authorData.nickname}</p>
                                </a>
                            </div>
                            <p>started at: {formattedCurrentDate(this.state.post.createdAt)}</p>
                            <p>latest edit: {formattedCurrentDate(this.state.post.updatedAt)}</p>
                            <div className={classes.positionSocialData}>
                                <LikesCommentsNumbers objectId={this.state.postId} userId={this.state.authorData._id} comments objectIsBlog />
                            </div>
                            <div className={classes.btnsContainer}>
                                <Button clicked={this.displayPostForm}>Edit</Button>
                                <Button clicked={()=>this.deletePost(this.state.postId)}>Delete</Button>
                                <div className={classes.smallSpinnerLocation}>
                                    {smallSpinner}
                                </div>
                            </div>
                        </div>
                        <div className={[classes.blogFace, classes.commentsContainer].join(" ")}>
                            <Comments blogId={this.state.postId} blogAuthorId={this.state.authorData._id} small/>
                        </div>
                    </div>
                    <div className={classes.cardBig} >
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
            <div className={classes.MainContainer}>
                {info}
                {formForBlogs}
                {this.state.redirect ? <Redirect to="/" /> : null}
            </div>
        );
    }
}
 

export default withRouter(PostView);