import React, { Component } from 'react';
import axios from 'axios';
import { MAIN_URI } from '../../../../config';

import classes from './comments.module.css';
import Button from '../../../../components/UI/button';
import AddCommentForm from '../../../../components/UI/AddCommentForm';
import Comment from './comment';

import getToken from '../../../../getToken';
import getUserData from '../../../../getUserData';

class Comments extends Component {
    constructor(props){
        super(props);
        let token = getToken();
        let userData = getUserData();

        this.state = {
            test: '',
            token: token,
            userData: userData,
            limit: 0,
            blogId: props.blogId,
            comments: [],
        }

        this.loadmorehandler.bind(this);
        this.getComments.bind(this);
        this.addComment.bind(this);
    }

    componentDidMount(){
        this.getComments();
    }

    componentDidUpdate(prevProps){
        if(prevProps.refresh !== this.props.refresh){
            this.getComments();
        }
    }

    addComment = (newComment) => {
        let newComments = this.state.comments;
        newComments.unshift(newComment);
        this.setState({comments: newComments});
    }

    getComments = (newLimit) => {
        let limit = this.state.limit;
        if(newLimit){
            this.setState({limit: newLimit});
            limit = newLimit;
        }

        axios({
            method: 'post',
            url: `${MAIN_URI}/comments/limited`,
            headers: {'Authorization': this.state.token},
            data: {
                limit: limit,
                blogId: this.state.blogId
            }
        })
        .then((res)=>{
            if(res.status===200){
                let comments = this.state.comments;
                let newComments = comments.concat(res.data.comments)
                this.setState({comments: newComments})
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    loadmorehandler = () => {
        let newLimit = this.state.limit+4;
        this.getComments(newLimit);
    }

    render() { 
        let authorClassArr = classes.commentAuthor;
        let setSmall = false;
        if(this.props.small) {
            authorClassArr = [classes.smallAuthorClass, classes.commentAuthor].join(" ");
            setSmall = true;
        }
    
        return (
            <div className={classes.commentsContainer}>
                <AddCommentForm 
                    blogId={this.state.blogId} 
                    blogAuthorId={this.props.blogAuthorId} 
                    afterSend={this.addComment} 
                    small={setSmall}
                />
                {
                    this.state.comments.map((comment, index) => { 
                        return ( 
                            <Comment 
                                key={index}
                                comment={comment}
                                authorClassArr={authorClassArr}
                                userId={this.state.userData._id}
                                small={this.props.small}
                            />    
                        )
                    })
                }
                <Button clicked={this.loadmorehandler}>Load more comments</Button>
            </div>
        );
    }
}

export default Comments;