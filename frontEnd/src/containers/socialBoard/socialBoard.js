import React, { Component } from 'react';
import {Link} from 'react-router-dom';

import classes from './socialBoard.module.css';
import axios from 'axios';
import getToken from '../../getToken';

import Photo from '../../components/photo/photo';
import Spinner from '../../components/UI/spinner'; 
import PhotoView from '../photoView/photoView';
import Post from '../../components/post/post';
import Button from '../../components/UI/button';

class SocialBoard extends Component {
    constructor(props) {
        super(props);

        let token = getToken();

        this.state = {
            token: token,
            elements: [],
            loading: false,
            bigPhoto: null,
            limitPhotos: 0,
            limitPosts: 0,
        }
        this.getElements.bind(this);
        this.openBigPhoto.bind(this);
        this.bigPhotoWasClosed.bind(this);
    }

    componentDidMount(){
        this.getElements(this.state.limitPhotos, this.state.limitPosts, false);
    }

    getElements = (limitphotos, limitposts, join) => {
        this.setState({loading: true})

        axios({
            method: 'post',
            url: `http://localhost:3001/socialBoard/init`,
            headers: {'Authorization': this.state.token},
            data: {
                skipPhotos: limitphotos,
                skipPosts: limitposts
            }
        })
        .then((res)=>{
            if(res.status===200){
                if(join === true){
                    let currElems = this.state.elements;
                    let newElems = currElems.concat(res.data.elements);
                    this.setState({elements: newElems, loading: false, limitPhotos: limitphotos+4, limitPosts: limitposts+4})
                }
                else{
                    this.setState({elements: res.data.elements, loading: false, limitPhotos: limitphotos+4, limitPosts: limitposts+4})
                    return;
                }
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    openBigPhoto = (photoId) => {
        this.state.elements.forEach(el => {
            if(el._id === photoId) this.setState({bigPhoto: el});
        })
    }

    bigPhotoWasClosed = (update) => {
        this.setState({bigPhoto: null});
        if(update === true){
            this.getElements(this.state.limitPhotos, this.state.limitPosts, true)//come back here later
        }
    }

    render() { 
        let content;
        if(this.state.loading){
            content = <Spinner />
        }
        else{
            content = this.state.elements.map((el, index) => {
                if(el.content){
                    return (
                        <Post 
                            title={el.title}
                            author={el.author}
                            content={el.content}
                            id={el._id}
                            key={index}
                            delete={this.deletePost}
                            edit={this.editPost}
                            socialBoard
                        />
                    )
                }
                else{
                    return <Photo photo={el} key={index} openBigPhoto={this.openBigPhoto} socialBoard/>
                }
            })
        }

        return (
            <>
                <h1 className={classes.mainHeader}>Newest activity:</h1>
                <div className={classes.mainContainer}>
                    {content}
                    {this.state.bigPhoto ? <PhotoView photo={this.state.bigPhoto} closeBigPhoto={this.bigPhotoWasClosed}/> : null}
                </div>
                <div className={[classes.center, classes.btnMore].join(" ")}>
                    <Button clicked={()=>this.getElements(this.state.limitPhotos, this.state.limitPosts, true)}>Load more</Button>
                </div>
            </>
        );
    }
}
 
export default SocialBoard;