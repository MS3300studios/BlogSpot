import React, { Component } from 'react';

import classes from './PhotosTab.module.css';

import photo1 from '../../../assets/userPhoto/image (1).jfif'
import photo2 from '../../../assets/userPhoto/image (2).jfif'
import photo3 from '../../../assets/userPhoto/image (3).jfif'
import photo4 from '../../../assets/userPhoto/image (4).jfif'
import photo5 from '../../../assets/userPhoto/image (14).jfif'

class PhotosTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: [
                photo1,
                photo2,
                photo3,
                photo4,
                photo5,
            ]
        }
    }
    render() { 
        return (
            <div className={classes.center}>
                <div className={classes.photosTabContainer}>
                    {
                        this.state.photos.map((photo, index)=>{
                            return (
                                <div className={classes.panel}>
                                    <img src={photo} alt="aphoto.description" key={index}/>
                                    <div className={classes.photoData}>
                                        <p>click to see the entire photo!</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        );
    }
}
 
export default PhotosTab;