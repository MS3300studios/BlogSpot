import React from 'react';
import { Link } from 'react-router-dom';

import classes from './logo.module.css';
import logoGreen from '../../assets/gfx/BlogSpotLogo.png';
import logoBlue from '../../assets/gfx/BlogSpotLogoBlue.png';
import getColor from '../../getColor';

const colorScheme = getColor();
let logo = logoGreen;
if(colorScheme === "blue"){
    logo = logoBlue;
}

const Logo = (props) => (
    <div className={props.isMobile ? classes.LogoSmall : classes.Logo}>
        <Link to="/">
            <img alt="logo" src={logo}/>
        </Link>
    </div>
)

export default Logo;