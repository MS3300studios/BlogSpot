import React, {useState, useEffect} from 'react';
import classes from './Reporting.module.css';

import Button from '../UI/button';
import axios from 'axios';
import {MAIN_URI} from '../../config';
import getToken from '../../getToken';
import { Redirect, withRouter } from 'react-router';

const Reporting = (props) => {
    const [text, settext] = useState("");
    const [tooMuchText, settooMuchText] = useState(false);
    const [submitSuccessful, setsubmitSuccessful] = useState(false);
    const [redirect, setredirect] = useState(false);
    const [reportType, setreportType] = useState(""); 
    let placeholder = "State the reason for reporting this user (eg Harassment, inappropriate content etc) (max 1000 characters)";
    if(props.location.pathname === "/reporting/bug"){
        placeholder = "What bug did you face? At the end of your message type what was the URL when this happened. (max 1000 characters)"
    }

    useEffect(() => {
        if(props.location.pathname === "/reporting/bug"){
            setreportType("bug");
        }
        else setreportType("user");
    }, [props.location.pathname])

    const submitComplaint = () => {
        const token = getToken();
        let url = `${MAIN_URI}/reportBug`;
        let data = {text: text, objectId: "none"};
        if(reportType === "user"){
            let queryParams = new URLSearchParams(props.location.search);
            url = `${MAIN_URI}/reportUser`;
            data = {
                text: text,
                objectId: queryParams.get('id')
            };
        }

        axios({
            method: 'post',
            url: url,
            headers: {"Authorization": token},
            data: data
        })
        .then((res)=>{
            if(res.status===201){
                setsubmitSuccessful(true);
                setTimeout(() => {
                    setredirect(true);
                }, 3000);
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    return (
        <>
            <div className={classes.center}>
                <h1 style={{color: "white"}}>Reporting</h1>
            </div>
            <div className={classes.center}>
                <div className={classes.reportingContainer}>
                    <textarea 
                        placeholder={placeholder}
                        onChange={(e)=>{
                            if(text.length > 1000){
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
                    <Button clicked={submitComplaint} disabled={tooMuchText || text.length < 1}>Submit</Button>
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
 
export default withRouter(Reporting);