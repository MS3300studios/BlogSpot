import React, { Component } from 'react';
import axios from 'axios';
import getToken from '../../getToken';
import getUserData from '../../getUserData';

import Like from '../../components/UI/like';
import { FaCommentAlt } from 'react-icons/fa';
import classes from './photoView.module.css';
import Button from '../../components/UI/button';
// import fillerPhoto from '../../assets/userPhoto/pobierz.jpg';
import formattedCurrentDate from '../../formattedCurrentDate';
import UserPhoto from '../../components/UI/userphoto';
import AddCommentForm from '../../components/UI/AddCommentForm';
import Spinner from '../../components/UI/spinner';


class photoView extends Component {
    constructor(props) {
        super(props);

        let token = getToken();
        let userData = getUserData();

        this.state = {
            token: token,
            userData: userData,
            loading: true,
            photo: null,
        }
    }

    componentDidMount(){
        this.setState({loading: true});
        axios({
            method: 'get',
            url: `http://localhost:3001/photos/getone/60eadacbd90e8d374c9759a1`,
        })
        .then((res)=>{
            if(res.status===200){
                this.setState({photo: res.data.photo, loading: false});
                return;
            }
            else{
                this.flash("Error: wrong request, photo not found")
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    render() {
        return (
            <div className={classes.backdrop}>
                <div className={classes.photoViewContainer}>
                    <Button clicked={()=>console.log('this.props.close')}>Close</Button>
                    <div className={classes.imgContainer}>
                        {
                            this.state.loading ? <Spinner darkgreen /> : <img src={this.state.photo.data} alt="refresh your page"/>
                        }
                    </div>
                    {
                        this.state.loading ? <Spinner darkgreen /> : (
                            <div className={classes.dataContainer}>
                                <div className={classes.authorInfoContainer}>
                                    <div className={classes.authorPhoto}>
                                        {
                                            this.state.loading ? <Spinner darkgreen /> : <UserPhoto userId={this.state.photo.authorId} small />
                                        }
                                    </div>
                                    <div className={classes.authorData}>
                                        <p>@Princess89</p>
                                        <p>{formattedCurrentDate(this.state.photo.createdAt)}</p>
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
                                    <p>{this.state.photo.description}</p>
                                </div>
                                <hr />
                                <div className={classes.commentForm}>
                                    <AddCommentForm small />
                                </div>
                                <div>
                                    {
                                        this.state.photo.comments.map((comment, index) => {
                                            return (
                                                <div key={index}>
                                                    <p>{comment.content}</p>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        )
                    }
                </div> 
            </div> 
        );
    }
}
 
export default photoView;