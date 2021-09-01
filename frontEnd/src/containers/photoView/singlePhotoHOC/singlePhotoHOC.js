import React, { useEffect, useState } from 'react';
import axios from 'axios';

import PhotoView from "../photoView";
import Spinner from '../../../components/UI/spinner';
import { Redirect, withRouter } from 'react-router-dom';
import getToken from '../../../getToken';
import Button from '../../../components/UI/button';

const SinglePhotoHigherOrderComponent = (props) => {
    const [loading, setloading] = useState(true);
    const [photo, setphoto] = useState(null);
    const [redirectMain, setredirectMain] = useState(false);
    const [error, seterror] = useState(false);

    useEffect(() => {
        let token = getToken();
        let queryParams = new URLSearchParams(props.location.search);
        let photoId = queryParams.get('id');

        axios({
            method: 'get',
            url: `http://localhost:3001/photos/getone/${photoId}`,
            headers: {'Authorization': token}
        })
        .then((res)=>{
            if(res.status===200 && res.data.photo !== undefined){
                setphoto(res.data.photo);
                setloading(false);
                return;
            }
            else{
                seterror(true);
                setloading(false);
            }
        })
        .catch(error => {
            console.log(error);
        })
    }, [props.location.search])

    return (
        <>
            {
                loading ? <Spinner /> : (
                    <>
                        {
                            error ? (
                                <div style={{display: "flex", justifyContent: "center", width: "100%", alignItems: "center"}}>
                                    <div>
                                        <h1>There was an unexpected error</h1>
                                        <div style={{display: "flex", justifyContent: "center", width: "100%", alignItems: "center"}}>
                                            <Button clicked={()=>setredirectMain(true)}>Go back to the main page</Button>
                                        </div>
                                    </div>
                                </div>
                            ) : <PhotoView photo={photo} closeBigPhoto={()=>setredirectMain(true)}/>
                        }
                    </>
                )
            }
            {
                redirectMain ? <Redirect to="/" /> : null
            }
        </>
    );
}
 
export default withRouter(SinglePhotoHigherOrderComponent);