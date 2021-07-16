import React from 'react';

import classes from './photo.module.css';
import {BsArrowsAngleExpand} from 'react-icons/bs';

const Photo = (props) => {

    let className = classes.photoContainer;
    if(props.socialBoard) className = classes.photoContainerSmall

    return (
        <div className={className}>
            <img src={props.photo.data} alt="refresh your page" className={classes.normalImage}/>
            <div className={classes.expandIconBackground} onClick={()=>props.openBigPhoto(props.photo._id)}>
                <BsArrowsAngleExpand size="1.5em" color="white" />
            </div>
            <div className={classes.panel}>
                <p>likes: {props.photo.likes.length}</p>
                <p>dislikes: {props.photo.dislikes.length}</p>
                <p>comments: {props.photo.comments.length}</p>
            </div>
        </div>
    );
}
 
export default Photo;