import React from 'react';

import classes from './backdrop.module.css';

const backdrop = (props) => (
    props.show ? <div className={classes.Backdrop} onClick={props.clicked}>{props.children}</div> : null
);

export default backdrop;