import React, { Component } from 'react';
import getToken from '../../getToken';
import getUserData from '../../getUserData';
import Photo from '../../components/photo/photo';
import addPostImage from '../../assets/gfx/add.png'
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from '../../components/UI/button';
import PhotoView from '../photoView/photoView';
import { MAIN_URI } from '../../config';

import classes from './photosList.module.css';
import Spinner from '../../components/UI/spinner';
import getColor from '../../getColor';

const colorScheme = getColor();

class PhotosList extends Component {
    constructor(props) {
        super(props);

        let token = getToken();
        let userData = getUserData();

        this.state = {
            token: token,
            userData: userData,
            limit: 10,
            photos: [],
            bigPhotoId: null,
            loading: true
        }
        this.setLimit.bind(this);
        this.getPhotos.bind(this);
        this.openBigPhoto.bind(this);
        this.bigPhotoWasClosed.bind(this);
    }

    componentDidMount(){
        this.getPhotos(10);
    }

    getPhotos = (limit) => {
        axios({
            method: 'post',
            url: `${MAIN_URI}/photos/user/limited`,
            headers: {'Authorization': this.state.token},
            data: {
                limit: limit,
                authorId: "self"
            }
        })
        .then((res)=>{
            if(res.status===200){
                this.setState({photos: res.data.photos, loading: false});
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    setLimit = () => {
        let newLimit = this.state.limit+5;
        this.setState({limit: newLimit});
        this.getPhotos(newLimit);
    }

    openBigPhoto = (id) => {
        this.setState({bigPhotoId: id});
    }

    bigPhotoWasClosed = (reload) => {
        this.setState({bigPhotoId: null});
        if(reload === true){
            this.getPhotos(this.state.limit)
        }
    }

    render() { 
        let content;
        if(this.state.loading){
            content = <Spinner />
        }
        else{
            let photos; 
            if(this.state.photos.length===0){
                photos = (
                    <h1>You don't have any photos yet! Click on the "+" icon to add some!</h1>
                )
            }
            else{
                photos = this.state.photos.map((photo, index) => {
                    return(
                        <Photo photo={photo} key={index} openBigPhoto={this.openBigPhoto}/>
                    )
                })
            }

            let bigPhotoToSend;
            this.state.photos.forEach(photo => {
                if(photo._id === this.state.bigPhotoId) bigPhotoToSend = photo;
            })

            let colorStyle = { backgroundColor: "#82ca66" };
            if(colorScheme === "blue"){
                colorStyle = { backgroundColor: "hsl(210deg 66% 52%)" };
            }

            content = (
                <>
                    {this.state.bigPhotoId ? <PhotoView photo={bigPhotoToSend} closeBigPhoto={this.bigPhotoWasClosed}/> : null}
                    <div className={classes.center}>
                        <div className={classes.container}>
                            {
                                photos
                            }
                            <div className={classes.addPhoto}>
                                    <div className={classes.addPhotoContainer} onClick={this.showPostForm} style={colorStyle}>
                                        <Link to="/addPhoto">
                                            <img alt="add a post" src={addPostImage}/>
                                        </Link>
                                    </div>
                            </div>
                        </div>
                    </div>
                    <div className={classes.center}>
                        <div style={{
                            width: "81%",
                            display: "flex",
                            justifyContent: "center",
                            paddingTop: "20px",
                            paddingBottom: "10px"
                        }}>
                            <Button clicked={this.setLimit}>Load more</Button>
                        </div>
                    </div>
                </>
            );
        }
        return (
            <React.Fragment>
                {content}
            </React.Fragment>
        );
    }
}
 
export default PhotosList;