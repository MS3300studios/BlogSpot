import React, { Component } from 'react';
import classes from './youractivites.module.css';

import Dashboard from '../../containers/dashboard/dashboard';
import PhotosList from '../../containers/photosList/photosList';

class YourActivities extends Component {
    constructor(props){
        super(props);
        this.state = {
            view: "posts"
        }
    }
    render() { 
        let content; 
        if(this.state.view === "posts"){
            content = <Dashboard />
        }
        else if(this.state.view === "photos"){
            content = <PhotosList />
        }

        return (
            <React.Fragment>
                <div className={classes.yourActivitiesContainer}>
                    <div className={classes.switchMenuContainer}>
                        <div className={classes.radioList}>
                            <label>posts</label>
                            <input className={classes.input1} type="radio" checked={this.state.view === "posts"} onChange={()=>this.setState({view: "posts"})}/>
                            <br />
                            <label>photos</label>
                            <input className={classes.input2} type="radio" checked={this.state.view === "photos"} onChange={()=>this.setState({view: "photos"})}/>
                        </div>
                    </div>
                {content}
                </div>
            </React.Fragment>
        );
    }
}
 
export default YourActivities;