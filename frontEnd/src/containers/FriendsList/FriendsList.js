import React, { Component } from 'react';

import classes from './FriendsList.module.css';
import SearchBar from '../../components/UI/searchBar';


import photo1 from '../../assets/userPhoto/image (1).jfif';
import photo2 from '../../assets/userPhoto/image (2).jfif';
import photo3 from '../../assets/userPhoto/image (3).jfif';
import photo4 from '../../assets/userPhoto/image (4).jfif';
import photo5 from '../../assets/userPhoto/image (14).jfif';
import photo6 from '../../assets/userPhoto/image2.jfif';
import photo7 from '../../assets/userPhoto/image.jfif';

class FriendsList extends Component {
    constructor(props){
        super(props);
        this.state = {
            photos: [
                photo1,photo2,photo3,photo4,photo5,photo6,photo7
            ]
        }
    }
    render() { 
        let faces = this.state.photos.map((photo) => {
            return (
                <div className={classes.face}>
                    <img src={photo} alt="user face"/>
                </div>
            )
        })

        return (
            <div className={classes.mainContainer}>
                <div className={classes.upperContainer}>
                    <h1 className={classes.mainHeader}>Friends</h1>
                    <div className={classes.viewOptions}>
                        <h3 className={classes.viewOptionsH3}>View Options:</h3>
                        <select className={classes.Select} onChange={(e)=>console.log(e.target.value)}>
                            <option>photos</option>
                            <option>list</option>
                        </select>
                    </div>
                    <SearchBar 
                        placeholder="search friends by..."
                        clicked={()=>{console.log('you clicked the search icon')}}
                        searchFriends
                        selectValues={["nickname", "name", "surname", "id"]}
                    />
                </div>
                <div className={classes.wrapper}>
                {faces}
                </div>
            </div>
        );
    }
}
 
export default FriendsList;


// resetFilter={()=>{this.setState({filterIn: "none", filterBy: "none"})}}