import { useState } from 'react';
import classes from './like.module.css';
import { AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from 'react-icons/ai';

const Like = (props) => {
    const [fill, setfill] = useState(props.fill);
    let content;
    
    if(props.dislike && fill){
        content = <AiFillDislike size={props.size} color={props.color} onClick={() => setfill(!fill) }/>;
    }
    else if(props.dislike){
        content = <AiOutlineDislike size={props.size} color={props.color} onClick={() => setfill(!fill) }/>;
    }
    else if(fill){
        content = <AiFillLike size={props.size} color={props.color} onClick={() => setfill(!fill) }/>;
    }
    else{
        content = <AiOutlineLike size={props.size} color={props.color} onClick={() => setfill(!fill) }/>;
    }
    
    return (
        <div className={classes.likeContainer}>
            {content}
        </div>
    );
}
 
export default Like;