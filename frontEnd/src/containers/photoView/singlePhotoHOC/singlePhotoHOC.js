import React, { useEffect, useState } from 'react';
import axios from 'axios';

import PhotoView from "../photoView";
import Spinner from '../../../components/UI/spinner';
import { Redirect, withRouter } from 'react-router-dom';
import getToken from '../../../getToken';

const SinglePhotoHigherOrderComponent = (props) => {
    const [loading, setloading] = useState(true);
    const [photo, setphoto] = useState(null);
    const [redirectMain, setredirectMain] = useState(false);

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
            if(res.status===200){
                console.log(res.data.photo);
                setphoto(res.data.photo);
                setloading(false);
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    }, [])

    return (
        <>
            {
                loading ? <Spinner /> : <PhotoView photo={photo} closeBigPhoto={()=>setredirectMain(true)}/>
            }
            {
                redirectMain ? null : <Redirect to="/" />
            }
        </>
    );
}
 
export default withRouter(SinglePhotoHigherOrderComponent);