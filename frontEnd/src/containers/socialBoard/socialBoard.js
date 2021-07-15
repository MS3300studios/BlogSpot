import React, { Component } from 'react';

import classes from './socialBoard.module.css';

class SocialBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return (
            <div className={classes.mainContainer}>
                <h1>are you there?!</h1>
            </div>
        );
    }
}
 
export default SocialBoard;