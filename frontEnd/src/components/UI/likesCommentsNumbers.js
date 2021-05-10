import React, { Component } from 'react';

import axios from 'axios';

import { FaCommentAlt } from 'react-icons/fa';
import Like from '../UI/like';

import classes from './likesCommentsNumbers.module.css';
import getToken from '../../getToken';

class LikesCommentsNumbers extends Component {
    constructor(props){
        super(props);

        let token = getToken();

        let fillData = this.handleFill(true, token);

        this.state = {
            objectId: props.objectId,
            userId: props.userId,
            token: token,
            numberOfComments: 0,
            LikeFill: fillData.LikeFill,
            DislikeFill: fillData.DislikeFill,
        }
        this.handleFill.bind(this);
    }

    componentDidMount() {
        if(this.props.comments){
            axios({
                method: 'post',
                url: "http://localhost:3001/comments/getNumber",
                headers: {'Authorization': this.state.token},
                data: {
                    blogId: this.state.objectId
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
        // this.handleFill();
    }

    handleFill = (constr, t) => {
        let data = {commentId: this.props.objectId, type: "comment"}
        if(this.props.objectIsBlog){
            data = {blogId: this.props.objectId, type: "blog"}
        }
        let token = t;
        if(!constr){
            token = this.state.token
        }
        axios({
            method: 'post',
            url: `http://localhost:3001/checkIfLikedAlready`,
            headers: {'Authorization': token},
            data: data
        })
        .then((res)=>{
            if(res.status===200){
                if(res.data.response === "like"){
                    if(constr){
                        return {LikeFill: true, DislikeFill: false}
                    }
                    this.setState({LikeFill: true, DislikeFill: false});
                }
                else if(res.data.response === "dislike"){
                    if(constr){
                        return {LikeFill: true, DislikeFill: false}
                    }
                    this.setState({LikeFill: false, DislikeFill: true});
                }
                else if(res.data.response === "none"){
                    if(constr){
                        return {LikeFill: true, DislikeFill: false}
                    }
                    this.setState({LikeFill: false, DislikeFill: false});
                }
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    FillPropFunction = (typeClicked, val) => {
        if(typeClicked === undefined){
            this.setState({LikeFill: val, DislikeFill: !val});
        }
        else if(typeClicked === true){
            this.setState({LikeFill: !val, DislikeFill: val});
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

        return (
            <div className={classes.numberInfoContainer}>
                <div className={innerContainer}>
                    <div className={[classes.iconDataContainer, classes.likeIconPContainer].join(" ")}>
                        <Like 
                            fill={this.state.LikeFill}
                            objectIsBlog={this.props.objectIsBlog} 
                            token={this.state.token} 
                            authorId={this.state.userId} 
                            objectId={this.state.objectId} 
                            FillPropFunction={this.FillPropFunction}
                            size="1.5em" 
                            color="#0a42a4" 
                            className={classes.icon}/>
                    </div>
                    <div className={dislikeclasses}>
                        <Like 
                            fill={this.state.DislikeFill}
                            dislike 
                            objectIsBlog={this.props.objectIsBlog} 
                            token={this.state.token} 
                            authorId={this.state.userId} 
                            objectId={this.state.objectId} 
                            FillPropFunction={this.FillPropFunction}
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