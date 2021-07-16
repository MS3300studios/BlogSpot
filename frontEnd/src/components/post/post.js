import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

import classes from './post.module.css';
import Button from '../UI/button';
import getUserData from '../../getUserData';
import axios from 'axios';
import getToken from '../../getToken';

const Post = (props) => {
    let userLoggedData = getUserData();

    const [userData, setuserData] = useState({});
    const [nickname, setnickname] = useState(userLoggedData.nickname)
    let token = getToken();

    useEffect(() => {
        if(props.socialBoard){
            axios({
                method: 'get',
                url: `http://localhost:3001/users/getUser/${props.author}`,
                headers: {'Authorization': token}
            })
            .then((res)=>{
                setuserData(res.data.user);
                setnickname(res.data.user.nickname);
            })
            .catch(error => {
                console.log(error);
            })
        }
    }, [])


    

    return (
        <div className={classes.Card}>
            <div className={classes.contentWrapperSmaller}>
            <Link to={"/post/?id="+props.id} style={{textDecoration: "none", color: "black"}}>
                <h1>{props.title}</h1>
            </Link> 
            </div>
            <div className={classes.contentWrapperSmaller}>
                <h2>@{nickname}</h2>
            </div>
            <div className={classes.contentWrapper}>
                <p>{props.content}</p>
            </div>
            <p>(see the full blog to read further)</p>
            {
                (props.author===userLoggedData._id) ? (
                    <div className={classes.btnWrapper}>
                        <Button clicked={()=>props.edit(props.id)}>Edit</Button>
                        <Button clicked={()=>props.delete(props.id)}>Delete</Button>
                    </div> 
                ) : null
            }
        </div>
    )
};
 
export default Post;