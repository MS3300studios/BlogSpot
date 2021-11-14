import React from 'react';

import { AiOutlineWarning } from 'react-icons/ai';
import classes from './imageTooBigWarning.module.css';

const ImageTooBigWarning = () => {
    return (
        <div className={classes.imageTooBigContainer}>
            <div style={{fontSize: "20px"}} className={classes.warningIconContainer}>
                <AiOutlineWarning color="salmon" size="2.5em"/>
            </div>
            <div>
                <p>
                    The image you submitted exeeds 10 mb. Because the database size is small, images that exceed 10 mb are not allowed. 
                </p>
                <p>
                    To make this image smaller you can use squoosh.com: a website that compresses images with minimal quality loss. 
                </p>
                <a href="https://squoosh.app/">go to squoosh.com</a>
            </div>
        </div>
    );
}
 
export default ImageTooBigWarning;