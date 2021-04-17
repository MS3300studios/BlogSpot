import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from '../../axios-setup';

import * as actionTypes from '../../store/actions';
import classes from './postView.module.css';
import Button from '../UI/button';


class PostView extends Component {
    constructor(props){
        super(props);
        this.state = {
            postId: null,
            post: null,
            redirect: false
        }

        this.deletePost.bind(this);
    }

    deletePost = (id) => {
        axios.delete(`./posts/${id}.json`)
        .then((res)=>{
            if(res.status===200){
                // this.flash("Post deleted successfully!");
                this.setState({redirect: true});
                this.props.redux_remove_post(id);
            }
            else{
                // this.flash("Network error, try again.");
                console.error('deleting error');
            }
        })
    }

    componentDidMount(){
        let queryParams = new URLSearchParams(this.props.location.search);
        let postId = queryParams.get('id');
        let info = this.props.posts.map((post, index)=>{
            if(post.id===postId){
                return(
                    <div className={classes.blogCards} key={index}>
                        <div className={classes.blogFaceContainer}>
                            <div className={classes.blogFace}>
                                <p className={classes.postTitle}>{post.title}</p>
                                <p className={classes.postAuthor}>@{post.author}</p>
                                <p>started at: {post.dateStarted}</p>
                                <p>latest edit: {post.latestEdit}</p>
                                <div className={classes.btnsContainer}>
                                    <Button disabled>Edit</Button>
                                    <Button clicked={()=>this.deletePost(postId)}>Delete</Button>
                                </div>
                            </div>
                            <div className={classes.blogFace}>
                                <p>comment comment comment</p>
                                <p>comment comment comment</p>
                                <p>comment comment comment</p>
                                <p>comment comment comment</p>
                            </div>
                        </div>
                        <div className={classes.cardBig} >
                            <p>{post.content}</p>
                        </div>
                    </div>
                )
            }
            else{
                return null;
            }
        })
        this.setState({postId: postId, post: info});
    }
    render() { 
        return (
            <div className={classes.MainContainer}>
                {this.state.post}
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