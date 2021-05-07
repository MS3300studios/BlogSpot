import React, { Component } from 'react';

import axios from 'axios';

import { FaCommentAlt } from 'react-icons/fa';
import { AiFillLike, AiFillDislike } from 'react-icons/ai'

import classes from './likesCommentsNumbers.module.css';
import getToken from '../../getToken';

class LikesCommentsNumbers extends Component {
    constructor(props){
        super(props);

        let token = getToken();

        this.state = {
            token: token,
            numberOfComments: null,
            numberOfLikes: null,
            numberOfDisikes: null
        }
    }

    componentDidMount() {
        if(this.props.comments){
            axios({
                method: 'post',
                url: "http://localhost:3001/comments/getNumber",
                headers: {'Authorization': this.state.token},
                data: {
                    blogId: this.props.blogId
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
        //get likes
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
                        <AiFillLike size="1em" color="#0a42a4" className={classes.icon}/>
                        <p className={classes.likeP}>5</p>
                    </div>
                    <div className={dislikeclasses}>
                        <AiFillDislike size="1em" color="#0a42a4" className={classes.icon}/>
                        <p className={classes.dislikeP}>0</p>
                    </div>
                    {commentIcon}
                </div>
            </div>
        );
    }
}
 
export default LikesCommentsNumbers;