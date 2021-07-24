import React, { useState, useEffect } from 'react';
import classes from './FriendsList.module.css';

import { BiMessageDetail } from 'react-icons/bi';
import {Link} from 'react-router-dom';

const FriendsListItem = (props) => {
    const [checked, setchecked] = useState(props.selectAll)

    useEffect(() => {
        setchecked(props.selectAll)
    }, [props.selectAll])

    return (
        <>
            <div className={classes.friendContainer}>
                <div className={classes.listElement}>
                    <div className={classes.smallFaceContainer}>
                        <img src={props.photo} alt="friend's face"/>
                    </div>
                    <div className={classes.namesContainer}>
                        <a href={"/user/profile/?id="+props.id} key={props.index} className={classes.containerLink}>
                            <h1>{props.name} {props.surname}</h1>
                        </a>
                        <p>@{props.nickname}</p>
                    </div>
                </div>
                {
                    props.friendSelect ? (
                        <input 
                            type="checkbox" 
                            className={classes.inputCheckbox} 
                            onChange={()=>{
                                props.friendWasSelected({_id: props.id, name: props.name}, !checked)
                                setchecked(!checked)
                            }}
                            checked={checked}
                        />
                    ) : (
                        <div className={classes.chatIcon}>
                            <Link to={`/conversation/?id=${props.friendNumber}`}>
                                <BiMessageDetail size="2em" color="#0a42a4" />
                            </Link>
                        </div>
                    )
                }
            </div>
            {
                props.friendSelect ? null : <hr />
            }
        </>
    );
}
 
export default FriendsListItem;