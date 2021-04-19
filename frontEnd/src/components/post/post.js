import React from 'react';
import { Link } from 'react-router-dom';

import classes from './post.module.css';
import Button from '../UI/button';

const post = (props) => (
    <div className={classes.Card}>
        <div className={classes.contentWrapperSmaller}>
        <Link to={"/post?id="+props.id} style={{textDecoration: "none", color: "black"}}>
            <h1>{props.title}</h1>
        </Link> 
        </div>
        <div className={classes.contentWrapperSmaller}>
            <h2>@{props.author}</h2>
        </div>
        <div className={classes.contentWrapper}>
            <p>{props.content}</p>
        </div>
        <p>(see the full blog to read further)</p>
        <div className={classes.btnWrapper}>
            <Button clicked={()=>props.edit(props.id)}>Edit</Button>
            <Button clicked={()=>props.delete(props.id)}>Delete</Button>
        </div>
    </div>
);
 
export default post;