import React from 'react';

import classes from './spinner.module.css';

//author of the spinner: Luke Haas  
//https://twitter.com/lukehaas

const spinner = (props) => {
    let classNames = [classes.loader];
    
    if(props.darkgreen){
        classNames.push(classes.darkgreen);
    }
    if(props.small){
        classNames.push(classes.small);
    }
    return (
        <div className={classNames.join(" ")}></div>
    );
}
 
export default spinner;