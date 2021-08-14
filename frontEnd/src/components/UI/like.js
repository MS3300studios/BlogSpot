import React, { Component } from 'react';
import classes from './like.module.css';
import { AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from 'react-icons/ai';

class Like extends Component {
    componentDidMount(){
        let data = this.props.sendNotificationData;
        this.props.dislike ? data.actionType = "dislike" : data.actionType = "like"
        console.log(data)
    }

    render() { 
        let content;

        if(this.props.dislike && this.props.fill){
            content = <AiFillDislike 
            size={this.props.size} 
            color={this.props.color} 
            onClick={() => this.props.sendAction(false)}/>;
        }
        else if(this.props.dislike && !this.props.fill){
            content = <AiOutlineDislike 
            size={this.props.size} 
            color={this.props.color} 
            onClick={() => this.props.sendAction(false)}/>;
        }
        else if(this.props.fill){
            content = <AiFillLike 
            size={this.props.size} 
            color={this.props.color} 
            onClick={() => this.props.sendAction(true)}/>;
        }
        else if(!this.props.fill){
            content = <AiOutlineLike 
            size={this.props.size} 
            color={this.props.color} 
            onClick={() => this.props.sendAction(true)}/>;
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