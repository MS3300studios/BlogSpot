import React, { useState } from 'react';
import classes from './AddItemsForm.module.css';

import Backdrop from '../../components/UI/backdrop';
import {AiOutlineCloseCircle} from 'react-icons/ai';
import {MdAddToPhotos} from 'react-icons/md'; //add blog
import {MdAddAPhoto} from 'react-icons/md';
import { Redirect } from 'react-router';

const AddItemsForm = (props) => {
    const [redirectPhoto, setredirectPhoto] = useState(false);
    const [redirectBlog, setredirectBlog] = useState(false);
    
    const centerStyle = {
        width: "100%",
        heigth: "100%",
        display: "flex",
        justifyContent: "center"
    }

    return (
        <Backdrop show>
            {
                props.isMobile ? (
                    <div style={{overflowY: "auto"}}>
                        <div 
                            className={classes.closeIcon} 
                            onClick={props.closeAddItem}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                width: "100%",
                                marginTop: "10px",
                                fontSize: "22px",
                                marginBottom: "-50px"
                            }}
                        >
                            <AiOutlineCloseCircle size="2em" color="#fff" />
                        </div>

                        <div className={classes.centeringDiv}>
                            <div style={props.isMobile ? {marginBottom: "5px"} : null} className={props.isMobile ? classes.addBlog : [classes.addBlog, classes.bigAddBlog].join(" ")} style={props.addItemStyle} onClick={()=>setredirectBlog(true)}>
                                <div>
                                    <MdAddToPhotos size="1.5em" color="#fff"/>
                                </div>
                                <h1 className={classes.mainh1}>Add blog</h1>
                            </div>
                        </div>

                        <div className={classes.centeringDiv}>
                            <div style={props.isMobile ? {marginBottom: "5px"} : null} className={props.isMobile ? classes.addPhoto : [classes.addPhoto, classes.bigAddPhoto].join(" ")} style={props.addItemStyle} onClick={()=>setredirectPhoto(true)}>
                                <div>
                                    <MdAddAPhoto size="1.5em" color="#fff"/>
                                </div>
                                <h1 className={classes.mainh1} >Add photo</h1>
                            </div>
                        </div>
                        
                    </div>
                ) : (
                    <div className={classes.addingContainer}>
                        <div className={classes.closeIcon} onClick={props.closeAddItem}>
                            <AiOutlineCloseCircle size="2em" color="#0a42a4" />
                        </div>
                        <div style={centerStyle}>
                            <div className={classes.centeringDiv}>
                                <div className={classes.addBlog} style={props.addItemStyle} onClick={()=>setredirectBlog(true)}>
                                    <div>
                                        <MdAddToPhotos size="1.5em" color="#fff"/>
                                    </div>
                                    <h1 className={classes.mainh1}>Add blog</h1>
                                </div>
                            </div>
                            <div className={classes.centeringDiv}>
                                <div className={classes.addPhoto} style={props.addItemStyle} onClick={()=>setredirectPhoto(true)}>
                                    <div>
                                        <MdAddAPhoto size="1.5em" color="#fff"/>
                                    </div>
                                    <h1 className={classes.mainh1} >Add photo</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            {
                redirectPhoto ? <Redirect to="/addPhoto" /> : null
            }
            {
                redirectBlog ? <Redirect to="/addPost" /> : null
            }
        </Backdrop>
    )
}
 
export default AddItemsForm;


