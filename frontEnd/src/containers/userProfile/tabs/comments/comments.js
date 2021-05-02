import React, { Component } from 'react';

import classes from './comments.module.css';
import Button from '../../../../components/UI/button';
import AddCommentForm from '../../../../components/UI/AddCommentForm';

class Comments extends Component {
    constructor(props){
        super(props);
        this.state = {
            limit: 2,
            blogId: props.blogId,
            comments: [
                {
                    content: "first comment of the year! Yeeha!",
                    authorNick: "Reshala23",
                    createdAt: "20-12-2009"
                },
                {
                    content: "Really? So Boring",
                    authorNick: "AdamPain",
                    createdAt: "23-03-2009"
                },
                {
                    content: "Alright whatever",
                    authorNick: "Json293",
                    createdAt: "20-12-2011"
                }
            ]
        }

        this.loadmorehandler.bind(this);
    }

    componentDidMount(){
        //populate state.comments with comments
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
            if(index === this.state.limit){
                return null;
            }
            return ( 
                <React.Fragment>
                    <div className={classes.commentContainer} key={index}>
                        <div className={classes.topBar}>    
                            <p className={classes.commentAuthor}>@{comment.authorNick}</p>
                            <p>{comment.createdAt}</p>
                        </div>
                        <p>{comment.content}</p>
                    </div>
                </React.Fragment>                
            )
        })


        return (
            <div className={classes.commentsContainer}>
                <AddCommentForm />
                {comments}
                <Button clicked={this.loadmorehandler}>Load more comments</Button>
            </div>
        );
    }
}
 
export default Comments;