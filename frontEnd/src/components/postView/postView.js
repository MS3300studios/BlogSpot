import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

import Comments from '../../containers/userProfile/tabs/comments/comments';
import * as actionTypes from '../../store/actions';
import Spinner from '../UI/spinner';
import classes from './postView.module.css';
import Button from '../UI/button';
import PostForm from '../UI/PostForm';
import Backdrop from '../UI/backdrop';
import formattedCurrentDate from '../../formattedCurrentDate';
import getUserData from '../../getUserData';

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
            redirect: false,
            loading: true,
            userData: userData,
            deletePending: false,
            showPostForm: false
        }

        this.deletePost.bind(this);
        this.displayPostForm.bind(this);
        this.cleanUpEditSucc.bind(this);
    }

    componentDidMount(){
        console.log(this.state.userData)
        axios({
            method: 'get',
            url: `http://localhost:3001/blogs/one/${this.state.postId}`,
            headers: {'Authorization': this.state.token},
        }).then((res) => {
            this.setState({loading: false});
            const post = {
                author: this.state.userData.nickname,
                title: res.data.blog.title,
                content: res.data.blog.content,
                createdAt: res.data.blog.createdAt,
                updatedAt: res.data.blog.updatedAt
            };
            this.setState({post: post});
        })
        .catch(error => {
            console.log(error);
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
        }).then((res) => {
            if(res.status===200){
                this.setState({redirect: true, deletePending: false});
                // this.props.redux_remove_post(id);
            }
            else{
                console.error('deleting error');
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    

    render() { 
        let smallSpinner = this.state.deletePending ? <Spinner small darkgreen /> : null;

        let info;
        if(this.state.loading){
            info = <Spinner />
        }
        else {
            info = (
                <div className={classes.blogCards}>
                            <div className={classes.blogFaceContainer}>
                                <div className={classes.blogFace}>
                                    <p className={classes.postTitle}>{this.state.post.title}</p>
                                    <p className={classes.postAuthor}>@{this.state.post.author}</p>
                                    <p>started at: {formattedCurrentDate(this.state.post.createdAt)}</p>
                                    <p>latest edit: {formattedCurrentDate(this.state.post.updatedAt)}</p>
                                    <div className={classes.btnsContainer}>
                                        <Button clicked={this.displayPostForm}>Edit</Button>
                                        <Button clicked={()=>this.deletePost(this.state.postId)}>Delete</Button>
                                        <div className={classes.smallSpinnerLocation}>
                                            {smallSpinner}
                                        </div>
                                    </div>
                                </div>
                                <div className={[classes.blogFace, classes.commentsContainer].join(" ")}>
                                    <Comments blogId={this.state.postId} />
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
 
const mapStateToProps = state => {
    return {
        posts: state.posts,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        redux_add_post: (post) => dispatch({type: actionTypes.ADD_POST, data: post}),
        redux_remove_post: (post_id) => dispatch({type: actionTypes.REMOVE_POST, id: post_id})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PostView));




// titleChanged={this.titleChangedHandler} 
// contentChanged={this.contentChangedHandler}