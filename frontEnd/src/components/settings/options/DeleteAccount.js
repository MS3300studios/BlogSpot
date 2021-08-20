import React from 'react';

import classes from './deleteAccount.module.css';

import Button from '../../UI/button';

const DeleteAccount = () => {
    return (
        <div className={classes.deleteAccountContainer}>
            <div style={{marginLeft: "25px"}}>
                <h1>Deleting account</h1>
                <h3>This process is irreversable, when you click delete, your account and all of the content related to it will be deleted.</h3>
            </div>
            <div className={classes.buttonsContainer}>
                <Button >Abort</Button>
                <Button btnType="Cancel">Delete</Button>
            </div>
        </div>
    );
}
 
export default DeleteAccount;