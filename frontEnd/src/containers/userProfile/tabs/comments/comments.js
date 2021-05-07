import React, { Component } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';

import classes from './comments.module.css';
import Button from '../../../../components/UI/button';
import AddCommentForm from '../../../../components/UI/AddCommentForm';
import LikesCommentsNumbers from '../../../../components/UI/likesCommentsNumbers';
import UserPhoto from '../../../../components/UI/userphoto';

import getToken from '../../../../getToken';
import formattedCurrentDate from '../../../../formattedCurrentDate';


class Comments extends Component {
    constructor(props){
        super(props);
        let token = getToken();

        this.state = {
            test: '',
            token: token,
            limit: 2,
            blogId: props.blogId,
            comments: []
        }

        this.loadmorehandler.bind(this);
        this.getComments.bind(this);
    }

    componentDidMount(){
        this.getComments();
    }

    getComments = (newLimit) => {
        let limit = this.state.limit;
        if(newLimit){
            this.setState({limit: newLimit});
            limit = newLimit;
        }

        axios({
            method: 'post',
            url: `http://localhost:3001/comments/limited`,
            headers: {'Authorization': this.state.token},
            data: {
                limit: limit,
                blogId: this.state.blogId
            }
        })
        .then((res)=>{
            if(res.status===200){
                let commentsRdy = [];
                res.data.comments.forEach(element => {
                    commentsRdy.push(element);
                });
                this.setState({comments: commentsRdy})
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    loadmorehandler = () => {
        let newLimit = this.state.limit+2;
        this.getComments(newLimit);
    }

    render() { 
        let authorClassArr = classes.commentAuthor;
        let smallStylesForLikes = false;
        if(this.props.small) {
            authorClassArr=[classes.smallAuthorClass, classes.commentAuthor].join(" ");
            smallStylesForLikes = true;
        }
        let comments = this.state.comments.map((comment, index) => { 
            return ( 
                <React.Fragment key={index}>
                    <div className={classes.commentContainer} key={index}>
                        <div className={classes.topBar}>   
                            <div className={classes.userPhotoDiv}>
                                <a href={"/user/profile/?id="+comment.author}>
                                    <UserPhoto userId={comment.author} small />
                                </a>
                            </div>
                            <p className={authorClassArr}>
                                <a href={"/user/profile/?id="+comment.author}>@{comment.authorNick}</a>
                            </p>
                            <LikesCommentsNumbers blogId={this.state.blogId} small={smallStylesForLikes}/>
                            <p>{formattedCurrentDate(comment.createdAt)}</p>
                        </div>
                        <p className={classes.commentContent}>{comment.content}</p>
                    </div>
                </React.Fragment>                
            )
        })

        return (
            <div className={classes.commentsContainer}>
                <AddCommentForm blogId={this.state.blogId} afterSend={this.getComments}/>
                {comments}
                <Button clicked={this.loadmorehandler}>Load more comments</Button>
            </div>
        );
    }
}
 
export default withRouter(Comments);