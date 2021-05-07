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
        axios({
            method: 'post',
            url: `http://localhost:3001/comments/getNumber`,
            headers: {'Authorization': this.state.token},
            data: {
                blogId: this.props.blogId
            }
        })
        .then((res)=>{
            if(res.status===200){
                this.setState({numberOfComments: res.count});
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    render() { 
        return (
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
                        <p>{this.state.numberOfComments}</p>
                    </div>
                </div>
            </div>
        );
    }
}
 
export default LikesCommentsNumbers;