import React, { useState, useEffect } from 'react';
import classes from './reports.module.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Button from '../UI/button';
import UserPhoto from '../UI/userphoto';

import { MAIN_URI } from '../../config';

const Reports = () => {
    const [loading, setloading] = useState(true);
    const [reports, setreports] = useState([]);
    const [password, setpassword] = useState(""); //has to match: "admin3300"
    const [verified, setverified] = useState(false);

    useEffect(() => {
        axios({
            method: 'get',
            url: `${MAIN_URI}/reports`,
        })
        .then((res)=>{
            if(res.status===200){
                setreports(res.data);
                setloading(false);
            }
        })
        .catch(error => {
            console.log(error);
        })        
    }, [])

    const Verify = () => {
        axios({
            method: 'get',
            url: `${MAIN_URI}/adminVerify/${password}`,
        })
        .then((res)=>{
            setverified(res.data.verified);
        })
        .catch(error => {
            console.log(error);
        })
    }

    const deleteReport = (id) => {
        axios({
            method: 'delete',
            url: `${MAIN_URI}/reports/${id}`
        })
        .then((res)=>{
            if(res.status===200){
                let newreports = reports.filter(report => report._id !== id);
                setreports(newreports);
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    return (
        <>
        {
            verified ? (    
                <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
                    {
                        loading ? <p>Loading ...</p> : (
                            <div className={classes.reportContainer}>
                                {
                                    reports.map((report, index) => {
                                        let style = {backgroundColor: "gray"};
                                        let isUser = true;
                                        if(report.type === "bug"){
                                            style = {backgroundColor: "lightblue"};
                                            isUser = false;
                                        }

                                        return (
                                            <div className={classes.report} style={style} key={index}>
                                                { (report.type === "bug") ? <h1>Bug</h1> : <h1>User</h1> }
                                                <p>Date: {report.createdAt}</p>
                                                <div style={{display: "flex", justifyContent: "space-around", alignItems: "center", width: "100%", marginTop: "-20px"}}>
                                                    <p>Author of report:</p>
                                                    <Link to={`/user/profile?id=${report.senderId}`}><UserPhoto userId={report.senderId} small hideOnlineIcon /></Link>
                                                </div>
                                                <p>{report.description}</p>
                                                {isUser ? (
                                                    <Link to={`/user/profile?id=${report.objectId}`}>Link to Reported profile</Link>
                                                ) : null}
                                                <div style={{marginTop: "50px"}}></div>
                                                <Button clicked={()=>deleteReport(report._id)} btnType="Cancel">
                                                    Delete Report
                                                </Button>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    }
                </div>
            ) : (
                <div style={{display: "flex", width: "100%", justifyContent: "center", marginTop: "20px"}}>
                    <input 
                        onChange={e=>setpassword(e.target.value)} 
                        style={{
                            width: "30vw",
                            border: "none",
                            borderRadius: "5px",
                            height: "4vh"
                        }}
                        onKeyPress={event => event.key === 'Enter' ? Verify() : null}
                    />
                    <Button clicked={Verify}>Send</Button>
                </div>
            )
        }
        </>
    );
}
 
export default Reports;