import React from 'react';
import Backdrop from '../../components/UI/backdrop';

import classes from './AddItemsForm.module.css';
import {AiOutlineCloseCircle} from 'react-icons/ai';

const AddItemsForm = (props) => {
    const centerStyle = {
        width: "100%",
        heigth: "100%",
        display: "flex",
        justifyContent: "center"
    }

    return (
        <Backdrop show>
            <div className={classes.addingContainer}>
                <div className={classes.closeIcon} onClick={props.closeAddItem}>
                    <AiOutlineCloseCircle size="2em" color="#0a42a4" />
                </div>
                <div style={centerStyle}>
                    <div className={classes.centeringDiv}>
                        <div className={classes.addBlog} style={props.addItemStyle}>
                            <p>hello</p>        
                        </div>
                    </div>
                    <div className={classes.centeringDiv}>
                        <div className={classes.addPhoto} style={props.addItemStyle}>
                            
                        </div>
                    </div>
                </div>
            </div>
        </Backdrop>
    )
}
 
export default AddItemsForm;


