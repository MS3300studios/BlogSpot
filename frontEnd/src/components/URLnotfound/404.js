import React from 'react';
import { Link } from 'react-router-dom';

import classes from './404.module.css';

import Button from '../UI/button';

const URLnotFound = () => {
    return (
        <div className={classes.URLnotFoundContainer}>
            <h1>404: NO SUCH URL</h1>
            <Link to="/"><Button>Go back to homepage</Button></Link>
        </div>
    );
}
 
export default URLnotFound;