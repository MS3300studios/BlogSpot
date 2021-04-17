import React from 'react';
import { Link } from 'react-router-dom';

import classes from './logo.module.css';
import logo from '../../assets/gfx/BlogSpotLogo.png';

const Logo = () => (
    <div className={classes.Logo}>
        <Link to="/">
            <img alt="logo" src={logo}/>
        </Link>
    </div>
)

export default Logo;