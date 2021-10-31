import axios from 'axios';
import React, {useState} from 'react';
import { MAIN_URI } from '../../config';
import Button from '../UI/button';
import classes from './AdminHub.module.css';
import Banning from '../banning/banning';
import Reports from '../reports/reports';

const AdminHub = () => {
    const [optionSelected, setoptionSelected] = useState("");
    const [password, setpassword] = useState(""); 
    const [verified, setverified] = useState(false);
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

    let content = <p className={classes.default}>please select an option</p>
    if(optionSelected === "banning") content = <Banning password={password}/>
    else if(optionSelected === "reports") content = <Reports />

    return (
        <>
            {
                verified ? (
                    <div>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <div className={classes.option}>
                                <p>Banning: </p>
                                <input type="radio" checked={optionSelected === "banning"} onChange={()=>setoptionSelected("banning")}/>
                            </div>
                            <div className={classes.option}>
                                <p>Reports: </p>
                                <input type="radio" checked={optionSelected === "reports"} onChange={()=>setoptionSelected("reports")}/>
                            </div>
                        </div>
                        <hr />
                        {content}
                    </div>
                ) : (
                    <div style={{display: "flex", width: "100%", justifyContent: "center", marginTop: "20px"}}>
                        <input 
                            onChange={e=>setpassword(e.target.value)} 
                            style={{
                                width: "30vw",
                                border: "none",
                                borderRadius: "5px",
                                height: "4vh",
                                margin: "0px 10px 0px 0px"
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
 
export default AdminHub;