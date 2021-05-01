import React, { Component } from 'react';
import axios from 'axios';

import Button from '../../../components/UI/button';
import getToken from '../../../getToken';
import classes from './Blogs.module.css';

class BlogsTab extends Component {
    constructor(props){
        super(props);

        let token = getToken()

        this.state = {
            token: token,
            blogs: [],
            limit: 2
        }
        this.getPosts.bind(this);
        this.getMorePosts.bind(this);
    }

    componentDidMount () {
        this.getPosts();
    } 

    getPosts = () => {
        axios({
            method: 'post',
            url: `http://localhost:3001/blogs/limited`,
            headers: {'Authorization': this.state.token},
            data: {limit: this.state.limit}
        })
        .then((res)=>{
            if(res.status===200){
                let blogs = [];
                res.data.blogs.forEach(element => {
                    blogs.push(element);
                });
                this.setState({blogs: blogs})
                return;
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

    render() { 
        let blogs = this.state.blogs.map((el, index)=>(
            <div className={classes.center} key={index}>
                <div key={index} className={classes.smallBlogContainer}>
                    <h1>{el.title}</h1>
                    <h2>{el.createdAt}</h2>
                </div>
            </div>
        ));

        return (
            <React.Fragment>
                {blogs}
                <div className={[classes.center, classes.loadmorebtn].join(" ")}>
                    <Button clicked={this.getMorePosts}>load 2 more</Button>
                </div>
            </React.Fragment>
        );
    }
}
 
export default BlogsTab;



