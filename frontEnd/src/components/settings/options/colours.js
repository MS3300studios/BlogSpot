import React, {useState} from 'react';

import classes from './colours.module.css';

import Button from '../../UI/button';
import classicGreen from '../../../assets/gfx/classicGreen.png'
import modernBlue from '../../../assets/gfx/modernBlue.png'
import vibrantRed from '../../../assets/gfx/vibrantRed.png'

const ColoursSettingsOption = () => {
    const [optionSelected, setoptionSelected] = useState("green")

    return (
        <div className={classes.coloursContainer}>
            <div>
                <h1>Choose colour palette</h1>
                <div className={classes.screenshotsContainer}>
                    <div className={classes.imgContainer}>
                        <img src={classicGreen} alt="classic green"/>
                        <div className={classes.inputContainer}>
                            <input type="radio" className={classes.imgInput} checked={optionSelected === "green"} onChange={()=>setoptionSelected("green")} />
                            <p>classic green</p>
                        </div>
                    </div>
                    <div className={classes.imgContainer}>
                        <img src={modernBlue} alt="modern blue"/>
                        <div className={classes.inputContainer}>
                            <input type="radio" className={classes.imgInput} checked={optionSelected === "blue"} onChange={()=>setoptionSelected("blue")} />
                            <p>modern blue</p>
                        </div>
                    </div>
                    <div className={classes.imgContainer}>
                        <img src={vibrantRed} alt="vibrant red"/>
                        <div className={classes.inputContainer}>
                            <input type="radio" className={classes.imgInput} checked={optionSelected === "red"} onChange={()=>setoptionSelected("red")} />
                            <p>vibrant red</p>
                        </div>
                    </div>
                </div>
                <div className={classes.saveButtonContainer}>
                    <Button>Save</Button>
                </div>
            </div>
        </div>
    );
}
 
export default ColoursSettingsOption;