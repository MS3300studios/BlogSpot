import React, { Component } from 'react';
import axios from 'axios';

import getToken from '../../../getToken';
import classes from './Blogs.module.css';

class BlogsTab extends Component {
    constructor(props){
        super(props);

        let token = getToken()

        this.state = {
            token: token,
            blogs: [],
            limit: 20
        }
        // this.getData.bind(this);
    }

    componentDidMount () {
        axios({
            method: 'post',
            url: `http://localhost:3001/blogs/limited`,
            headers: {'Authorization': this.state.token},
            data: {limit: this.state.limit}
        })
        .then((res)=>{
            if(res.status===200){
                let blogs = [];
                console.log(res.data.blogs)
                for(let i=res.data.blogs.length-1; i > 0; i--){
                    console.log(res.data.blogs[i])
                    blogs.push(res.data.blogs[i]);
                }
                this.setState({blogs: blogs})
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    } 


    render() { 
        let blogs = this.state.blogs.map((el, index)=>(
            <div className={classes.center}>
                <div key={index} className={classes.smallBlogContainer}>
                    <h1>{el.title}</h1>
                    <h2>{el.createdAt}</h2>
                </div>
            </div>
        ));

        return (
            <React.Fragment>
                {blogs}
            </React.Fragment>
        );
    }
}
 
export default BlogsTab;



