import React, {useEffect, useState} from 'react';

import classes from './spinner.module.css';
import Button from '../UI/button';
//author of the spinner: Luke Haas  
//https://twitter.com/lukehaas

const Spinner = (props) => {
    let classNames = [classes.loader];
    
    if(props.darkgreen){
        classNames.push(classes.darkgreen);
    }
    if(props.small){
        classNames.push(classes.small);
    }

    let loader = <div className={classNames.join(" ")}></div>
    let again = (
        <div className={classes.again}>
            <span>
                <p>Loading failed</p>
            </span>
        </div>
    );

    const [content, setContent] = useState(loader);

    useEffect(() => {
        if(!props.small){
            return
        }
        
        const timer = setTimeout(()=>{
            setContent(again);
        }, 15000)
        return () => {
            clearTimeout(timer);
        }
    }, [])

    return (
        <>
            {content}
        </>
    );
}
 
export default Spinner;