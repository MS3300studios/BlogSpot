import React from 'react';

import classes from './tabSelector.module.css';

const TabSelector = (props) => {

    return (
        <div className={classes.mainContainer}>
            <h1>{props.selectedOption}</h1>
        </div>
    );
}
 
export default TabSelector;

