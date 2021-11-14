import React, { useState } from 'react';
import DropZone from './containers/PhotoForm/dropZone';
import imageCompression from 'browser-image-compression'; 

const Testphotos = (props) => {
    const [imagePre, setimagePre] = useState(null);
    const [imagePost, setimagePost] = useState(null);

    const [precompressionsize, setprecompressionsize] = useState(null);
    const [postcompressionsize, setpostcompressionsize] = useState(null);

    const [compressingImageActive, setcompressingImageActive] = useState(false);

    const photosubmit = (files) => {
        setcompressingImageActive(true); //enable loading text on front  
        const reader = new FileReader();
                
        if(files.length>0){
            setprecompressionsize(files[0].size / 1024 / 1024) //inject file size into html from state value
            reader.readAsDataURL(files[0]); //convert to base64 before displaying preview
            reader.onloadend = () => setimagePre(reader.result); //set state value to the base64 encoded image

            imageCompression(files[0], { maxSizeMB: 0.3, maxWidthOrHeight: 1920, initialQuality: 1, maxIteration: 20}).then(compressedBlob => {
                setcompressingImageActive(false); //disable loading text on front
                
                setpostcompressionsize(compressedBlob.size / 1024 / 1024); //set file size to the front end

                reader.readAsDataURL(compressedBlob); //convert compressed image to base64 to be stored in database
            
                reader.onloadend = () => setimagePost(reader.result) //unnecesairy
            })
        }            
    }

    const imgStyle = {
        width: "60%",
        height: "60%"
    }

    return (
        <div style={{color: "#fff"}}>
            <h1>Pre compression:</h1>
            <img src={imagePre} alt="unable to load" style={imgStyle}/>
            <p>image size pre compression: {Number.parseFloat(precompressionsize).toFixed(2)} mb</p>           
            <h1>Post compression</h1>
            {
                compressingImageActive ? <p>compressing...</p> : (
                    <>
                    <img src={imagePost} alt="unable to load" style={imgStyle}/>
                    <p>image size post compression: {Number.parseFloat(postcompressionsize).toFixed(2)} mb</p>           
                    </>
                )
            }
            <DropZone photoSubmit={photosubmit}/>
        </div>
    );
}
 
export default Testphotos;