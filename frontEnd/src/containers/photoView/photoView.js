import React, { Component } from 'react';
import axios from 'axios';
import getToken from '../../getToken';
import getUserData from '../../getUserData';
import { MAIN_URI } from '../../config';

import Like from '../../components/UI/like';
import { FaCommentAlt } from 'react-icons/fa';
import Button from '../../components/UI/button';
import formattedCurrentDate from '../../formattedCurrentDate';
import UserPhoto from '../../components/UI/userphoto';
import Spinner from '../../components/UI/spinner';
import Flash from '../../components/UI/flash';

import CommentOptions from '../userProfile/tabs/comments/optionsContainer/CommentOptions';
import { withRouter } from 'react-router-dom';
import EditPhotoDesc from './EditPhotoDesc';
import PhotoComments from './photoComments/photoComments';
import getColor from '../../getColor';

import classes from './photoView.module.css';
import getMobile from '../../getMobile';
import MobilePhotoView from './mobilePhotoView/mobilePhotoView';

const colorScheme = getColor();
let background = {backgroundColor: "#82ca66"};
if(colorScheme === "blue"){
    background = {backgroundColor: "hsl(210deg 66% 52%)"};
}

class photoView extends Component {
    constructor(props) {
        super(props);

        let token = getToken();
        let userData = getUserData();

        this.state = {
            token: token,
            userData: userData,
            loading: true,
            photo: null,
            flashMessage: "",
            flashNotClosed: true,
            newCommentContent: "",
            sendPressed: false,
            comments: [],
            loadingComments: true,
            commentsEditing: [],
            likeFill: false,
            dislikeFill: false,
            socialStateWasChanged: false,
            editingPhotoDescription: false
        }
        this.getPhoto.bind(this);
        this.flash.bind(this);
        // this.sendComment.bind(this);
        // this.deleteCommentHandler.bind(this);
        // this.editCommentHandler.bind(this);
        // this.indexComments.bind(this);
        this.sendLikeAction.bind(this);
        this.checkFills.bind(this);
        this.deletePhotoHandler.bind(this);
        this.editPhotoDescHandler.bind(this);
        this.sendEditedDesc.bind(this);
        this.sendNotification.bind(this);

        this.isMobile = getMobile();
    }

