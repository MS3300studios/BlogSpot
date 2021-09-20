import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

import Button from '../UI/button';
import getUserData from '../../getUserData';
import axios from 'axios';

import getToken from '../../getToken';
import getColor from '../../getColor';

import classes from './post.module.css';
import greenClasses from './greenClasses.module.css';
import blueClasses from './blueClasses.module.css';

const colorScheme = getColor();
let colorClasses = greenClasses;
if(colorScheme === "blue"){
    colorClasses = blueClasses;
}

const Post = (props) => {
    let userLoggedData = getUserData();

    console.log(colorClasses)

    const [loading, setloading] = useState(props.socialBoard);
    const [userData, setuserData] = useState({});
    const [nickname, setnickname] = useState(userLoggedData.nickname)
    let token = getToken();

    useEffect(() => {
        if(props.socialBoard && (props.loading !== true)){
            axios({
                method: 'get',
                url: `http://localhost:3001/users/getUser/${props.author}`,
                headers: {'Authorization': token}
            })
            .then((res)=>{
                setuserData(res.data.user);
                setnickname(res.data.user.nickname);
                setloading(false);
            })
            .catch(error => {
                console.log(error);
            })
        }
        // else if(props.dashboard) setloading(false); 
    }, [props.socialBoard, props.author, token, props.loading])

    //if in socialBoard then author prop is an ID, and has to be adjusted.
    let tempCompareVal = userLoggedData.nickname;
    if(props.socialBoard) tempCompareVal = userLoggedData._id;

    return (
        <>
            {
                (loading || props.loading) ? (
                    <div className={colorClasses.Card}>
                        <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                            <div className={classes.skel_heading}></div>
                        </div>
                        <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                            <div className={classes.skel_pictureNameContainer}>
                                <div className={classes.skel_img}></div>
                                <p></p>
                            </div>
                        </div>
                        <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                            <div className={classes.skel_textContainer}>
                                <p></p>
                                <p></p>
                                <p></p>
                                <p></p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={colorClasses.Card}>
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
                            (props.author===tempCompareVal && !props.socialBoard) ? (
                                <div className={classes.btnWrapper}>
                                    <Button clicked={()=>props.edit(props.id)}>Edit</Button>
                                    <Button clicked={()=>props.delete(props.id)}>Delete</Button>
                                </div> 
                            ) : null
                        }
                    </div>
                )
            }
        </>
    )
};
 
export default Post;