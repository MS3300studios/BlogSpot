import React, { useState } from 'react';

import classes from './selectPanel.module.css';
import classes2 from './addingConversation.module.css';

import AddingConversation from './addingConversation';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { ImEnter } from 'react-icons/im';
import { BiMessageAdd } from 'react-icons/bi';

const SelectPanel = (props) => {
    return (
        <div className={classes2.backDrop}>
            <div className={classes2.addUserContainer}>
                <div className={classes2.closeIcon} onClick={props.closeAddConversation}>
                    <AiOutlineCloseCircle size="2em" color="#0a42a4" />
                </div>
                <div className={classes.cardsContainer}>
                    <div className={classes.optionCard}>
                        <div className={classes.centerIcon}>
                            <ImEnter size="7em" color="#fff"/>
                        </div>
                        <h1 className={classes.center}>Join an existing conversation</h1>
                    </div>
                    <div className={classes.optionCard}>
                        <div className={classes.centerIcon}>
                            <BiMessageAdd size="7em" color="#fff"/>
                        </div>
                        <h1 className={classes.center}>Create a new conversation</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default SelectPanel;