    componentDidMount(){
        this.getPhoto();
        // this.getComments();
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.location.search !== prevProps.location.search){
            window.location.reload();
        }
    }

    deletePhotoHandler = () => {
        axios({
            method: 'delete',
            url: `${MAIN_URI}/photo/delete`,
            headers: {'Authorization': this.state.token},
            data: {
                id: this.state.photo._id
            }
        })
        .then()
        .catch(error => {
            console.log(error);
        })

        setTimeout(()=>{
            this.props.closeBigPhoto(true)
        },500)
    }    

    editPhotoDescHandler = () => {
        this.setState({editingPhotoDescription: true});
    }

    sendEditedDesc = (newContent) => {
        axios({
            method: 'post',
            url: `${MAIN_URI}/photo/edit`,
            headers: {'Authorization': this.state.token},
            data: {
                id: this.state.photo._id,
                newDescription: newContent
            }
        })
        .then((res)=>{
            if(res.status===200){
                this.setState({photo: res.data.photo, editingPhotoDescription: false, socialStateWasChanged: true});
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
        // this.setState({editingPhotoDescription: false});
    }

    sendLikeAction = (like) => {
        axios({
            method: 'post',
            url: `${MAIN_URI}/photo/rate`,
            headers: {'Authorization': this.state.token},
            data: {
                photoId: this.state.photo._id,
                like: like
            }
        })
        .then((res)=>{
            let fills = this.checkFills(res.data.photo);
            this.setState({photo: res.data.photo, likeFill: fills.likeFill, dislikeFill: fills.dislikeFill, socialStateWasChanged: true});
            //socialStateWasChanged kiedy klikniemy close to odpali się funkcja w propsach która sprawdzi ten stan i będzie wiedzieć czy odświeżyć czy nie
        })
        .catch(error => {
            console.log(error);
        })
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

    getPhoto = () => {
        let fills = this.checkFills(this.props.photo);
        this.setState({
            photo: this.props.photo, 
            loading: false, 
            likeFill: fills.likeFill, 
            dislikeFill: fills.dislikeFill
        });
    }

    checkFills = (photo) => {
        let likeFill = false;
        photo.likes.forEach(like => {
            if(like.authorId===this.state.userData._id) likeFill = true
        })
        let dislikeFill = false;
        photo.dislikes.forEach(dislike => {
            if(dislike.authorId===this.state.userData._id) dislikeFill = true
        })
        return ({
            likeFill: likeFill,
            dislikeFill: dislikeFill
        })
    }

    sendNotification = () => {
        let data = {
            receiverId: this.state.photo.authorId,
            senderId: this.state.userData._id,
            senderNick: this.state.userData.nickname,
            objectType: "photo",
            objectId: this.state.photo._id,
            actionType: "commented",
            isDeleting: false
        };
        axios({
            method: 'post',
            url: `${MAIN_URI}/notifications/create`,
            headers: {'Authorization': this.state.token},
            data: data
        })
        .catch(error => {
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
            <div className={classes.backdrop}>
                {
                    (!this.state.loading && this.isMobile) ? (
                        <MobilePhotoView 
                            photo={this.state.photo.data}
                            photoId={this.state.photo._id}
                            close={this.props.closeBigPhoto}
                            author={this.state.photo.authorId}
                            authorNick={this.state.photo.authorNickname}
                            createdAt={this.state.photo.createdAt}
                            userData={this.state.userData}
                            deletePhotoHandler={this.deletePhotoHandler}
                            sendLikeAction={this.sendLikeAction}
                            likeFill={this.state.likeFill}
                            dislikeFill={this.state.dislikeFill}
                            likeCount={this.state.photo.likes.length}
                            dislikeCount={this.state.photo.dislikes.length}
                            commentCount={this.state.photo.comments.length}
                            description={this.state.photo.description}
                            sendEditedDesc={this.sendEditedDesc}
                            flash={this.flash}
                            editCommentCleanUp={this.editCommentCleanUp}
                            small={this.props.small}
                            sendNotification={this.sendNotification}
                        />
                    ) : (
                        <div className={classes.photoViewContainer} style={background}>
                            <Button className={classes.CloseButton} clicked={()=>this.props.closeBigPhoto(this.state.socialStateWasChanged)}>Close</Button>
                                <div className={classes.imgContainer}>
                                    {
                                        this.state.loading ? <Spinner darkgreen /> : <img src={this.state.photo.data} alt="refresh your page"/>
                                    }
                                </div>
                            {
                                this.state.loading ? <Spinner darkgreen /> : (
                                    <div className={classes.dataContainer}>
                                        <div className={classes.authorInfoContainer}>
                                            <div className={classes.authorPhoto}>
                                                {
                                                    this.state.loading ? <Spinner darkgreen /> : <UserPhoto userId={this.state.photo.authorId} small hideOnlineIcon/>
                                                }
                                            </div>
                                            <div className={classes.authorData}>
                                                <p>@{this.state.photo.authorNickname}</p>
                                                <p>{formattedCurrentDate(this.state.photo.createdAt)}</p>
                                            </div>
                                            {
                                                (this.state.userData._id === this.state.photo.authorId) ? (
                                                    <div className={classes.positionPhotoOptions}>
                                                        <CommentOptions 
                                                            photoComment
                                                            deleteComment={() => this.deletePhotoHandler()}
                                                            editComment={() => this.editPhotoDescHandler()} />
                                                    </div>
                                                ) : null
                                                
                                            }
                                        </div>
                                        <div className={classes.LikesCommentsNumbers}>
                                            <div className={classes.like}><Like
                                                sendNotificationData={
                                                    {
                                                        receiverId: this.state.photo.authorId, 
                                                        senderId: this.state.userData._id, 
                                                        senderNick: this.state.userData.nickname, 
                                                        objectType: "photo",
                                                        objectId: this.state.photo._id,
                                                    }
                                                }
                                                sendAction={()=>this.sendLikeAction(true)}
                                                fill={this.state.likeFill}
                                                number={this.state.photo.likes.length}
                                                size="1.5em" 
                                                color="#0a42a4" 
                                                photoView/></div>
                                            <div className={classes.dislike}><Like
                                                sendNotificationData={
                                                    {
                                                        receiverId: this.state.photo.authorId, 
                                                        senderId: this.state.userData._id, 
                                                        senderNick: this.state.userData.nickname, 
                                                        objectType: "photo",
                                                        objectId: this.state.photo._id,
                                                    }
                                                }
                                                dislike 
                                                sendAction={()=>this.sendLikeAction(false)}
                                                fill={this.state.dislikeFill}
                                                number={this.state.photo.dislikes.length}
                                                size="1.5em" 
                                                color="#0a42a4" 
                                                photoView/></div>
                                            <div className={classes.comment}>
                                                <FaCommentAlt size="1em" color="#0a42a4" className={classes.commenticon}/>
                                                <p>{this.state.photo.comments.length}</p>
                                            </div>
                                        </div>
                                        <hr style={{borderColor: "hsl(201deg 97% 32%)"}}/>
                                        <div className={classes.description}>
                                            {
                                                this.state.editingPhotoDescription ? 
                                                    <EditPhotoDesc content={this.state.photo.description} send={this.sendEditedDesc} cancel={()=>this.setState({editingPhotoDescription: false})}/> : 
                                                    <p>{this.state.photo.description}</p>
                                            }
                                        </div>
                                        <hr style={{borderColor: "hsl(201deg 97% 32%)"}}/>
                                        <PhotoComments 
                                            photoId={this.props.photo._id} 
                                            flash={this.flash} 
                                            afterSend={this.editCommentCleanUp}
                                            small={this.props.small}
                                            photoAuthorId={this.props.photo.authorId}
                                            sendNotification={this.sendNotification}
                                        />
                                    </div>
                                )
                            }
                        </div> 
                    ) 
                }

                {flashView}
            </div> 
        );
    }
}
 
export default withRouter(photoView);