import React from 'react';
import { useState } from 'react';
import Comments from './comments';

import classes from './showComments.module.css';


const ShowComments = (props) => {
    const [show, setshow] = useState(false);
    const [message, setmessage] = useState("show comments");

    return ( 
        <React.Fragment>
            <p
                className={classes.showcomments}
                onClick={() => {
                    let curr = show;
                    let currMessage;
                    if(message === "hide comments"){
                        currMessage = "show comments";
                    }
                    else {
                        currMessage = "hide comments"
                    }
                   
                    setmessage(currMessage);
                    setshow(!curr);
                }}
            >{message}</p>
            <hr />
            {
                show ? <Comments blogId={props.blogId}/> : null
            }
        </React.Fragment>
    );
}
 
export default ShowComments;