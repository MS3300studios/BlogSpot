import React from 'react';
import { Link } from 'react-router-dom';
import Button from './button';
const UserNotFound = () => {
    return (
        <>
        <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
            <h1 style={{color: "white"}}>404: User was not found</h1>
        </div>
        <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
            <Link to="/" style={{textDecoration: "none", color: "unset"}}>
                <Button>Back to Dashboard</Button>
            </Link>
        </div>
        </>
    );
}
 
export default UserNotFound;