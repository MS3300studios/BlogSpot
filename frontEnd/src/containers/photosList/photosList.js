import React, { Component } from 'react';
import getToken from '../../getToken';
import getUserData from '../../getUserData';
import Photo from '../../components/photo/photo';

import classes from './photosList.module.css';

import image1 from '../../assets/userPhoto/image (1).jfif'
import image2 from '../../assets/userPhoto/image (2).jfif'
import image3 from '../../assets/userPhoto/image (3).jfif'
import image4 from '../../assets/userPhoto/image (4).jfif'
import image5 from '../../assets/userPhoto/image (14).jfif'

class PhotosList extends Component {
    constructor(props) {
        super(props);

        let token = getToken();
        let userData = getUserData();

        this.state = {
            token: token,
            userData: userData,
            photos: [
                image1,
                image2,
                image3,
                image4,
                image5
            ]
        }
    }
    render() { 
        return (
            <div className={classes.center}>
                <div className={classes.container}>
                    {
                        this.state.photos.map((photo, index) => {
                            return(
                                <Photo data={photo} key={index}/>
                            )
                        })
                    }
                </div>
            </div>
        );
    }
}
 
export default PhotosList;