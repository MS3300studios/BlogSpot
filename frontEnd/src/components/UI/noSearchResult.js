import React from 'react';

import classes from './noSearchResult.module.css';
import BlogSpotBotLoopWorried from '../../assets/gfx/noSearchResult.png';
import getMobile from '../../getMobile';

const noSearchResult = () => {
    return (
        <>
            {
                getMobile() ? (
                    <div style={{display: "flex", justifyContent: 'center', width: "100%"}}>
                        <h1 style={{color: "white", fontSize: "20px"}}>You haven't posted anything yet!</h1>
                    </div>
                ) : (
                    <div className={classes.container}>
                        <img className={classes.BlogSpotBot} src={BlogSpotBotLoopWorried} alt="I didn't find anything"/>
                        <div className={classes.text}>We found no posts matching your query</div>
                    </div>
                )
            }
        </>
    );
}
 
export default noSearchResult;