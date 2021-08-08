import React, { Component } from 'react';
import axios from 'axios';

import classes from './comments.module.css';
import Button from '../../../../components/UI/button';
import AddCommentForm from '../../../../components/UI/AddCommentForm';
import Comment from './comment';

import getToken from '../../../../getToken';
import getUserData from '../../../../getUserData';

import { connect } from 'react-redux';
// import * as actionTypes from '../../../../store/actions';

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
    }

    componentDidMount(){
        this.getComments();
    }

    componentDidUpdate(prevProps){
        if(prevProps.refresh !== this.props.refresh){
            this.getComments();
        }
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
                let comments = this.state.comments;
                let newComments = comments.concat(res.data.comments)
                console.log(res.data.comments)
                this.setState({comments: newComments})
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
        let setSmall = false;
        if(this.props.small) {
            authorClassArr = [classes.smallAuthorClass, classes.commentAuthor].join(" ");
            setSmall = true;
        }
        
        let comments = this.state.comments.map((comment, index) => { 
            return ( 
                <Comment 
                    key={index}
                    getComments={this.getComments}
                    comment={comment}
                    authorClassArr={authorClassArr}
                    userId={this.state.userData._id}
                    small={this.props.small}
                />         
            )
        })

        return (
            <div className={classes.commentsContainer}>
                <AddCommentForm blogId={this.state.blogId} afterSend={()=>{
                    this.getComments();
                    // this.props.redux_refresh_comments();
                }} small={setSmall}/>
                {comments}
                <Button clicked={this.loadmorehandler}>Load more comments</Button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        refresh: state.refreshComments
    };
}

// const mapDispatchToProps = dispatch => {
//     return {
//         redux_refresh_comments: () => dispatch({type: actionTypes.CHECK_STORE})
//     }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(Comments);
export default connect(mapStateToProps)(Comments);