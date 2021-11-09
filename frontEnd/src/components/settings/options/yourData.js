import React from 'react';

import classes from './yourData.module.css';

const YourData = () => {
    return (
        <div className={classes.yourDataContainer}>
            <h1 style={{display: "flex", justifyContent: "center", color: "white", fontSize: "18px", fontWeight: "550"}}>
                This option hasn't yet been developed. If you want to manage your data, i.e. delete or edit activity, you can go to menu, and press "my activity" button                
            </h1>
        </div>
    );
}
 
export default YourData;