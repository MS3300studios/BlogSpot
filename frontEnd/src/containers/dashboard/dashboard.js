import React, { Component } from 'react';

import classes from './dashboard.module.css';

import getToken from '../../getToken';
import formattedCurrentDate from '../../formattedCurrentDate';
import Post from '../../components/post/post';
import addPostImage from '../../assets/gfx/add.png';
import PostForm from '../../components/UI/PostForm';
import Backdrop from '../../components/UI/backdrop';
import Flash from '../../components/UI/flash';
import SearchBar from '../../components/UI/searchBar';
import NoSearchResult from '../../components/UI/noSearchResult';
import axios from 'axios';
import getUserData from '../../getUserData';

class Dashboard extends Component {
    constructor(props){

        let token = getToken();

        super(props);
        this.state = {
            loading: true,
            addingPost: false,
            flashMessage: "",
            flashNotClosed: true,
            newPostForm: {
                title: "",
                content: ""
            },
            editPostTitle: null,
            editPostContent: null,
            editing: false,
            editId: null,
            filterIn: "none",
            filterBy: "none",
            posts: [],
            currentUser: {},
            token: token
        }

        
        this.showPostForm.bind(this);
        this.getPosts.bind(this);
        this.addPost.bind(this);
        this.deletePost.bind(this);
        this.editPost.bind(this);
        this.sendEditedPost.bind(this);
        this.fillPostForm.bind(this);
        this.findPostById.bind(this);
        this.titleChangedHandler.bind(this);
        this.contentChangedHandler.bind(this);
        this.filterPosts.bind(this);
        this.filterSearchHandler.bind(this);
    }

    componentDidMount(){
        this.getPosts();
    }

    filterSearchHandler = (searchIn, content) => {
        this.setState({filterIn: searchIn, filterBy: content});
    }

    findPostById = (id) => {
        // eslint-disable-next-line
        let post = this.state.posts.filter((post)=>{
            if(post._id === id) return post;
        });
        let postRdy = {
            author: post[0].author,
            content: post[0].content,
            title: post[0].title,
            id: post[0].id,
            dbId: post[0]._id
        }
        return postRdy;
    }
    //fill the post form 
    fillPostForm = (data) => {
        this.setState({editPostContent: data.content, editPostTitle: data.title});
    }   

    editPost = (id) => {
        let postToEdit = this.findPostById(id);
        this.fillPostForm(postToEdit);
        //ask for true post ID -> check what is the id argument in this function
        this.setState({editing: true, editId: id});
        this.showPostForm();
    }

    deletePost = (id) => {
        let post = this.findPostById(id);
        let dbId = post.dbId;
        axios({
            method: 'delete',
            url: `http://localhost:3001/blogs/delete/${dbId}`,
            headers: {'Authorization': this.state.token},
        })
        this.getPosts();
    }

    getPosts = () => {
        axios({
            method: 'get',
            url: 'http://localhost:3001/myBlogs',
            headers: {'Authorization': this.state.token}
        })
        .then(res => {
            this.setState({loading: false});
            const posts = [];
            for(let key in res.data.blogs) {
                posts.push({
                    ...res.data.blogs[key],
                    id: key
                });
            }
            this.setState({posts: posts});
        })
        .catch(error => {
            console.log(error);
        })  
    }

    showPostForm = () => {
        this.setState({addingPost: true});
    }

