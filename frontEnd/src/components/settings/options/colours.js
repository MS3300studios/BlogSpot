import React, {useState} from 'react';

import classes from './colours.module.css';
import mobileClasses from './mobileClassesColours.module.css'; 

import Button from '../../UI/button';
import classicGreen from '../../../assets/gfx/classicGreen.png'
import modernBlue from '../../../assets/gfx/modernBlue.png'
import vibrantRed from '../../../assets/gfx/vibrantRed.png'
import getColor from '../../../getColor';

const ColoursSettingsOption = (props) => {
    const [optionSelected, setoptionSelected] = useState(getColor());

    const savePressed = () => {
        localStorage.setItem("colorScheme", optionSelected);
        window.location.reload();
    }

    return (
        <>
            {
                props.isMobile ? (
                    <div className={mobileClasses.imgContainer}>
                        <div className={mobileClasses.center}>
                            <h1>Choose colour palette</h1>
                        </div>
                        <div className={mobileClasses.generalCenter} style={{marginTop: "-15px", marginBottom: "15px"}}>
                            <Button clicked={savePressed}>Save</Button>
                        </div>

                        <hr />

                        <div className={mobileClasses.generalCenter} onClick={()=>setoptionSelected("green")}>
                            <img src={classicGreen} alt="classic green" className={optionSelected === "green" ? mobileClasses.imgSelected : null}/>
                        </div>
                        <div className={mobileClasses.center}>
                            <p style={{fontSize: "16px", fontWeight: "500"}}>Classic green</p>
                        </div>

                        <div className={mobileClasses.generalCenter} onClick={()=>setoptionSelected("blue")}>
                            <img src={modernBlue} alt="modern blue" className={optionSelected === "blue" ? mobileClasses.imgSelected : null}/>
                        </div>
                        <div className={mobileClasses.center}>
                            <p style={{fontSize: "16px", fontWeight: "500"}}>Modern blue</p>
                        </div>

                        <div className={mobileClasses.generalCenter} onClick={()=>setoptionSelected("red")}>
                            <img src={vibrantRed} alt="vibrant red" className={optionSelected === "red" ? mobileClasses.imgSelected : null} />
                        </div>
                        <div className={mobileClasses.center}>
                            <p style={{fontSize: "16px", fontWeight: "500"}}>Vibrant red</p>
                        </div>
                    </div>
                ) : (
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
                                        <input type="radio" className={classes.imgInput} disabled checked={optionSelected === "red"} onChange={()=>setoptionSelected("red")} />
                                        <p style={{color: "gray"}}>vibrant red</p>
                                    </div>
                                </div>
                            </div>
                            <div className={classes.saveButtonContainer}>
                                <Button clicked={savePressed}>Save</Button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}
 
export default ColoursSettingsOption;