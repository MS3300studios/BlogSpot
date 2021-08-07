import React, { Component } from 'react';

import { RiSendPlaneFill, RiSendPlaneLine } from 'react-icons/ri' 
import classes from '../../../components/UI/AddCommentForm.module.css'
import Flash from '../../../components/UI/flash'; 
import UserPhoto from '../../../components/UI/userphoto';

import getToken from '../../../getToken';
import getUserData from '../../../getUserData';

class EditPhotoComment extends Component {
    constructor(props) {
        super(props);

        let token = getToken();

        let userData = getUserData();
        
        this.state = {
            token: token,
            userData: userData,
            sendPressed: false,
            flashMessage: "",
            flashNotClosed: true,
        }
        this.flash.bind(this);
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

    render() { 
        let flashView = null;
        if(this.state.flashMessage && this.state.flashNotClosed){
            flashView = <Flash>{this.state.flashMessage}</Flash>
        }
        else if(this.state.flashMessage && this.state.flashNotClosed === false){
            flashView = <Flash close>{this.state.flashMessage}</Flash>
        }
        let smallClass = classes.mainForm;
        if(this.props.small){
            smallClass = [classes.mainForm, classes.smallForm].join(" ");
        }

        return (
            <React.Fragment>
                <div className={classes.mainContainer}>
                    <div className={classes.userPhotoDiv}>
                        <UserPhoto userId={this.state.userData._id} smallPhotoCommentForm hideOnlineIcon/>
                    </div>
                    <form className={smallClass}>
                        <input value={this.state.content} placeholder="write your comment here" onChange={(event)=>this.setState({content: event.target.value})}/>
                    </form>
                    <div 
                        onMouseDown={(e)=>{
                            this.setState({sendPressed: true})
                            this.sendComment(e, this.state.content)
                        }}
                        onMouseUp={()=>{this.setState({sendPressed: false})}} 
                        className={classes.sendIcon}>
                        {this.state.sendPressed ? <RiSendPlaneLine size="2em"/> : <RiSendPlaneFill size="2em" />}
                    </div>
                </div>
                {flashView}
            </React.Fragment>
        );
    }
}
 
export default EditPhotoComment;