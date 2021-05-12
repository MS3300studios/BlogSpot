import React, { Component } from 'react';
import classes from './like.module.css';
import { AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from 'react-icons/ai';

class Like extends Component {
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

        return (
            <div className={classes.likeContainer}>
                {content}
                <p className={classes.likeP}>{this.props.number}</p>
            </div>
        );
    }
}
 
export default Like;



// this.forceUpdate();