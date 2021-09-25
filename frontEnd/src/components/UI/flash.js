import React from 'react';
import getColor from '../../getColor';

import classes from './flash.module.css';

const flash = (props) => {
    const colorScheme = getColor();
    let background = {backgroundColor: "lightgoldenrodyellow", color: "black", border: "5px solid #6bb94c"};
    if(colorScheme === "blue"){
        background = {backgroundColor: "hsl(218deg 82% 63%)", color: "white", border: "5px solid #6bb94c"};
    }

    let classNames = [classes.Flash];
    if(props.close){
        classNames.push(classes.Close);
    }

    return ( 
        <div className={classNames.join(' ')} style={background}>
            <p>{props.children}</p>
        </div>
    );
}
 
export default flash;