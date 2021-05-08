import React, { Component } from 'react';
import classes from './like.module.css';
import { AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from 'react-icons/ai';
import axios from 'axios';

class Like extends Component {
    constructor(props){
        super(props);
        this.state = {
            fill: props.fill,
            number: 0,
            objectId: props.objectId,
            authorId: props.authorId,
            token: props.token
        }
        this.sendAction.bind(this);
    }

    componentDidMount(){
        if(this.props.objectIsBlog){
            let url = "http://localhost:3001/blogLike/count";
            if(this.props.dislike) url = "http://localhost:3001/blogDislike/count";    
            axios({
                method: 'post',
                url: url,
                headers: {'Authorization': this.state.token},
                data: { blogId: this.state.objectId }
            })
            .then((res)=>{
                if(res.status===200){
                    this.setState({number: res.data.count});
                }
            })
            .catch(error => {
                console.log(error);
            })
        }
        else{
            let url = "http://localhost:3001/commentLike/count";
            if(this.props.dislike) url = "http://localhost:3001/commentDislike/count";
    
            axios({
                method: 'post',
                url: url,
                headers: {'Authorization': this.state.token},
                data: { commentId: this.state.objectId }
            })
            .then((res)=>{
                if(res.status===200){
                    this.setState({number: res.data.count});
                }
            })
            .catch(error => {
                console.log(error);
            })
        }
    }

    sendAction = () => {
        let url = "http://localhost:3001/blogLike/upvote";
        if(this.props.dislike) url = "http://localhost:3001/blogDislike/count";
        let data = { commentId: this.state.objectId }
        if(this.props.objectIsBlog) data = { blogId: this.state.objectId }

        axios({
            method: 'post',
            url: url,
            headers: {'Authorization': this.state.token},
            data: data
        })
        .then((res)=>{
            if(res.status===200){
                this.setState((prevState)=>
                    (
                        {
                            ...prevState,
                            number: res.data.count,
                            fill: !prevState.fill
                        }
                    )
                );
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    render() { 

        let content;
    
        if(this.props.dislike && this.state.fill){
            content = <AiFillDislike size={this.props.size} color={this.props.color} onClick={this.sendAction}/>;
        }
        else if(this.props.dislike){
            content = <AiOutlineDislike size={this.props.size} color={this.props.color} onClick={this.sendAction}/>;
        }
        else if(this.state.fill){
            content = <AiFillLike size={this.props.size} color={this.props.color} onClick={this.sendAction}/>;
        }
        else{
            content = <AiOutlineLike size={this.props.size} color={this.props.color} onClick={this.sendAction}/>;
        }

        return (
            <div className={classes.likeContainer}>
                {content}
                <p className={classes.likeP}>{this.state.number}</p>
            </div>
        );
    }
}
 
export default Like;