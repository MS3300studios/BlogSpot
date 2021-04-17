import React from 'react';

import classes from './flash.module.css';

const flash = (props) => {

    let classNames = [classes.Flash];
    
    if(props.close){
        classNames.push(classes.Close);
    }

    return ( 
        <div className={classNames.join(' ')}>
            <p>{props.children}</p>
        </div>
    );
}
 
export default flash;