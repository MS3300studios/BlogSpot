import React from 'react';

import classes from './deleteAccount.module.css';
import Button from '../../UI/button';
import axios from 'axios';
import getToken from '../../../getToken';
import logout from '../../../logout';

const DeleteAccount = () => {
    const sendRequest = () => {
        const token = getToken();
        axios({
            method: 'delete',
            url: `http://localhost:3001/users/delete`,
            headers: {'Authorization': token}
        })
        .then((res)=>{
            if(res.status===200){
                logout();
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    return (
        <div className={classes.deleteAccountContainer}>
            <div style={{marginLeft: "25px"}}>
                <h1>Deleting account</h1>
                <h3>This process is irreversable, when you click delete, your account and all of the content related to it will be deleted.</h3>
            </div>
            <div className={classes.buttonsContainer}>
                <Button >Abort</Button>
                <Button btnType="Cancel" clicked={sendRequest}>Delete</Button>
            </div>
        </div>
    );
}
 
export default DeleteAccount;