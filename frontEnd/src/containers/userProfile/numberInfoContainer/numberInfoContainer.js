import React, { Component } from 'react';
import { MAIN_URI } from '../../../config';

import classes from '../userProfile.module.css';

import { FaUserFriends } from 'react-icons/fa';
import { BiPhotoAlbum, BiPaperPlane } from 'react-icons/bi';
import axios from 'axios';

class NumberInfoContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            friendsCount: 0,
            blogsCount: 0,
            photosCount: 0
        }
    }

    componentDidMount(){
        this.setState({loading: true});
        axios({
            method: 'post',
            url: `${MAIN_URI}/getSocialNumbers`,
            headers: {'Authorization': this.props.token},
            data: {userId: this.props.userId}
        })
        .then((res)=>{
            if(res.status===200){
                this.setState(
                    {
                        friendsCount: res.data.friendsCount, 
                        blogsCount: res.data.blogsCount,
                        photosCount: res.data.photosCount,
                        loading: false
                    }
                )
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    componentWillUnmount(){
        
    }

    render() { 
        return (
            <div className={classes.numberInfoContainer}>  
                {
                    this.state.loading ? (
                        <div style={{marginTop: "15px", marginLeft: "12px"}}>
                            <div className={classes.socialNumbersPanelLoading}>
                            </div>  
                            <div className={classes.socialNumbersPanelLoading}>
                            </div>  
                            <div className={classes.socialNumbersPanelLoading}>
                            </div>  
                        </div>
                    ) : (
                        <>
                            <div className={classes.socialNumbersPanel}>
                                <p><FaUserFriends size="1em" color="#0a42a4"/>  Friends: </p>
                                <p>{this.state.friendsCount}</p>
                            </div>                                                                
                            <div className={classes.socialNumbersPanel}>
                                <p><BiPaperPlane size="1em" color="#0a42a4" />  Blogs: </p>
                                <p>{this.state.blogsCount}</p>
                            </div>                                
                            <div className={classes.socialNumbersPanel}>
                                <p><BiPhotoAlbum size="1em" color="#0a42a4" />  Photos: </p>
                                <p>{this.state.photosCount}</p>
                            </div>   
                        </>
                    )
                }                              
            </div>
        );
    }
}
 
export default NumberInfoContainer;