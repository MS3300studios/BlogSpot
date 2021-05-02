import React, { Component } from 'react';
import axios from 'axios';
import classes from './AddCommentForm.module.css';
import getToken from '../../getToken';
import Flash from './flash';
import { RiSendPlaneFill, RiSendPlaneLine } from 'react-icons/ri' 

class AddCommentForm extends Component {
    constructor(props){
        super(props);
        let token = getToken();

        let userData;
            let local = localStorage.getItem('userData');
            let session = sessionStorage.getItem('userData');
            if(local !== null){
                userData = JSON.parse(local);
            }
            else if(session !== null){
                userData = JSON.parse(session);
            }
        
        this.state = {
            token: token,
            userData: userData,
            content: "",
            flashMessage: "",
            flashNotClosed: true,
            sendPressed: false
        }

        this.flash.bind(this);
        this.sendComment.bind(this);

    }
    
    flash = (message) => {
        this.setState({flashMessage: message});

        setTimeout(()=>{
            this.setState({flashNotClosed: false})
        }, 2000)

        setTimeout(()=>{
            this.setState({flashMessage: ""});
        }, 3000);
    
        setTimeout(()=>{
            this.setState({flashNotClosed: true})
        }, 3000);
    }

    sendComment = (e, content) => {
        // window.location.reload();
        e.preventDefault();
        if(content === ""){
            this.flash("you cannot send an empty comment");
            return;
        }

        axios({
            method: 'post',
            url: `http://localhost:3001/comments/new`,
            headers: {'Authorization': this.state.token},
            data: {
                content: content,
                author: this.state.userData._id,
                blogId: this.props.blogId
            }
        })
        .then((res)=>{
            console.log(res)
            if(res.status===201){
                this.flash("you posted a comment!");
                this.setState({content: ""});
                this.props.afterSend();
            }
        })
        .catch(error => {
            this.flash(error);
            console.log(error);
        })

    }   

    render() { 
        let flashView = null;
        if(this.state.flashMessage && this.state.flashNotClosed){
            flashView = <Flash>{this.state.flashMessage}</Flash>
        }
        else if(this.state.flashMessage && this.state.flashNotClosed === false){
            flashView = <Flash close>{this.state.flashMessage}</Flash>
        }
        return (
            <React.Fragment>
                <div className={classes.mainContainer}>
                <form>
                    <input value={this.state.content} placeholder="write your comment here" onChange={(event)=>this.setState({content: event.target.value})}/>
                </form>
                <div 
                    onMouseDown={()=>{this.setState({sendPressed: true})}} 
                    onMouseUp={()=>{this.setState({sendPressed: false})}} 
                    onClick={(e) => this.sendComment(e, this.state.content)} 
                    className={classes.sendIcon}>
                    {this.state.sendPressed ? <RiSendPlaneLine size="2em"/> : <RiSendPlaneFill size="2em" />}
                </div>
            </div>
                {flashView}
            </React.Fragment>
        );
    }
}
 
export default AddCommentForm;