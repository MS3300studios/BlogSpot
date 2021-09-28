import React, {useState} from 'react';
import classes from './Reporting.module.css';

import Button from '../UI/button';
import axios from 'axios';
import {MAIN_URI} from '../../config';
import getToken from '../../getToken';
import { Redirect } from 'react-router';

const Reporting = () => {
    const [text, settext] = useState("");
    const [tooMuchText, settooMuchText] = useState(false);
    const [submitSuccessful, setsubmitSuccessful] = useState(false);
    const [redirect, setredirect] = useState(false);

    const submitComplaint = () => {
        setsubmitSuccessful(true);
        setTimeout(() => {
            setredirect(true);
        }, 3000);

        // const token = getToken();
        // axios({
        //     method: 'post',
        //     url: `${MAIN_URI}/reportBug`,
        //     headers: {"Authorization": token},
        //     data: {text: text}
        // })
        // .then((res)=>{
        //     if(res.status===201){
                
        //     }
        // })
        // .catch(error => {
        //     console.log(error);
        // })
    }

    return (
        <>
            <div className={classes.center}>
                <h1 style={{color: "white"}}>Reporting</h1>
            </div>
            <div className={classes.center}>
                <div className={classes.reportingContainer}>
                    <textarea 
                        placeholder="What bug did you face? At the end of your message type what was the URL when this happened. (max 1000 characters)"
                        onChange={(e)=>{
                            if(text.length > 10){
                                settooMuchText(true);
                            }
                            else{
                                settooMuchText(false);
                            }
                            settext(e.target.value);
                        }}
                        value={text}
                        style={tooMuchText ? {border: "3px lightsalmon solid"} : {border: "none"}}
                        >
                    </textarea>
                    {
                        tooMuchText ? <p style={{color: "lightsalmon"}}>you've extended the limit of 1000 characters</p> : null
                    }
                    <br />
                    <Button clicked={submitComplaint} disabled={tooMuchText}>Submit</Button>
                    {
                        submitSuccessful ? (
                            <>
                                <p style={{color: "greenyellow"}}>Your complaint has been noted. Thank you for helping to improve BragSpot!</p>
                                <p style={{color: "gray"}}>redirecting...</p>
                            </>
                        ) : null
                    }
                    {
                        redirect ? <Redirect to="/" /> : null
                    }
                </div>
            </div>
        </>
    );
}
 
export default Reporting;