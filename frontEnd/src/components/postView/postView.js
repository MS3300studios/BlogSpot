import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';

import * as actionTypes from '../../store/actions';
import Spinner from '../../components/UI/spinner';
import classes from './postView.module.css';
import Button from '../UI/button';


class PostView extends Component {
    constructor(props){
        super(props);
        let queryParams = new URLSearchParams(this.props.location.search);
        let postId = queryParams.get('id'); 

        this.state = {
            postId: postId,
            post: {},
            redirect: false,
            loading: true
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
        axios({
            method: 'get',
            url: `http://localhost:3001/blogs/one/${this.state.postId}`,
            headers: {'Authorization': this.state.token},
        }).then((res) => {
            this.setState({loading: false});
            console.log(res.data.blog.title)
            const post = {
                author: res.data.blog.author,
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

    render() { 
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
                                    <p>started at: {this.state.post.createdAt}</p>
                                    <p>latest edit: {this.state.post.updatedAt}</p>
                                    <div className={classes.btnsContainer}>
                                        <Button disabled>Edit</Button>
                                        <Button clicked={()=>this.deletePost(this.state.postId)}>Delete</Button>
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
                                <p>{this.state.post.content}</p>
                            </div>
                        </div>
            )
        }
        
        return (
            <div className={classes.MainContainer}>
                {info}
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