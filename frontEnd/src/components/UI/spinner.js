import React, {useEffect, useState} from 'react';

import classes from './spinner.module.css';
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

    const [content, setContent] = useState(loader);

    useEffect(() => {
        if(!props.small){
            return
        }

        const timer = setTimeout(()=>{
            setContent(
                <div className={classes.again}>
                    <span>
                        <p>Loading failed</p>
                    </span>
                </div>
            );
        }, 15000)
        return () => {
            clearTimeout(timer);
        }
    }, [props.small])

    return (
        <>
            {content}
        </>
    );
}
 
export default Spinner;