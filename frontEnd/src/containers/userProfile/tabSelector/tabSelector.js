import React from 'react';

import classes from './tabSelector.module.css';

import BlogsTab from '../tabs/Blogs';
import PhotosTab from '../tabs/PhotosTab';
import getColor from '../../../getColor';
import getMobile from '../../../getMobile';

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
    let customWidth = "60%";
    let customPadding = "25px";
    if(getMobile()){
        customWidth = "100%";
        customPadding = "5px"
    }
 
    let backgroundColor = {marginTop: "10px", backgroundColor: "#70c45c", width: customWidth, padding: customPadding}; 
    if(colorScheme === "blue"){
        backgroundColor = {marginTop: "10px", backgroundColor: "hsl(210deg 66% 52%)", width: customWidth, padding: customPadding};
    }

    return (
        <div className={classes.mainContainer} style={backgroundColor}>
            {display}
        </div>
    );
}
 
export default TabSelector;

