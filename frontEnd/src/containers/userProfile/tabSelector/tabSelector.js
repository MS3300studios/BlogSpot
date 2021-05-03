import React from 'react';

import classes from './tabSelector.module.css';

import BlogsTab from '../tabs/Blogs';

const TabSelector = (props) => {
    let display;
    if(props.selectedOption === "Blogs"){
        display = <BlogsTab userId={props.userId} />
    }
    return (
        <div className={classes.mainContainer}>
            {display}
        </div>
    );
}
 
export default TabSelector;

