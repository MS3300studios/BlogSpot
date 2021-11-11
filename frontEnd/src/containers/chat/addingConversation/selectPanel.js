import React, { useState } from 'react';

import classes from './selectPanel.module.css';
import classes2 from './addingConversation.module.css';
import blue from './addingBlue.module.css';
import green from './addingGreen.module.css';

import getColor from '../../../getColor';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { ImEnter } from 'react-icons/im';
import { BiMessageAdd } from 'react-icons/bi';
import { Redirect } from 'react-router-dom';
let colorClasses = green;
const colorScheme = getColor();
if(colorScheme === "blue"){
    colorClasses = blue;
}

const SelectPanel = (props) => {
    const [redirect, setredirect] = useState("no")

    let redirectElement;
    if(redirect === "new") redirectElement = <Redirect to="/addConversation" />
    else if(redirect === "join") redirectElement = <Redirect to="/joinConversation" />
    else if(redirect === "no") redirectElement = null;

    return (
        <div className={classes2.backDrop}>
            {
                props.isMobile ? (
                    <div className={colorClasses.addUserContainer} style={{width: "100%", height: "85%", marginTop: "30px"}}>
                        <div className={classes2.closeIcon} onClick={props.closeAddConversation}>
                            <AiOutlineCloseCircle size="2em" color="#fff" />
                        </div>
                        <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <div className={classes.optionCardSmall} onClick={()=>setredirect("join")} style={{width: "200px", height: "200px"}}>
                                <div className={classes.centerIcon} style={{height: "60%"}}>
                                    <ImEnter size="3em" color="#fff"/>
                                </div>
                                <h1 className={classes.center}>Join an existing conversation</h1>
                            </div>
                        </div>
                        <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <div className={classes.optionCardSmall} onClick={()=>setredirect("new")} style={{width: "200px", height: "200px"}}>
                                <div className={classes.centerIcon} style={{height: "60%"}}>
                                    <BiMessageAdd size="3em" color="#fff"/>
                                </div>
                                <h1 className={classes.center}>Create a new conversation</h1>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={colorClasses.addUserContainer}>
                        <div className={classes2.closeIcon} onClick={props.closeAddConversation}>
                            <AiOutlineCloseCircle size="2em" color="#fff" />
                        </div>
                        <div className={classes.cardsContainer}>
                            <div className={classes.optionCard} onClick={()=>setredirect("join")}>
                                <div className={classes.centerIcon}>
                                    <ImEnter size="7em" color="#fff"/>
                                </div>
                                <h1 className={classes.center}>Join an existing conversation</h1>
                            </div>
                            <div className={classes.optionCard} onClick={()=>setredirect("new")}>
                                <div className={classes.centerIcon}>
                                    <BiMessageAdd size="7em" color="#fff"/>
                                </div>
                                <h1 className={classes.center}>Create a new conversation</h1>
                            </div>
                        </div>
                    </div>
                )
            }
            {redirectElement}
        </div>
    );
}
 
export default SelectPanel;