import React, {useState} from 'react';

import classes from './settings.module.css';

import Colours from './options/colours';

const Settings = () => {
    const defaultText = <h1 style={{color: "#fff"}}>Select options from the menu on the left</h1>
    const [selectedOption, setSelectedOption] = useState(defaultText)

    const select = (option) => {
        switch (option) {
            case "colours":
                setSelectedOption(<Colours />)
                break;
        
            default:
                break;
        }
    }

    return (
        <div className={classes.settingsContainer}>
            <div className={classes.optionsContainer}>
                <div className={classes.option} onClick={()=>select("colours")}>
                    <p>colours</p>
                </div>
                <div className={classes.option} onClick={()=>select("unblock users")}>
                    <p>unblock users</p>
                </div>
                <div className={classes.option} onClick={()=>select("language")}>
                    <p>language</p>
                </div>
                <div className={classes.option} onClick={()=>select("your data")}>
                    <p>your data</p>
                </div>
                <div className={[classes.option, classes.delete].join(" ")} onClick={()=>select("delete account")}>
                    <p>delete account</p>
                </div>
            </div>
            <div className={classes.rightHandContainer}>
                {selectedOption}
            </div>
        </div>
    );
}
 
export default Settings;