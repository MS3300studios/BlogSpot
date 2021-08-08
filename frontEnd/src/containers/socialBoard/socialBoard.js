import React, { Component } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

import classes from './socialBoard.module.css';
import axios from 'axios';
import getToken from '../../getToken';

import SearchBar from '../../components/UI/searchBar';
import Photo from '../../components/photo/photo';
import Spinner from '../../components/UI/spinner'; 
import PhotoView from '../photoView/photoView';
import Post from '../../components/post/post';
import Button from '../../components/UI/button';
import Flash from '../../components/UI/flash';

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
            filterIn: "title",
            filterBy: "",
            flashMessage: "",
            flashNotClosed: true,
        }
        this.getElements.bind(this);
        this.openBigPhoto.bind(this);
        this.bigPhotoWasClosed.bind(this);
        this.searchActivity.bind(this);
        this.filterSearchHandler.bind(this);
        this.flash.bind(this);
    }

    componentDidMount(){
        this.getElements(this.state.limitPhotos, this.state.limitPosts, false);
    }

    flash = (message) => {
        this.setState({flashMessage: message});
        
        setTimeout(()=>{
            this.setState({flashNotClosed: false});
        }, 2000)

        setTimeout(()=>{
            this.setState({flashMessage: ""});
        }, 3000);
    
        setTimeout(()=>{
            this.setState({flashNotClosed: true});
        }, 3000);
    }

    searchActivity = () => {
        console.log(this.state.filterBy)
        console.log(this.state.filterIn)
        if(this.state.filterBy.length === 0){
            this.flash("you need to enter something in the searchbar first!");
        }
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

    filterSearchHandler = (option, string) => {
        if(string===""){
            this.setState({filterIn: option});
        }
        else{
            this.setState({filterIn: option, filterBy: string});
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

        let flash = null;
        if(this.state.flashMessage && this.state.flashNotClosed){
            flash = <Flash>{this.state.flashMessage}</Flash>
        }
        else if(this.state.flashMessage && this.state.flashNotClosed === false){
            flash = <Flash close>{this.state.flashMessage}</Flash>
        }

        return (
            <>
                <h1 className={classes.mainHeader}>Newest activity:</h1>
                <div className={classes.searchContainer}>
                    <SearchBar 
                        placeholder="browse activity in..."
                        clicked={this.filterSearchHandler}
                        resetFilter={()=>{this.setState({filterIn: "", filterBy: ""})}}
                        selectValues={["title", "author name", "id"]}
                        selectedOption={this.filterSearchHandler}
                    />
                    <div style={{height: "50px", marginTop: "37px"}}>
                        <Button>
                            <div 
                                className={classes.searchButton}
                                onClick={this.searchActivity}
                            >
                                search<AiOutlineSearch size="2em" color="#0a42a4" />
                            </div>
                        </Button>
                    </div>
                </div>
                <div className={classes.mainContainer}>
                    {content}
                    {this.state.bigPhoto ? <PhotoView photo={this.state.bigPhoto} closeBigPhoto={this.bigPhotoWasClosed}/> : null}
                </div>
                <div className={[classes.center, classes.btnMore].join(" ")}>
                    <Button clicked={()=>this.getElements(this.state.limitPhotos, this.state.limitPosts, true)}>Load more</Button>
                </div>
                {flash}
            </>
        );
    }
}
 
export default SocialBoard;