import React, {useState} from 'react';

import classes from './EditPhotoDesc.module.css';
import Button from '../../components/UI/button';

const EditPhotoDesc = (props) => {
    const [content, setcontent] = useState(props.content);

    return (
        <div className={classes.EditPhotoDescContainer} style={{padding: "3px"}}>
            <textarea 
                className={classes.editPhotoDescTextarea} 
                onChange={(e)=>setcontent(e.target.value)} 
                value={content} 
                style={props.isMobile ? {width: "99%"} : null} 
            />
            <div className={classes.editPhotoDescButtons}>
                <Button btnType="Continue" clicked={()=>{
                    props.send(content);
                    if(props.isMobile) props.cancel();
                }}
                >Continue</Button>
                <Button btnType="Cancel" clicked={props.cancel}>Cancel</Button>
            </div>
        </div>
    );
}
 
export default EditPhotoDesc;