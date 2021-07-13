import React from 'react';

import classes from './photo.module.css';
import {BsArrowsAngleExpand} from 'react-icons/bs';

const Photo = (props) => {
    return (
        <div className={classes.photoContainer}>
            <img src={props.data} alt="refresh your website"/>
            <div className={classes.expandIconBackground}>
                <BsArrowsAngleExpand size="1.5em" color="white" />
            </div>
            <div className={classes.panel}>
                <p>likes: 9</p>
                <p>dislikes: 12</p>
                <p>comments: 12</p>
            </div>
        </div>
    );
}
 
export default Photo;