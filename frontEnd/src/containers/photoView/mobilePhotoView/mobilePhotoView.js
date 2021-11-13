import React, { useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import UserPhoto from '../../../components/UI/userphoto';
import formattedCurrentDate from '../../../formattedCurrentDate';
import Button from '../../../components/UI/button';

import classes from './MobilePhotoView.module.css';
import importedClasses from '../photoView.module.css';
import Like from '../../../components/UI/like';
import { FaCommentAlt } from 'react-icons/fa';
import EditPhotoDesc from '../EditPhotoDesc';
import PhotoComments from '../photoComments/photoComments';

const MobilePhotoView = (props) => {
    const [editingPhotoDescription, seteditingPhotoDescription] = useState(false);
    const [likefill, setlikefill] = useState(props.likeFill);
    const [dislikefill, setdislikefill] = useState(props.dislikeFill);
    const [likecount, setlikecount] = useState(props.likeCount);
    const [dislikecount, setdislikecount] = useState(props.dislikeCount);
    
    return (
        <div className={classes.mobileContainer}>
            <div className={classes.closeIcon} onClick={props.close}>
                <AiOutlineCloseCircle color="#fff" size="2em"/>
            </div>
            <img src={props.photo} alt="loading failed" style={{maxHeight: "100%", maxWidth: "100%"}}/>
            <div className={classes.mobileDataContainer}>
                <div className={classes.authorCard}>
                    <div style={{marginTop: "-15px", marginRight: "-110px"}}>
                        <UserPhoto small hideOnlineIcon userId={props.author}/>
                    </div>
                    <p>@{props.authorNick}</p>
                    <p>{formattedCurrentDate(props.createdAt)}</p>
                </div>
                <div className={classes.description}>
                    {
                        editingPhotoDescription ? (
                            <EditPhotoDesc 
                                content={props.description} 
                                send={props.sendEditedDesc} 
                                isMobile
                                cancel={()=>seteditingPhotoDescription(false)}
                            /> 
                        ) : (
                            <div className={classes.descriptionContainer}>
                                <p className={classes.description}>{props.description}</p>
                            </div>
                        )
                    }
                </div>
                <hr />
                {
                    (props.userData._id === props.author) ? (
                        <>
                        <div className={classes.editDelButtonContainer}>
                            <Button clicked={()=>seteditingPhotoDescription(true)}>Edit</Button>
                            <Button clicked={props.deletePhotoHandler}>Delete</Button>
                        </div>
                        <hr />
                        </>
                    ) : null
                }
                <div style={{display: "flex", justifyContent: "center", marginBottom: "25px"}}>
                <div className={importedClasses.LikesCommentsNumbers} style={{width: "90%", height: "30px"}}>
                    <div className={importedClasses.like} onClick={()=>{
                        setlikefill(!likefill);
                        
                        if(dislikefill){
                            setdislikefill(!dislikefill);
                            setdislikecount(dislikecount-1);
                        }
                        if(likefill)setlikecount(likecount-1);
                        else setlikecount(likecount+1);
                    }}>
                        <Like
                            sendNotificationData={
                                {
                                    receiverId: props.author, 
                                    senderId: props.userData._id, 
                                    senderNick: props.userData.nickname, 
                                    objectType: "photo",
                                    objectId: props.photoId,
                                }
                            }
                            sendAction={()=>props.sendLikeAction(true)}
                            fill={likefill}
                            number={likecount}
                            size="1.5em" 
                            color="#0a42a4" 
                            photoView
                        />
                    </div>
                    <div className={importedClasses.dislike} onClick={()=>{
                        setdislikefill(!dislikefill);
                        
                        if(likefill){
                            setlikefill(!likefill);
                            setlikecount(likecount-1);
                        }
                        if(dislikefill)setdislikecount(dislikecount-1);
                        else setdislikecount(dislikecount+1);
                    }}>
                        <Like
                            sendNotificationData={
                                {
                                    receiverId: props.author, 
                                    senderId: props.userData._id, 
                                    senderNick: props.userData.nickname, 
                                    objectType: "photo",
                                    objectId: props.photoId,
                                }
                            }
                            dislike 
                            sendAction={()=>props.sendLikeAction(false)}
                            fill={dislikefill}
                            number={dislikecount}
                            size="1.5em" 
                            color="#0a42a4" 
                            photoView
                        />
                    </div>
                    <div className={importedClasses.comment}>
                        <FaCommentAlt size="1em" color="#0a42a4" className={classes.commenticon}/>
                        <p>{props.commentCount}</p>
                    </div>
                </div>
                </div>

                <PhotoComments 
                    photoId={props.photoId} 
                    flash={props.flash} 
                    afterSend={props.editCommentCleanUp}
                    small={props.small}
                    photoAuthorId={props.author}
                    sendNotification={props.sendNotification}
                />
            </div>
        </div>
    );
}
 
export default MobilePhotoView;