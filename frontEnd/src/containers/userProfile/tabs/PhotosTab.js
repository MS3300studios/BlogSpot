import React, { Component } from 'react';

import classes from './PhotosTab.module.css';
import {BsArrowsAngleExpand} from 'react-icons/bs';
import Spinner from '../../../components/UI/spinner';

import axios from 'axios';
import getToken from '../../../getToken';
import getUserData from '../../../getUserData';
import Button from '../../../components/UI/button';

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
            photos: []
        }
        this.getPhotos.bind(this);
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
            url: `http://localhost:3001/photos/user/limited`,
            headers: {'Authorization': this.state.token},
            data: {
                limit: limit,
                authorId: "self"
            }
        })
        .then((resp)=>{
            this.setState({photos: resp.data.photos, loading: false})
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    render() { 
        return (
            <div className={classes.center}>
                {
                    this.state.loading ? <Spinner darkgreen/> : (
                        <div className={classes.photosTabContainer}>
                            {
                                this.state.photos.map((photo, index)=>{
                                    return (
                                        <div className={classes.panel} key={index}>
                                            <img src={photo.data} alt={photo.description}/>
                                            <div className={classes.expandIconBackground} onClick={()=>console.log('opening big photo')}>
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