import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import axios from 'axios';

import * as actionTypes from '../../store/actions';
import Spinner from '../../components/UI/spinner';
import classes from './postView.module.css';
import Button from '../UI/button';


class PostView extends Component {
    constructor(props){
        super(props);
        
        //getting Id from search param
        let queryParams = new URLSearchParams(this.props.location.search);
        let postId = queryParams.get('id'); 

        //getting user nickname
        let userData;
        let local = localStorage.getItem('userData');
        let session = sessionStorage.getItem('userData');
        if(local !== null){
            userData = JSON.parse(local);
        }
        else if(session !== null){
            userData = JSON.parse(session);
        }

        this.state = {
            postId: postId,
            post: {},
            redirect: false,
            loading: true,
            userData: userData,
            deletePending: false
        }

        this.deletePost.bind(this);
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

    componentDidMount(){
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
                                    <p>started at: {this.state.post.createdAt}</p>
                                    <p>latest edit: {this.state.post.updatedAt}</p>
                                    <div className={classes.btnsContainer}>
                                        <Button disabled>Edit</Button>
                                        <Button clicked={()=>this.deletePost(this.state.postId)}>Delete</Button>
                                        <div className={classes.smallSpinnerLocation}>
                                            {smallSpinner}
                                        </div>
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