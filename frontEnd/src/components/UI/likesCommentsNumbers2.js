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

        this.state = {
            objectId: props.objectId,
            userId: props.userId,
            token: token,
            numberOfComments: 0,
            LikeRefresh: false,
            DislikeRefresh: false,
        }
        this.actionCleanUp.bind(this);
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
    }

    actionCleanUp = (type) => {
        this.setState((prevState) => {
            return ({...prevState});
        })
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
                            refresh={this.state.LikeRefresh} 
                            objectIsBlog={this.props.objectIsBlog} 
                            token={this.state.token} 
                            authorId={this.state.userId} 
                            objectId={this.state.objectId} 
                            cleanUp={this.actionCleanUp}
                            size="1.5em" 
                            color="#0a42a4" 
                            className={classes.icon}/>
                    </div>
                    <div className={dislikeclasses}>
                        <Like
                            refresh={this.state.DislikeRefresh} 
                            dislike 
                            objectIsBlog={this.props.objectIsBlog} 
                            token={this.state.token} 
                            authorId={this.state.userId} 
                            objectId={this.state.objectId} 
                            cleanUp={this.actionCleanUp}
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