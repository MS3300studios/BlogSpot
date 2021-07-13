import React, { Component } from 'react';
import getToken from '../../getToken';
import getUserData from '../../getUserData';
import Photo from '../../components/photo/photo';
import addPostImage from '../../assets/gfx/add.png'
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from '../../components/UI/button';
import PhotoView from '../photoView/photoView';

import classes from './photosList.module.css';
import Spinner from '../../components/UI/spinner';

class PhotosList extends Component {
    constructor(props) {
        super(props);

        let token = getToken();
        let userData = getUserData();

        this.state = {
            token: token,
            userData: userData,
            limit: 2,
            photos: [],
            bigPhotoId: null
        }
        this.setLimit.bind(this);
        this.getPhotos.bind(this);
        this.openBigPhoto.bind(this);
        this.bigPhotoWasClosed.bind(this);
    }

    componentDidMount(){
        this.getPhotos(2);
    }

    getPhotos = (limit) => {
        console.log('getting photos, new limit: ', limit)
        this.setState({loading: true});
        axios({
            method: 'post',
            url: `http://localhost:3001/photos/user/limited`,
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
        let newLimit = this.state.limit+2;
        this.setState({limit: newLimit});
        this.getPhotos(newLimit);
    }

    openBigPhoto = (id) => {
        this.setState({bigPhotoId: id});
    }

    bigPhotoWasClosed = (reload) => {
        this.setState({bigPhotoId: null});
        this.getPhotos(this.state.limit)
    }

    render() { 
        let content;
        if(this.state.loading){
            content = <Spinner />
        }
        else{
            let bigPhotoToSend;
            this.state.photos.forEach(photo => {
                if(photo._id === this.state.bigPhotoId) bigPhotoToSend = photo;
            })
            content = (
                <React.Fragment>
                    {this.state.bigPhotoId ? <PhotoView photo={bigPhotoToSend} closeBigPhoto={this.bigPhotoWasClosed}/> : null}
                    <div className={classes.center}>
                        <div className={classes.container}>
                            {
                                this.state.photos.map((photo, index) => {
                                    return(
                                        <Photo photo={photo} key={index} openBigPhoto={this.openBigPhoto}/>
                                    )
                                })
                            }
                            <div className={classes.addPhoto}>
                                    <div className={classes.addPhotoContainer} onClick={this.showPostForm}>
                                        <Link to="/photo/add">
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
                            backgroundColor: "#53c253",
                            paddingTop: "10px",
                            paddingBottom: "10px"
                        }}>
                            <Button clicked={this.setLimit}>Load more</Button>
                        </div>
                    </div>
                </React.Fragment>
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