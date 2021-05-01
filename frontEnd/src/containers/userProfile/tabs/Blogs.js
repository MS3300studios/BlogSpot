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
        }
        // this.getData.bind(this);
    }

    //get user Blogs and userData from userId from AJAX call 
    componentDidMount () {
        axios({
            method: 'get',
            url: `http://localhost:3001/blogs`,
            headers: {'Authorization': this.state.token},
            data: {}
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


    render() { 
        return (
            <div>
                {this.state.blogs.map((el, index)=>(
                    <div key={index}>{el.title}</div>
                ))}
            </div>
        );
    }
}
 
export default BlogsTab;



