import React, { Component } from 'react';
import { MAIN_URI } from '../../../config';

import classes from './PhotosTab.module.css';
import {BsArrowsAngleExpand} from 'react-icons/bs';
import Spinner from '../../../components/UI/spinner';

import axios from 'axios';
import getToken from '../../../getToken';
import getUserData from '../../../getUserData';
import Button from '../../../components/UI/button';
import PhotoView from '../../photoView/photoView';
import getMobile from '../../../getMobile';

class PhotosTab extends Component {
    constructor(props) {
        super(props);

        let token = getToken();
        let userData = getUserData();

        this.state = {
            token: token,
            userData: userData,
            loading: false,
            limit: 3,
            photos: [],
            bigPhotoId: null
        }
        this.getPhotos.bind(this);
        this.bigPhotoWasClosed.bind(this);

        this.isMobile = getMobile();
    }

    componentDidMount(){
        this.getPhotos(this.state.limit, false);
    }

    getPhotos = (limit, setLimit) => {
        let newSt = {loading: true}
        if(setLimit){
            newSt = {loading: true, limit: limit}
        }
        this.setState(newSt);
        axios({
            method: 'post',
            url: `${MAIN_URI}/photos/user/limited`,
            headers: {'Authorization': this.state.token},
            data: {
                limit: limit,
                authorId: this.props.userId.replace("?id=","")
            }
        })
        .then((resp)=>{
            this.setState({photos: resp.data.photos, loading: false})
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    bigPhotoWasClosed = (reload) => {
        this.setState({bigPhotoId: null});
        if(reload === true){
            this.getPhotos(this.state.limit)
        }
    }

    render() { 
        let bigPhotoToSend;
        this.state.photos.forEach(photo => {
            if(photo._id === this.state.bigPhotoId) bigPhotoToSend = photo;
        })

        let photos = null;
        if(this.state.photos.length === 0) photos = <h1>No photos were added yet!</h1>
        else{
            photos = this.state.photos.map((photo, index)=>{
                return (
                    <div className={this.isMobile ? classes.panelMobile : classes.panel} key={index}>
                        <img src={photo.data} alt={photo.description}/>
                        <div className={classes.expandIconBackground} onClick={()=>this.setState({bigPhotoId: photo._id})}>
                            <BsArrowsAngleExpand size="1.5em" color="white" />
                        </div>
                        <div className={classes.photoData}>
                            <p>likes: {photo.likes.length}</p>
                            <p>dislikes: {photo.dislikes.length}</p>
                            <p>comments: {photo.comments.length}</p>
                        </div>
                    </div>
                )
            })
        }

        return (
            <div className={classes.center}>
                {
                    this.state.loading ? <Spinner/> : (
                        <div className={classes.photosTabContainer}>
                            {this.state.bigPhotoId ? <PhotoView photo={bigPhotoToSend} closeBigPhoto={this.bigPhotoWasClosed}/> : null}
                            {photos}
                        </div>  
                    )
                }
                <div className={classes.loadMoreBtn}>
                    <Button clicked={()=>{
                        let curLim = this.state.limit+3;
                        this.getPhotos(curLim, true)
                    }}>Load more</Button>
                </div>
            </div>
        );
    }
}
 
export default PhotosTab;