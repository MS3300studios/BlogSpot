import React from 'react';

import classes from './tabSelector.module.css';

import BlogsTab from '../tabs/Blogs';

const TabSelector = (props) => {

    return (
        <div className={classes.mainContainer}>
            <BlogsTab data={props.selectedOption} />
        </div>
    );
}
 
export default TabSelector;

