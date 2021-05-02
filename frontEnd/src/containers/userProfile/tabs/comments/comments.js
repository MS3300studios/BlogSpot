import React, { Component } from 'react';
import axios from 'axios';

import classes from './comments.module.css';
import Button from '../../../../components/UI/button';
import AddCommentForm from '../../../../components/UI/AddCommentForm';

import { FaCommentAlt } from 'react-icons/fa';
import { AiFillLike, AiFillDislike } from 'react-icons/ai'
import getToken from '../../../../getToken';


class Comments extends Component {
    constructor(props){
        super(props);
        let token = getToken();

        this.state = {
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
        console.log("getting more comments!");
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
                let comments = [];
                res.data.comments.forEach(element => {
                    comments.push(element);
                });
                this.setState({comments: comments});
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    loadmorehandler = () => {
        this.setState((prevState) => {
            return {
                ...prevState,
                limit: prevState.limit+2
            }
        })
    }

    render() { 
        let comments = this.state.comments.map((comment, index) => {
            return ( 
                <React.Fragment key={index}>
                    <div className={classes.commentContainer} key={index}>
                        <div className={classes.topBar}>    
                            <p className={classes.commentAuthor}>@{comment.authorNick}</p>

                            <div className={classes.numberInfoContainer}>
                                <div className={classes.numberInfoInnerContainer}>
                                    <div className={[classes.iconDataContainer, classes.likeIconPContainer].join(" ")}>
                                        <AiFillLike size="1em" color="#0a42a4" className={classes.icon}/>
                                        <p className={classes.likeP}>5</p>
                                    </div>
                                    <div className={classes.iconDataContainer}>
                                        <AiFillDislike size="1em" color="#0a42a4" className={classes.icon}/>
                                        <p className={classes.dislikeP}>0</p>
                                    </div>
                                    <div className={classes.iconDataContainer}>
                                        <FaCommentAlt size="1em" color="#0a42a4" className={classes.icon}/>
                                        <p>10</p>
                                    </div>
                                </div>
                            </div>

                            <p>{comment.createdAt}</p>
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
 
export default Comments;