    closeBackdrop = () => {
        this.setState({addingPost: false, editPostTitle: "", editPostContent: ""});
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

    titleChangedHandler = (event) => {
        let form = this.state.newPostForm;
        form.title = event.target.value;
        if(event.target.value.length>0){
            this.setState({newPostForm: form, editPostTitle: form.title});
        }
    }
    contentChangedHandler = (event) => {
        let form = this.state.newPostForm;
        form.content = event.target.value;
        if(event.target.value.length>0){
            this.setState({newPostForm: form, editPostContent: form.content});
        }
    }
    
    //is called in then block after axios sends edit data to server inside PostForm
    //this is a state cleanup function
    sendEditedPost = () => {
        this.setState({addingPost: false});
        this.flash("Post edited successfully!");        
        let clearPost = {...this.state.newPostForm};
        clearPost.title = "";
        clearPost.content = "";
        this.setState(
            {
                newPostForm: clearPost, 
                editPostTitle: clearPost.title, 
                editPostContent: clearPost.content, 
                editing: false
            }
        );
        this.getPosts();
          
    }

    addPost = (event) => {
        if(this.state.newPostForm.title.length > 0 && this.state.newPostForm.content.length > 0){
            this.setState({addingPost: false});

            let copy = {...this.state.newPostForm};
            let date = formattedCurrentDate(true);
            let content = {...copy, dateStarted: date, latestEdit: date};
            let flashMsg = "sent";

            axios({
                method: 'post',
                url: 'http://localhost:3001/blogs/new',
                headers: {'Authorization': this.state.token},
                data: content
            })
            .then((res)=>{
                if(res.status===201){
                    this.flash(`Post ${flashMsg} successfully!`);
                    let clearPost = {...this.state.newPostForm};
                    clearPost.title = "";
                    clearPost.content = "";
                    this.setState({newPostForm: clearPost});
                    this.getPosts();
                }
                else{
                    this.flash("Network error, try again later.")
                }
            })
        }
        else{
            event.preventDefault();
            this.flash("You cannot send an empty post!");
        }
    }

    filterPosts = (filterIn, filterBy) => {
        let posts = null;
        let postsRdy = null;

        let userData = getUserData();
        
        //default filter: no filter applied
        if(filterIn==="none" || filterBy==="none"){
            postsRdy = this.state.posts.map((post, index)=>{
                return ( 
                    <Post 
                        title={post.title}
                        author={userData.nickname}
                        content={post.content}
                        id={post._id}
                        key={index}
                        delete={this.deletePost}
                        edit={this.editPost}
                    />
                )
            }
            );
        }
        else{
            posts = this.state.posts.map((post, index)=>{
                return (
                    <div key={index}>
                        <Post
                            title={post.title}
                            author={userData._id}
                            content={post.content}
                            id={post._id}
                            delete={this.deletePost}
                            edit={this.editPost}
                            dashboard
                        />        
                    </div>
                )}
            );
            if(filterIn==="title"){
                //eslint-disable-next-line
                postsRdy = posts.filter((post)=>{
                    if(post.props.title.includes(filterBy)){
                        return post;
                    }
                })            
            }
    
            else if(filterIn==="content"){
                // eslint-disable-next-line
                postsRdy = posts.filter((post)=>{
                    if(post.props.content.includes(filterBy)){
                        return post;
                    }
                })
            }
        }
        if(postsRdy.length === 0){
            postsRdy = (
                <NoSearchResult />
            );
        }
        return postsRdy;
    }

    render() { 
        //handling post addition
        let addPostActive = null;
        if(this.state.addingPost){
            addPostActive = (
                <React.Fragment>
                    <Backdrop show>
                        <PostForm 
                            closeBackdrop={this.closeBackdrop} 
                            addPost={this.addPost} 
                            titleChanged={this.titleChangedHandler} 
                            contentChanged={this.contentChangedHandler}
                            editing={this.state.editing}
                            editPostContent={this.state.editPostContent}
                            editPostTitle={this.state.editPostTitle}
                            editId={this.state.editId}
                            editFunction={this.sendEditedPost}
                        />
                    </Backdrop>
                </React.Fragment>
            );
        }

        //handling flash
        let flash = null;
        if(this.state.flashMessage && this.state.flashNotClosed){
            flash = <Flash>{this.state.flashMessage}</Flash>
        }
        else if(this.state.flashMessage && this.state.flashNotClosed === false){
            flash = <Flash close>{this.state.flashMessage}</Flash>
        }

        //handling posts/spinner
        let posts = null;
        if(this.state.loading){
            let temp = [];
            for(let i = 0; i<7; i++){
                temp.push(
                    <Post 
                        loading={true}
                    />
                )
            }
            posts = (
                <div className={classes.postContainer}>
                    {
                        temp
                    }
                    <div className={classes.Card} onClick={this.showPostForm}>
                        <img alt="add a post" src={addPostImage} className={classes.addPostDiv}/>
                    </div>
                </div> 
            )
        }
        else posts = (
            <div className={classes.postContainer}>
                {this.filterPosts(this.state.filterIn, this.state.filterBy)}
                <div className={classes.Card} onClick={this.showPostForm}>
                    <img alt="add a post" src={addPostImage} className={classes.addPostDiv}/>
                </div>
            </div> 
        )

        return ( 
            <React.Fragment>
                <SearchBar 
                    placeholder="search posts in..."
                    clicked={this.filterSearchHandler}
                    resetFilter={()=>{this.setState({filterIn: "none", filterBy: "none"})}}
                    selectValues={["title", "content"]}
                />
                {posts}
                {addPostActive}
                {flash} 
            </React.Fragment>               
        );
    }
}

export default Dashboard;