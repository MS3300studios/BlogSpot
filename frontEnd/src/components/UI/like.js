import React, { Component } from 'react';
import classes from './like.module.css';
import { AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike, AiOutlineConsoleSql } from 'react-icons/ai';
import axios from 'axios';
import getToken from '../../getToken';

class Like extends Component {
    constructor(props){
        super(props);
        let token = getToken();

        this.state = {
            token: token
        }

        this.process.bind(this);
    }

    process = (arg, isDeleting) => {
        let data = this.props.sendNotificationData;
        this.props.dislike ? data.actionType = "dislike" : data.actionType = "like"
        data.isDeleting = isDeleting;

        axios({
            method: 'post',
            url: `http://localhost:3001/notifications/create`,
            headers: {'Authorization': this.state.token},
            data: data
        })
        .then((res)=>{
            if(res.status===200 || res.status===201){
                this.props.sendAction(arg);
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    render() { 
        let content;

        if(this.props.dislike && this.props.fill){
            content = <AiFillDislike 
            size={this.props.size} 
            color={this.props.color} 
            onClick={() => this.process(false, true)}/>;
        }
        else if(this.props.dislike && !this.props.fill){
            content = <AiOutlineDislike 
            size={this.props.size} 
            color={this.props.color} 
            onClick={() => this.process(false, false)}/>;
        }
        else if(this.props.fill){
            content = <AiFillLike 
            size={this.props.size} 
            color={this.props.color} 
            onClick={() => this.process(true, true)}/>;
        }
        else if(!this.props.fill){
            content = <AiOutlineLike 
            size={this.props.size} 
            color={this.props.color} 
            onClick={() => this.process(true, false)}/>;
        }

        let classNames = [classes.likeP];
        if(this.props.photoView){
            classNames = [classes.likeP, classes.align].join(" ");
        }

        return (
            <div className={classes.likeContainer}>
                {content}
                <p className={classNames}>{this.props.number}</p>
            </div>
        );
    }
}
 
export default Like;



// this.forceUpdate();