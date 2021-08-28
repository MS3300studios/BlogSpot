import React, {useState} from 'react';
import axios from 'axios';

import Button from '../../../../../components/UI/button';
import classes from './editCommentForm.module.css';
import getToken from '../../../../../getToken';

const EditCommentForm = (props) => {
    const [editContent, seteditContent] = useState(props.initialValue);
    let token = getToken();

    let submitHandler = () => {
        if(props.photo){
            axios({
                method: 'post',
                url: `http://localhost:3001/photo/comment/edit`,
                headers: {'Authorization': token},
                data: {
                    photoId: props.photoId,
                    content: props.initialValue,
                    newcontent: editContent
                }
            })
            .then((res)=>{
                if(res.status===200){
                    props.flashProp("comment was edited");
                    props.setContent(editContent);
                }
            })
            .catch(error => {
                console.log(error);
                props.flashProp(error.message);
            })
        }
        else{
            axios({
                method: 'post',
                url: `http://localhost:3001/comments/edit/${props.commentId}`,
                headers: {"Authorization": token},
                data: {content: editContent}
            })
            .then((res)=>{
                if(res.status===200){
                    props.cancelEdit(); //simply closes editing form
                    props.flashProp("comment was edited");
                    return;
                }
            })
            .catch(error => {
                console.log(error);
            })
        }
    }

    return (
        <div className={classes.container}>
            <input onChange={(e)=>seteditContent(e.target.value)} value={editContent}/>
            <Button btnType={"Continue"} clicked={submitHandler} >Submit</Button>
            <Button btnType={"Cancel"} clicked={props.cancelEdit}>Cancel</Button>
        </div>
    );
}
 
export default EditCommentForm;
