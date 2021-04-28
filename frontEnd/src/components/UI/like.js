import classes from './like.module.css';
import { AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from 'react-icons/ai';

const Like = (props) => {
    let content = <AiOutlineLike size={props.size} color={props.color}/>;
    if(props.dislike){
        content = <AiOutlineDislike size={props.size} color={props.color}/>;
    }
    if(props.fill){
        content = <AiFillLike size={props.size} color={props.color}/>;
    }
    else if(props.fill && props.dislike){
        content = <AiFillDislike size={props.size} color={props.color}/>;
    }
    return (
        <div className={classes.likeContainer}>
            {content}
        </div>
    );
}
 
export default Like;