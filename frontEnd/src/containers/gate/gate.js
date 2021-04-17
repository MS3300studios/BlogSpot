import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import classes from './gate.module.css';
import Button from '../../components/UI/button';

import manLeft from '../../assets/gfx/manLeft.png';
import manRight from '../../assets/gfx/manRight.png';
import speechRight from '../../assets/gfx/speechRight.png';
import speechLeft from '../../assets/gfx/speechLeft.png';
import BlogSpotLogo from '../../assets/gfx/BlogSpotLogo.png';

class Gate extends Component {
    state = {

    }
    render() { 
        return (
            <React.Fragment>
                <div className={classes.flexCenter}>
                    <div className={classes.imgsContainer}>
                        <img src={manLeft} className={classes.manLeft} alt="failed to load" />
                        <img src={manRight} className={classes.manRight} alt="failed to load" />
                        <img src={speechRight} className={classes.speechRight} alt="failed to load" />
                        <img src={speechLeft} className={classes.speechLeft} alt="failed to load" />
                        <img src={BlogSpotLogo} className={classes.BlogSpotLogo} alt="failed to load" />
                    </div>
                    <h1 className={classes.gateWelcomeH1}>Welcome to BlogSpot!</h1>
                    <div className={classes.cardContainer_gate}>
                        <div className={classes.card}>
                            <h1>Your first time here?</h1>
                            <Link to="/register"><Button>register</Button></Link>
                        </div>
                        <div className={classes.card}>
                            <h1>Visiting us again?</h1>
                            <Link to="/login"><Button>login</Button></Link>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
 
export default Gate;