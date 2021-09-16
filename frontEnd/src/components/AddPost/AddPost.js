import React, { useState } from 'react';

import classes from './AddPost.module.css';

import axios from 'axios';
import getToken from '../../getToken';



const AddPost = (props) => {
    const [Title, setTitle] = useState("");
    const [Content, setContent] = useState("");

    const sendData = () => {
        const token = getToken();

        axios({
            method: 'post',
            url: `http://localhost:3001/`,
            headers: {'Authorization': token},
            data: {}
        })
        .then((res)=>{
            if(res.status===200){
                
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    return (
        <div>
            ADD POST
        </div>
    );
}
 
export default AddPost;