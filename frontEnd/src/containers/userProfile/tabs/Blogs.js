import React, { Component } from 'react';
import axios from 'axios';

import { FaCommentAlt } from 'react-icons/fa';
import { AiFillLike, AiFillDislike } from 'react-icons/ai'
import formattedCurrentDate from '../../../formattedCurrentDate';
import Button from '../../../components/UI/button';
import getToken from '../../../getToken';
import classes from './Blogs.module.css';
import Comments from './comments/comments';

class BlogsTab extends Component {
    constructor(props){
        super(props);

        let token = getToken()

        this.state = {
            token: token,
            blogs: [],
            limit: 2,
            showcomments: false,
            showComMessage: "show comments"
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
        let blogs = this.state.blogs.map((el, index)=>(
            <div className={classes.center} key={index}>
                <div key={index} className={classes.smallBlogContainer}>
                    <div className={classes.upperSegment}>

                        <div className={classes.h1Container}>
                            <h1>{el.title}</h1>
                        </div>

                        <div className={classes.numberInfoContainer}>
                            <div className={classes.numberInfoInnerContainer}>
                                <div className={[classes.iconDataContainer, classes.likeIconPContainer].join(" ")}>
                                    <AiFillLike size="1em" color="#0a42a4" className={classes.icon}/>
                                    <p className={classes.likeP}>5</p>
                                </div>
                                <div className={classes.iconDataContainer}>
                                    <AiFillDislike size="1em" color="#0a42a4" className={classes.icon}/>
                                    <p className={classes.dislikeP}>0</p>
                                </div>
                                <div className={classes.iconDataContainer}>
                                    <FaCommentAlt size="1em" color="#0a42a4" className={classes.icon}/>
                                    <p>10</p>
                                </div>
                            </div>
                        </div>

                    </div>


                    <p className={classes.date}>{formattedCurrentDate(el.createdAt)}</p>

                    <div className={classes.content}>
                        <p>
                            {el.content}
                        </p>
                    </div>
                    <p
                        className={classes.showcomments}
                        onClick={this.toggleShowComments}
                    >{this.state.showComMessage}</p>
                    {this.state.showcomments ? <Comments blogId={el._id} /> : null}
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



