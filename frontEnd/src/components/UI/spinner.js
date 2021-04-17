import React from 'react';

import classes from './spinner.module.css';

//author of the spinner: Luke Haas  
//https://twitter.com/lukehaas

const spinner = () => {
    return (
        <div className={classes.loader}></div>
    );
}
 
export default spinner;