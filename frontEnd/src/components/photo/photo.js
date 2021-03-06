import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { MAIN_URI } from '../../config';

import classes from './photo.module.css';
import {BsArrowsAngleExpand} from 'react-icons/bs';
import {AiOutlineDislike, AiOutlineLike} from 'react-icons/ai';
import {BiComment} from 'react-icons/bi';
import getToken from '../../getToken';
import axios from 'axios';
import Spinner from '../UI/spinner';

const Photo = (props) => {
    const [userData, setuserData] = useState({});
    const [nickname, setnickname] = useState("loading...");
    const [loading, setloading] = useState(true)
    const token = getToken();

    useEffect(() => {
        if(props.socialBoard){
            axios({
                method: 'get',
                url: `${MAIN_URI}/users/getUser/${props.photo.authorId}`,
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
    }, [props.socialBoard, props.photo.authorId, token])

    let className = classes.photoContainer;
    if(props.socialBoard) className = classes.photoContainerSmall

    return (
        <div className={className}>
            <img src={props.photo.data} alt="refresh your page" className={classes.normalImage}/>
            {props.socialBoard ? (
                <div className={classes.userInfoContainer}>
                    {
                        loading ? <Spinner /> : (
                            <>
                                <img src={userData.photo} alt="user's face" className={classes.userPhoto} />
                                <h2><Link to={"/user/profile/?id="+userData._id}
                                    style={{color: "white", textDecoration: "none"}}
                                >@{nickname}</Link></h2>
                            </>
                        )
                    }
                </div>
            ) : null}
            <div className={classes.expandIconBackground} onClick={()=>props.openBigPhoto(props.photo._id)}>
                <BsArrowsAngleExpand size="1.5em" color="white" />
            </div>
            <div className={classes.panel}>
                <p><AiOutlineLike />{props.photo.likes.length}</p>
                <p><AiOutlineDislike />  {props.photo.dislikes.length}</p>
                <p><BiComment /> {props.photo.comments.length}</p>
            </div>
        </div>
    );
}
 
export default Photo;