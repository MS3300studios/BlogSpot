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
    }, [props.socialBoard, props.author, token])

    //if in socialBoard then author prop is an ID, and has to be adjusted.
    let tempCompareVal = userLoggedData.nickname;
    if(props.socialBoard) tempCompareVal = userLoggedData._id;

    return (
        <div className={classes.Card}>
            <div className={classes.contentWrapperSmaller}>
            <Link to={"/post/?id="+props.id} style={{textDecoration: "none", color: "black"}}>
                <h1>{props.title}</h1>
            </Link> 
            </div>
            {
                props.socialBoard ? (
                    <div className={classes.userInfoContainer}>
                        <img src={userData.photo} alt="user's face" className={classes.userPhoto} />
                        <h2><a href={"/user/profile/?id="+userData._id}
                            style={{color: "black", textDecoration: "none"}}
                        >@{nickname}</a></h2>
                    </div>
                )
                : (
                    <div className={classes.contentWrapperSmaller}>
                        <h2>@{nickname}</h2>
                    </div>
                )
            }
            <div className={classes.contentWrapper}>
                <p>{props.content}</p>
            </div>
            <p>(see the full blog to read further)</p>
            {
                (props.author===tempCompareVal) ? (
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