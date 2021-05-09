import React, { Component } from 'react';

import classes from './FriendsList.module.css';

import photo1 from '../../assets/userPhoto/image (1).jfif';
import photo2 from '../../assets/userPhoto/image (2).jfif';
import photo3 from '../../assets/userPhoto/image (3).jfif';
import photo4 from '../../assets/userPhoto/image (4).jfif';
import photo5 from '../../assets/userPhoto/image (14).jfif';

class FriendsList extends Component {
    constructor(props){
        super(props);
        this.state = {
            photos: [
                photo1,photo2,photo3,photo4,photo5
            ]
        }
    }
    render() { 
        let faces = this.state.photos.map((photo) => {
            return (
                <div className={classes.face}>
                    <img src={photo} alt="user face"/>
                </div>
            )
        })

        return (
            <div className={classes.mainContainer}>
                <h1 className={classes.mainHeader}>Friends</h1>
                <div className={classes.center}>
                    <div className={classes.wrapper}>
                    {faces}
                    </div>
                </div>
            </div>
        );
    }
}
 
export default FriendsList;