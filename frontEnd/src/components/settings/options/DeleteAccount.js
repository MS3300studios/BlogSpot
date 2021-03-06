import React, {useState} from 'react';

import classes from './deleteAccount.module.css';
import Button from '../../UI/button';
import { Redirect } from 'react-router-dom';
import Flash from '../../UI/flash';

const DeleteAccount = () => {
    const [redirectMain, setredirectMain] = useState(false)
    const [flashNotClosed, setflashNotClosed] = useState(true);
    const [flashMessage, setflashMessage] = useState("");

    const sendRequest = () => {
        flash('feature not yet accessible');
    }

    const flash = (message) => {
        setflashMessage(message);
        
        setTimeout(()=>{
            setflashNotClosed(false);
        }, 2000)
        
        setTimeout(()=>{
            setflashMessage("");
        }, 3000);
        
        setTimeout(()=>{
            setflashNotClosed(true);
        }, 3000);
    }

    let flComp = null;
    if(flashMessage && flashNotClosed){
        flComp = <Flash>{flashMessage}</Flash>
    }
    else if(flashMessage && flashNotClosed === false){
        flComp = <Flash close>{flashMessage}</Flash>
    }

    return (
        <div className={classes.deleteAccountContainer}>
            <div style={{marginLeft: "25px"}}>
                <h1>Deleting account</h1>
                <h3>This process is irreversable, when you click delete, your account and all of the content related to it will be deleted.</h3>
            </div>
            <div className={classes.buttonsContainer}>
                <Button clicked={()=>setredirectMain(true)}>Abort</Button>
                <Button btnType="Cancel" clicked={sendRequest}>Delete</Button>
            </div>
            {redirectMain ? <Redirect to="/" /> : null}
            {flComp}
        </div>
    );
}
 
export default DeleteAccount;