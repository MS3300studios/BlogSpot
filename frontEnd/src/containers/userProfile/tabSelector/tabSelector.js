import React from 'react';

import classes from './tabSelector.module.css';

import BlogsTab from '../tabs/Blogs';
import PhotosTab from '../tabs/PhotosTab';
import FriendsList from '../../FriendsList/FriendsList';

const TabSelector = (props) => {
    let display;
    switch (props.selectedOption) {
        case "Blogs":
            display = <BlogsTab userId={props.userId} />
            break;
        case "Photos":
            display = <PhotosTab userId={props.userId} />
            break;
        case "Friends":
            display = <FriendsList profileViewComponent={props.userId}/>
            break;
        case "Badges":
            display = <h1>Coming soon!</h1>
            break;
        default:
            break;
    }
    return (
        <div className={classes.mainContainer}>
            {display}
        </div>
    );
}
 
export default TabSelector;

