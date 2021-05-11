import React, { Component } from 'react';
import classes from './like.module.css';
import { AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from 'react-icons/ai';
import axios from 'axios';

class Like extends Component {
    constructor(props){
        super(props);
        this.state = {
            LikeFill: false,
            DislikeFill: false,
            number: 0,
            objectId: props.objectId,
            authorId: props.authorId,
            token: props.token
        }
        this.sendAction.bind(this);
        this.getData.bind(this);
        this.handleFill.bind(this);
    }

    componentDidMount(){
        this.getData();
        this.handleFill();
    }

    getData = () => {
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

    handleFill = () => {
        let data = {commentId: this.props.objectId, type: "comment"}
        if(this.props.objectIsBlog){
            data = {blogId: this.props.objectId, type: "blog"}
        }

        axios({
            method: 'post',
            url: `http://localhost:3001/checkIfLikedAlready`,
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
            let url = "http://localhost:3001/blogLike/upvote";
            if(this.props.dislike) url = "http://localhost:3001/blogLike/downvote";    
            axios({
                method: 'post',
                url: url,
                headers: {'Authorization': this.state.token},
                data: { blogId: this.state.objectId }
            })
            .then((res)=>{
                if(res.status===200){
                    this.setState((prevState) => {
                        let newState = {
                            ...prevState,
                            DislikeFill: !prevState.DislikeFill,
                            number: res.data.count
                        };
                        if(like){
                            newState = {
                                ...prevState,
                                LikeFill: !prevState.LikeFill,
                                number: res.data.count
                            };
                        }   
                        return newState;
                    })
                }
            })
            .catch(error => {
                console.log(error);
            })
        }
        else{
            let url = "http://localhost:3001/commentLike/upvote";
            if(this.props.dislike) url = "http://localhost:3001/commentLike/downvote";
    
            axios({
                method: 'post',
                url: url,
                headers: {'Authorization': this.state.token},
                data: { commentId: this.state.objectId }
            })
            .then((res)=>{
                if(res.status===200){
                    this.setState((prevState) => {
                        return ({
                            ...prevState,
                            number: res.data.count
                        })
                    })
                }
            })
            .catch(error => {
                console.log(error);
            })
        }
    }

    render() { 

        let content;
    
        if(this.props.dislike && this.state.DislikeFill){
            content = <AiFillDislike size={this.props.size} color={this.props.color} onClick={() => this.sendAction(false)}/>;
        }
        else if(this.props.dislike && !this.state.DislikeFill){
            content = <AiOutlineDislike size={this.props.size} color={this.props.color} onClick={() => this.sendAction(false)}/>;
        }
        else if(this.state.LikeFill){
            content = <AiFillLike size={this.props.size} color={this.props.color} onClick={() => this.sendAction(true)}/>;
        }
        else if(!this.state.LikeFill){
            content = <AiOutlineLike size={this.props.size} color={this.props.color} onClick={() => this.sendAction(true)}/>;
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