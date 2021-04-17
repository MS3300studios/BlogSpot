import React from 'react';

import classes from './noSearchResult.module.css';
import BlogSpotBotLoopWorried from '../../assets/gfx/noSearchResult.png';

const noSearchResult = () => {
    return (
        <div className={classes.container}>
            <img className={classes.BlogSpotBot} src={BlogSpotBotLoopWorried} alt="I didn't find anything"/>
            <div className={classes.text}>We found no posts matching your query</div>
        </div>
    );
}
 
export default noSearchResult;