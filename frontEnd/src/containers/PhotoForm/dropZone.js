import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import classes from './dropZone.module.css';

const DropZone = (props) => {
    const onDrop = useCallback(acceptedFiles => {
        props.photoSubmit(acceptedFiles)
    }, [props])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
    
    let dropZoneClass;
    isDragActive ? dropZoneClass=classes.dropZoneActive : dropZoneClass=classes.dropZone;

    return (
        <div {...getRootProps()} className={dropZoneClass}>
            <input {...getInputProps()} />
            {
            isDragActive ?
                <p className={classes.dropZoneP}>Drop the files here ...</p> :
                <p className={classes.dropZoneP}>Drag and drop your photo here, or click to select a photo</p>
            }
        </div>
    )
}
 
export default DropZone;