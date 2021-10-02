import React, { Component } from 'react';

import axios from 'axios';
import { MAIN_URI } from '../../config';


import { FaCommentAlt } from 'react-icons/fa';
import Like from '../UI/like';

import classes from './likesCommentsNumbers.module.css';
import getToken from '../../getToken';
import getUserData from '../../getUserData';

class LikesCommentsNumbers extends Component {
    constructor(props){
        super(props);

        const token = getToken();
        const userData = getUserData();

        this.state = {
            objectId: props.objectId,
            userId: props.userId,
            token: token,
            userData: userData,
            numberOfComments: 0,
            DislikeCount: 0,
            LikeCount: 0,
            LikeFill: false,
            DislikeFill: false,
        }
        this.getCommentsCount.bind(this);
        this.getLikesCount.bind(this);
        this.getFill.bind(this);
        this.sendAction.bind(this);
    }

    componentDidMount() {
        if(this.props.comments){
            this.getCommentsCount();
        }
        this.getLikesCount(true); //get dislikes count
        this.getLikesCount(false); //get likes count
        this.getFill();
    }

    componentDidUpdate(prevProps){
        if(prevProps.objectId !== this.props.objectId){
            if(this.props.comments){
                this.getCommentsCount();
            }
            this.getLikesCount(true); //get dislikes count
            this.getLikesCount(false); //get likes count
            this.getFill();
        }
    }

