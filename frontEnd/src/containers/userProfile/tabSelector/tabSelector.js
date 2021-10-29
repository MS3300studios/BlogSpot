import React from 'react';

import classes from './tabSelector.module.css';

import BlogsTab from '../tabs/Blogs';
import PhotosTab from '../tabs/PhotosTab';
import getColor from '../../../getColor';

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
            display = <h1>Coming soon!</h1>
            break;
        case "Badges":
            display = <h1>Coming soon!</h1>
            break;
        default:
            break;
    }

    const colorScheme = getColor();
    let backgroundColor = {backgroundColor: "#70c45c"}; 
    if(colorScheme === "blue"){
        backgroundColor = {backgroundColor: "hsl(210deg 66% 52%)"};
    }

    return (
        <div className={classes.mainContainer} style={backgroundColor}>
            {display}
        </div>
    );
}
 
export default TabSelector;

