import React, { Component } from 'react';
import axios from 'axios';

import classes from './Blogs.module.css';

class BlogsTab extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
        this.getData.bind(this);
    }

    //get user Blogs and userData from userId from AJAX call 
    getData () {
        axios({
            method: 'post',
            url: `http://localhost:3001/`,
            headers: {},
            data: {}
        })
        .then((res)=>{
            if(res.status===200){
                
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
                hello
            </div>
        );
    }
}
 
export default BlogsTab;



