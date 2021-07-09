import React, {useState} from 'react';

import Button from '../../../../../components/UI/button';
import classes from './editCommentForm.module.css';

const EditCommentForm = (props) => {
    const [editContent, seteditContent] = useState(props.commentContent);

    console.log(props.commentContent)

    let submitHandler = () => {
        console.log(editContent);
    }

    return (
        <div className={classes.container}>
            <input onChange={(e)=>seteditContent(e.target.value)} value={editContent}/>
            <Button btnType={"Continue"} clicked={submitHandler} >Submit</Button>
            <Button btnType={"Cancel"} clicked={props.cancelEdit} >Cancel</Button>
        </div>
    );
}
 
export default EditCommentForm;