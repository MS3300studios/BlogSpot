import React, {useState} from 'react';

import classes from './settings.module.css';
import green from './settingsGreen.module.css';
import blue from './settingsBlue.module.css';

import Colours from './options/colours';
import UnblockUsers from './options/unblockUsers';
import Language from './options/language';
import YourData from './options/yourData';
import DeleteAccount from './options/DeleteAccount';
import getColour from '../../getColor';

const colourScheme = getColour();
let background = { backgroundColor: "#82ca66" }; 
let colorClasses = green;
if(colourScheme === "blue"){
    colorClasses = blue;
    background = { backgroundColor: "hsl(210deg 66% 52%)" };
}

const Settings = () => {
    const defaultText = <h1 style={{color: "#fff"}}>Select options from the menu on the left</h1>
    const [selectedOption, setSelectedOption] = useState(defaultText)

    const select = (option) => {
        switch (option) {
            case "colours":
                setSelectedOption(<Colours />)
                break;

            case "unblock users":
                setSelectedOption(<UnblockUsers />)
                break;

            case "language":
                setSelectedOption(<Language />)
                break;
        
            case "your data":
                setSelectedOption(<YourData />)
                break;

            case "delete account":
                setSelectedOption(<DeleteAccount />)
                break;
        
            default:
                break;
        }
    }

    return (
        <div className={classes.settingsContainer}>
            <div className={classes.optionsContainer} style={background}>
                <div className={colorClasses.option} onClick={()=>select("colours")}>
                    <p>colours</p>
                </div>
                <div className={colorClasses.option} onClick={()=>select("unblock users")}>
                    <p>unblock users</p>
                </div>
                <div className={colorClasses.option} onClick={()=>select("language")}>
                    <p>language</p>
                </div>
                <div className={colorClasses.option} onClick={()=>select("your data")}>
                    <p>your data</p>
                </div>
                <div className={[colorClasses.option, classes.delete].join(" ")} onClick={()=>select("delete account")}>
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