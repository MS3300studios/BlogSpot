import axios from 'axios';
import React, {useState, useEffect} from 'react';
import Button from '../UI/button';
import { MAIN_URI } from '../../config';
import { Link } from 'react-router-dom';
import UserPhoto from '../UI/userphoto';

const Banning = () => {
    const [password, setpassword] = useState("")
    const [userID, setuserID] = useState("");
    const [success, setsuccess] = useState(null);
    const [bannedUsers, setbannedUsers] = useState([]);
    const [loadingBannedUsers, setloadingBannedUsers] = useState(true);

    useEffect(() => {
        axios({
            method: 'get',
            url: `${MAIN_URI}/bannedUsers`,
        })
        .then((res)=>{
            if(res.status===200){
                setbannedUsers(res.data);
                setloadingBannedUsers(false);
            }
        })
        .catch(error => {
            console.log(error);
        })        
    }, [])

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
            if(res.status===201 && !res.data.error){
                setuserID("");
                setsuccess(true);
                axios({
                    method: 'get',
                    url: `${MAIN_URI}/bannedUsers`,
                })
                .then((res)=>{
                    if(res.status===200){
                        setbannedUsers(res.data);
                        setloadingBannedUsers(false);
                    }
                })
                .catch(error => {
                    console.log(error);
                }) 
            } else setsuccess(false);
        })
        .catch(error => {
            console.log(error);
        })
    }

    const removeBan = (id, index) => {
        axios({
            method: 'post',
            url: `${MAIN_URI}/removeBan`,
            data: {id}
        })
        .then((res)=>{
            if(res.status===200){
                axios({
                    method: 'get',
                    url: `${MAIN_URI}/bannedUsers`,
                })
                .then((res)=>{
                    if(res.status===200){
                        setbannedUsers(res.data);
                    }
                })
                .catch(error => {
                    console.log(error);
                })    
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    const refresh = () => {
        axios({
            method: 'get',
            url: `${MAIN_URI}/bannedUsers`,
        })
        .then((res)=>{
            if(res.status===200){
                setbannedUsers(res.data);
            }
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
                    <>
                    <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
                        <div>
                            <h2 style={{color: "white"}}>User ID:</h2>
                            <input value={userID} onChange={e => setuserID(e.target.value)} style={{
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
                    <hr />
                    <div style={{marginLeft: "10px"}}>
                        <Button clicked={refresh}>refresh</Button>
                    </div>
                    <div style={{display: "flex", flexWrap: "wrap", width: "100%", padding: "10px"}}>
                        {
                            loadingBannedUsers ? <p>loading...</p> : (
                                <>
                                    {
                                        bannedUsers.map((user, index) => {
                                            return (
                                                <div key={index} style={{
                                                    border: "3px dashed seagreen",
                                                    margin: "15px",
                                                    padding: "10px"
                                                }}>
                                                    <Link to={`/user/profile?id=${user.bannedUserId}`}>
                                                        <UserPhoto userId={user.bannedUserId} small hideOnlineIcon/>
                                                    </Link>
                                                    <p style={{color: "white"}}>{user.bannedUserId}</p>
                                                    <Button btnType="Cancel" clicked={()=>removeBan(user.bannedUserId)}>Revoke Ban</Button>
                                                </div>
                                            )
                                        })
                                    }
                                </>
                            )
                        }
                    </div>
                    </>
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