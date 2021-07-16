import React, { Component } from 'react';

import classes from './socialBoard.module.css';
import axios from 'axios';
import getToken from '../../getToken';

import Photo from '../../components/photo/photo';
import Spinner from '../../components/UI/spinner'; 
import PhotoView from '../photoView/photoView';
import Post from '../../components/post/post';

class SocialBoard extends Component {
    constructor(props) {
        super(props);

        let token = getToken();

        this.state = {
            token: token,
            elements: [],
            loading: false,
            bigPhoto: null,
            limit: 0
        }
        this.getElements.bind(this);
        this.openBigPhoto.bind(this);
        this.bigPhotoWasClosed.bind(this);
    }

    componentDidMount(){
        this.getElements(this.state.limit);
    }

    getElements = (limit) => {
        this.setState({loading: true})
        axios({
            method: 'get',
            url: `http://localhost:3001/socialBoard/init`,
            headers: {'Authorization': this.state.token},
            data: {
                skip: limit
            }
        })
        .then((res)=>{
            if(res.status===200){
                this.setState({elements: res.data.elements, loading: false})
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    openBigPhoto = (photo) => {
        this.setState({bigPhoto: photo});
    }

    bigPhotoWasClosed = (update) => {
        this.setState({bigPhoto: null});
        if(update === true){
            this.getPhotos(this.state.limit)
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
            <div className={classes.mainContainer}>
                {content}
                {this.state.bigPhoto ? <PhotoView photo={this.state.bigPhoto} closeBigPhoto={this.bigPhotoWasClosed}/> : null}
                
            </div>
        );
    }
}
 
export default SocialBoard;