    getCommentsCount = () => {
        axios({
            method: 'post',
            url: `${MAIN_URI}/comments/getNumber`,
            headers: {'Authorization': this.state.token},
            data: {
                blogId: this.props.objectId
            }
        })
        .then((res)=>{
            if(res.status===200){
                this.setState({numberOfComments: res.data.count});
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    getLikesCount = (dislike) => {
        if(this.props.objectIsBlog){
            let url = `${MAIN_URI}/blogLike/count`;
            if(dislike) url = `${MAIN_URI}/blogDislike/count`;    
            axios({
                method: 'post',
                url: url,
                headers: {'Authorization': this.state.token},
                data: { blogId: this.props.objectId }
            })
            .then((res)=>{
                if(res.status===200){
                    if(dislike){
                        this.setState({DislikeCount: res.data.count});
                    }
                    else{
                        this.setState({LikeCount: res.data.count});
                    }
                }
            })
            .catch(error => {
                console.log(error);
            })
        }
        else{
            let url = `${MAIN_URI}/commentLike/count`;
            if(dislike) url = `${MAIN_URI}/commentDislike/count`;
    
            axios({
                method: 'post',
                url: url,
                headers: {'Authorization': this.state.token},
                data: { commentId: this.props.objectId }
            })
            .then((res)=>{
                if(res.status===200){
                    if(dislike){
                        this.setState({DislikeCount: res.data.count});
                    }
                    else{
                        this.setState({LikeCount: res.data.count});
                    }
                }
            })
            .catch(error => {
                console.log(error);
            })
        }
    }

    getFill = () => {
        let data = {commentId: this.props.objectId, type: "comment"}
        if(this.props.objectIsBlog){
            data = {blogId: this.props.objectId, type: "blog"}
        }

        axios({
            method: 'post',
            url: `${MAIN_URI}/checkIfLikedAlready`,
            headers: {'Authorization': this.state.token},
            data: data
        })
        .then((res)=>{
            if(res.status===200){
                if(res.data.response === "like"){
                    this.setState({LikeFill: true, DislikeFill: false});
                }
                else if(res.data.response === "dislike"){
                    this.setState({LikeFill: false, DislikeFill: true});
                }
                else if(res.data.response === "none"){
                    this.setState({LikeFill: false, DislikeFill: false});
                }
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    sendAction = (like) => {
        if(this.props.objectIsBlog){
            let url = `${MAIN_URI}/blogLike/upvote`;
            if(!like) url = `${MAIN_URI}/blogLike/downvote`;    
            axios({
                method: 'post',
                url: url,
                headers: {'Authorization': this.state.token},
                data: { blogId: this.props.objectId }
            })
            .then((res)=>{
                if(res.status===201 || res.status===200){
                    if(like){
                        this.setState((prevState)=>{
                            let data = {
                                ...prevState,
                                LikeFill: true,
                                DislikeFill: false,
                                LikeCount: prevState.LikeCount+1
                            }
                            if(prevState.LikeFill){
                                data = {
                                    ...prevState,
                                    LikeFill: false,
                                    DislikeFill: false,
                                    LikeCount: prevState.LikeCount-1
                                }
                            }
                            if(prevState.DislikeFill){
                                data = {
                                    ...prevState,
                                    LikeFill: true,
                                    DislikeFill: false,
                                    LikeCount: prevState.LikeCount+1,
                                    DislikeCount: prevState.DislikeCount-1
                                }
                            }
                            return data;
                        })
                    }
                    else{
                        this.setState((prevState)=>{
                            let data = {
                                ...prevState,
                                LikeFill: false,
                                DislikeFill: true,
                                DislikeCount: prevState.DislikeCount+1
                            }
                            if(prevState.DislikeFill){
                                data = {
                                    ...prevState,
                                    LikeFill: false,
                                    DislikeFill: false,
                                    DislikeCount: prevState.DislikeCount-1
                                }
                            }
                            if(prevState.LikeFill){
                                data = {
                                    ...prevState,
                                    LikeFill: false,
                                    DislikeFill: true,
                                    LikeCount: prevState.LikeCount-1,
                                    DislikeCount: prevState.DislikeCount+1
                                }
                            }
                            return data;
                        })
                    }
                }
            })
            .catch(error => {
                console.log(error);
            })
        }
        else{
            let url = `${MAIN_URI}/commentLike/upvote`;
            if(!like) url = `${MAIN_URI}/commentLike/downvote`;
    
            axios({
                method: 'post',
                url: url,
                headers: {'Authorization': this.state.token},
                data: { commentId: this.props.objectId }
            })
            .then((res)=>{
                if(res.status===201 || res.status===200){
                    if(like){
                        this.setState((prevState)=>{
                            let data = {
                                ...prevState,
                                LikeFill: true,
                                DislikeFill: false,
                                LikeCount: prevState.LikeCount+1
                            }
                            if(prevState.LikeFill){
                                data = {
                                    ...prevState,
                                    LikeFill: false,
                                    DislikeFill: false,
                                    LikeCount: prevState.LikeCount-1
                                }
                            }
                            if(prevState.DislikeFill){
                                data = {
                                    ...prevState,
                                    LikeFill: true,
                                    DislikeFill: false,
                                    LikeCount: prevState.LikeCount+1,
                                    DislikeCount: prevState.DislikeCount-1
                                }
                            }
                            return data;
                        })
                    }
                    else{
                        this.setState((prevState)=>{
                            let data = {
                                ...prevState,
                                LikeFill: false,
                                DislikeFill: true,
                                DislikeCount: prevState.DislikeCount+1
                            }
                            if(prevState.DislikeFill){
                                data = {
                                    ...prevState,
                                    LikeFill: false,
                                    DislikeFill: false,
                                    DislikeCount: prevState.DislikeCount-1
                                }
                            }
                            if(prevState.LikeFill){
                                data = {
                                    ...prevState,
                                    LikeFill: false,
                                    DislikeFill: true,
                                    LikeCount: prevState.LikeCount-1,
                                    DislikeCount: prevState.DislikeCount+1
                                }
                            }
                            return data;
                        })
                    }
                }
            })
            .catch(error => {
                console.log(error);
            })
        }
    }

    render() { 
        let commentIcon = null;
        if(this.props.comments){
            commentIcon = (
                <div className={classes.iconDataContainer}>
                    <FaCommentAlt size="1em" color="#0a42a4" className={classes.icon}/>
                    <p>{this.state.numberOfComments}</p>
                </div>
            )
        }
        let dislikeclasses = classes.iconDataContainer;
        if(!this.props.comments){
            dislikeclasses = [classes.iconDataContainer, classes.movetoleft].join(" ")
        }

        let innerContainer = classes.numberInfoInnerContainer;
        if(this.props.small){
            innerContainer = [classes.numberInfoInnerContainer, classes.small].join(" ");
        }

        let objType;
        this.props.objectIsBlog ? objType = "blog" : objType = "comment";

        const sendNotificationData = {
            receiverId: this.props.userId, //get requests will search in this field
            senderNick: this.state.userData.nickname, //nickname of the user respobsible for the action
            objectType: objType, //blog or comment
            objectId: this.props.objectId, //id for link to object
        }

        return (
            <div className={classes.numberInfoContainer}>
                <div className={innerContainer}>
                    <div className={[classes.iconDataContainer, classes.likeIconPContainer].join(" ")}>
                        <Like
                            sendNotificationData={sendNotificationData}    
                            sendAction={this.sendAction}
                            fill={this.state.LikeFill}
                            number={this.state.LikeCount}
                            size="1.5em" 
                            color="#0a42a4" 
                            className={classes.icon}/>
                    </div>
                    <div className={dislikeclasses}>
                        <Like
                            sendNotificationData={sendNotificationData}
                            dislike 
                            sendAction={this.sendAction}
                            fill={this.state.DislikeFill}
                            number={this.state.DislikeCount}
                            size="1.5em" 
                            color="#0a42a4" 
                            className={classes.icon}/>
                    </div>
                    {commentIcon}
                </div>
            </div>
        );
    }
}
 
export default LikesCommentsNumbers;