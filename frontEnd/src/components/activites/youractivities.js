import React, { Component } from 'react';

import Dashboard from '../../containers/dashboard/dashboard';
import PhotosList from '../../containers/photosList/photosList';

import classes from './youractivites.module.css';
import getColor from '../../getColor';
import getMobile from '../../getMobile';

const colorScheme = getColor();

class YourActivities extends Component {
    constructor(props){
        super(props);
        this.state = {
            view: "posts"
        }

        this.isMobile = getMobile();
    }

    render() { 
        let content; 
        if(this.state.view === "posts"){
            content = <Dashboard isMobile={this.isMobile}/>
        }
        else if(this.state.view === "photos"){
            content = <PhotosList />
        }

        let backgroundSwitchMenuStyle = {backgroundColor: "#82ca66"} 
        if(colorScheme === "blue"){
            backgroundSwitchMenuStyle = {backgroundColor: "hsl(210deg 66% 52%)"} 
        }

        return (
            <React.Fragment>
                <div className={classes.yourActivitiesContainer}>
                    <div className={classes.switchMenuContainer} style={backgroundSwitchMenuStyle}>
                        <div className={classes.radioList}>
                            <label>posts</label>
                            <input className={classes.input1} type="radio" checked={this.state.view === "posts"} onChange={()=>this.setState({view: "posts"})}/>
                            <br />
                            <label>photos</label>
                            <input className={classes.input2} type="radio" checked={this.state.view === "photos"} onChange={()=>this.setState({view: "photos"})}/>
                        </div>
                    </div>
                {this.isMobile ? <div style={{marginTop: "130px"}}></div> : null}
                {content}
                </div>
            </React.Fragment>
        );
    }
}
 
export default YourActivities;