import React, { Component } from 'react';
import axios from 'axios';
import getToken from '../../getToken';
import getUserData from '../../getUserData';

import Like from '../../components/UI/like';
import { FaCommentAlt } from 'react-icons/fa';
import classes from './photoView.module.css';
import Button from '../../components/UI/button';
import fillerPhoto from '../../assets/userPhoto/pobierz.jpg';
import UserPhoto from '../../components/UI/userphoto';

class photoView extends Component {
    constructor(props) {
        super(props);

        let token = getToken();
        let userData = getUserData();

        this.state = {
            token: token,
            userData: userData,
            object: {
                description: "this is a photo of a beautiful city that I painted in 3 hours. Give it a like if you love it!",
                likes: [],
                dislikes: [],
                comments: []
            }
        }
    }

    componentDidMount(){

    }

    render() { 
        return (
            <div className={classes.backdrop}>
                <div className={classes.photoViewContainer}>
                    <Button clicked={()=>console.log('this.props.close')}>Close</Button>
                    <div className={classes.imgContainer}>
                        <img src={fillerPhoto} alt="refresh your page"/>
                    </div>
                    <div className={classes.dataContainer}>
                        <div className={classes.authorInfoContainer}>
                            <div className={classes.authorPhoto}>
                                <UserPhoto userId={this.state.userData._id} small />
                            </div>
                            <div className={classes.authorData}>
                                <p>@Princess89</p>
                                <p>12.03.2021</p>
                            </div>
                        </div>
                        <div className={classes.LikesCommentsNumbers}>
                            <div className={classes.like}><Like
                                sendAction={this.sendAction}
                                fill={true}
                                number={12}
                                size="1.5em" 
                                color="#0a42a4" 
                                photoView/></div>
                            <div className={classes.dislike}><Like
                                dislike 
                                sendAction={this.sendAction}
                                fill={false}
                                number={7}
                                size="1.5em" 
                                color="#0a42a4" 
                                photoView/></div>
                            <div className={classes.comment}>
                                <FaCommentAlt size="1em" color="#0a42a4" className={classes.commenticon}/>
                                <p>10</p>
                            </div>
                        </div>
                        <hr />
                        <div className={classes.description}>
                            <p>{this.state.object.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
 
export default photoView;