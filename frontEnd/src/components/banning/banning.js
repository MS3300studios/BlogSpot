import axios from 'axios';
import React, {useState} from 'react';
import Button from '../UI/button';
import { MAIN_URI } from '../../config';

const Banning = () => {
    const [password, setpassword] = useState("")
    const [userID, setuserID] = useState("");
    const [success, setsuccess] = useState(null);

    const sendData = () => {
        if(userID === "") return null;
        axios({
            method: 'post',
            url: `${MAIN_URI}/banUser`,
            data: {
                password: password,
                userID: userID
            }
        })
        .then((res)=>{
            console.log(res.data.error)
            if(res.status===200 && res.data.error === null) setsuccess(true);
            else setsuccess(false);
        })
        .catch(error => {
            console.log(error);
        })
    }

    let successMessage;
    if(success === null) successMessage = null;
    else if(success === true) successMessage = <h3 style={{color: "lightgreen", fontWeight: "600"}}>Success!</h3>
    else if(success === false) successMessage = <h3 style={{color: "lightsalmon", fontWeight: "600"}}>Failure.</h3>

    return (
        <>
            {
                password === "admin3300" ? (
                    <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
                        <div>
                            <h2 style={{color: "white"}}>User ID:</h2>
                            <input onChange={e => setuserID(e.target.value)} style={{
                                marginRight: "20px",
                                borderRadius: "10px",
                                width: "300px",
                                height: "20px",
                                border: "none",
                                padding: "5px"
                            }}/>
                            <Button clicked={sendData} disabled={userID.length !== 24}>Send</Button>
                            {successMessage}
                        </div>
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
                        />
                    </div>
                )
            }
        </>
    );
}
 
export default Banning;