import React, {useState} from 'react';

import classes from './EditPhotoDesc.module.css';
import Button from '../../components/UI/button';

const EditPhotoDesc = (props) => {
    const [content, setcontent] = useState(props.content);

    return (
        <div className={classes.EditPhotoDescContainer}>
            <textarea className={classes.editPhotoDescTextarea} onChange={(e)=>setcontent(e.target.value)} value={content} />
            <div className={classes.editPhotoDescButtons}>
                <Button btnType="Continue" clicked={()=>props.send(content)}>Continue</Button>
                <Button btnType="Cancel" clicked={props.cancel}>Cancel</Button>
            </div>
        </div>
    );
}
 
export default EditPhotoDesc;