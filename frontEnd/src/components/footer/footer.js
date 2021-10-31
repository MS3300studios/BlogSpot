import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

const Footer = (props) => {

    const display = props.location.pathname === "/";
    const pStyle = { margin: "0px" };
    const footerStyle = {
        width: "100%", 
        display: "flex", 
        justifyContent: "center", 
        color: "white",
        marginTop: "50px"
    }

    return (
        <>
            {
                display ? (
                    <footer style={footerStyle}>
                        <div style={{padding: "10px"}}>
                        <p style={pStyle}>Copyright © 2021 Mikołaj Strusiński</p>
                        <p style={pStyle}>terms and conditions: <Link to="/termsAndConditions">/termsAndConditions</Link></p>
                        </div>
                    </footer>
                ) : null
            }
        </>
    );
}
 
export default withRouter(Footer);