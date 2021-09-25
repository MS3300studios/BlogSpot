import React, { Component } from 'react';
import axios from 'axios';

import LikesCommentsNumbers from '../../../components/UI/likesCommentsNumbers';
import formattedCurrentDate from '../../../formattedCurrentDate';
import Button from '../../../components/UI/button';
import getToken from '../../../getToken';
import classes from './Blogs.module.css';
import ShowComments from './comments/showComments';
import { Link } from 'react-router-dom';
import getColor from '../../../getColor';

class BlogsTab extends Component {
    constructor(props){
        super(props);

        let token = getToken()
        let queryParams = new URLSearchParams(this.props.userId);
        let userId = queryParams.get('id'); 

        this.state = {
            userId: userId,
            token: token,
            blogs: [],
            limit: 0,
            showcomments: false,
            showComMessage: "show comments",
            reachedBlogsEnd: false
        }
        this.getPosts.bind(this);
        this.getMorePosts.bind(this);
        this.toggleShowComments.bind(this);
    }

    componentDidMount () {
        this.getPosts();
    } 

    getPosts = () => {
        axios({
            method: 'post',
            url: `http://localhost:3001/blogs/limited`,
            headers: {'Authorization': this.state.token},
            data: {limit: this.state.limit, authorId: this.state.userId}
        })
        .then((res)=>{
            if(res.status===200){
                if(res.data.blogs.length === 0){
                    this.setState({reachedBlogsEnd: true});
                }
                else{
                    let blogs = this.state.blogs;
                    let newBlogs = blogs.concat(res.data.blogs)
                    this.setState({blogs: newBlogs});
                }
            }
        })
        .catch(error => {
            console.log(error);
        })
    }
    
    getMorePosts = async () => {
        //sets limit to +2
        await this.setState((prevState)=> {
            return {
                ...prevState,
                limit: prevState.limit + 2
            }
        });
        this.getPosts(); //populates the state array with more blogs 
    }

    toggleShowComments = () => {
        this.setState(prevState => {
                let msg = "";
                if(prevState.showComMessage === "show comments"){
                    msg = "hide comments"
                }
                else {
                    msg = "show comments"
                }
                return (
                    {...prevState, showcomments: !prevState.showcomments, showComMessage: msg}
                )
            }
        )
    }

    render() {
        let blogBackgroundColor = {backgroundColor: "#83dc61"};
        const colorScheme = getColor();
        if(colorScheme === "blue"){
            blogBackgroundColor = {backgroundColor: "hsl(213deg 86% 67%)"};
        }

        let blogs = null;
        if(this.state.blogs.length === 0 ) blogs = <h1>No blogs were added yet!</h1>
        else{
            blogs = this.state.blogs.map((el, index)=>{
                return (
                    <div className={classes.center} key={index}>
                        <div key={index} className={classes.smallBlogContainer} style={blogBackgroundColor}>
                            <div className={classes.upperSegment}>
        
                                <div className={classes.h1Container}>
                                    <h1><Link to={"/post/?id="+el._id}>{el.title}</Link></h1>
                                </div>
                                <LikesCommentsNumbers objectId={el._id} userId={this.state.userId} comments objectIsBlog/>
                            </div>        
                            <p className={classes.date}>{formattedCurrentDate(el.createdAt)}</p>        
                            <div className={classes.content}>
                                {el.content}
                            </div>
                            <ShowComments blogId={el._id}/>
                        </div>
                    </div>
                )
            });
        }

        return (
            <React.Fragment>
                {blogs}
                {
                    (this.state.reachedBlogsEnd) ? null : (
                        <div className={[classes.center, classes.loadmorebtn].join(" ")}>
                            <Button clicked={this.getMorePosts}>load 2 more</Button>
                        </div>
                    )
                }
            </React.Fragment>
        );
    }
}
 
export default BlogsTab;



