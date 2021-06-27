import React, { Component } from 'react';

import classes from './FriendsList.module.css';
import SearchBar from '../../components/UI/searchBar';
import Button from '../../components/UI/button'; 
import FriendsListItem from './friendsListItem';

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
            ],
            names: [
                {name: 'Anna', surname: 'Marks', nickname: 'anna74'},
                {name: 'Ted', surname: 'Wilinks', nickname: 'teddy22'},
                {name: 'Maciej', surname: 'Warnik', nickname: 'macieK23'},
                {name: 'Józef', surname: 'Seren', nickname: 'koks101'},
                {name: 'Adam', surname: 'Sęp', nickname: 'adamex'},
                {name: 'Natalia', surname: 'Jarska', nickname: 'Kicia<3'},
                {name: 'Bolek', surname: 'Tokarski', nickname: 'Chrobry3000'}
            ],
            filterIn: "none",
            filterBy: "none"
        }
        this.changeView.bind(this);
        this.filterSearchHandler.bind(this);
        this.filterFriends.bind(this);
        this.searchNewUser.bind(this);
    }

    searchNewUser = () => {
        console.log('searching!');
        //make call to API with field, and string.
    }

    changeView = (option) => {
        if(option === "list"){
            this.setState({viewAsFaces: false});
        }
        else if(option === "photos"){
            this.setState({viewAsFaces: true});
        }
    }

    filterSearchHandler = (option, string) => {
        this.setState({filterIn: option, filterBy: string});
    }

    filterFriends = (filterIn, filterBy) => {
        let friendsJSX = null; //temporary array of all jsx friends, to be filtered and converted to friendsRdy
        let friendsRdy = null;
        
        //default filter: no filter applied
        if(filterIn==="none" || filterBy==="none"){
            friendsRdy = this.state.names.map((name, index)=>{
                let img = this.state.photos[index];
                return (
                    <React.Fragment key={index}>
                        <div className={classes.listElement}>
                            <div className={classes.smallFaceContainer}>
                                <img src={img} alt="friend's face"/>
                            </div>
                            <div className={classes.namesContainer}>
                                <h1>{name.name} {name.surname}</h1>
                                <p>@{name.nickname}</p>
                            </div>
                        </div>
                        <hr/>
                    </React.Fragment>
                )
            });
        }
        else{
            friendsJSX = this.state.names.map((friend, index)=>{
                let img = this.state.photos[index];
                return (
                    <FriendsListItem 
                        name={friend.name}
                        surname={friend.surname}
                        nickname={friend.nickname} 
                        index={index} 
                        img={img} 
                        key={index}/>
                )
            });

            if(filterIn==="nickname"){
                //eslint-disable-next-line
                friendsRdy = friendsJSX.filter((friend)=>{
                    if(friend.props.nickname.includes(filterBy)){
                        return friend;
                    }
                })            
            }
    
            else if(filterIn==="name"){
                // eslint-disable-next-line
                friendsRdy = friendsJSX.filter((post)=>{
                    if(post.props.name.includes(filterBy)){
                        return post;
                    }
                })
            }

            else if(filterIn==="surname"){
                // eslint-disable-next-line
                friendsRdy = friendsJSX.filter((post)=>{
                    if(post.props.surname.includes(filterBy)){
                        return post;
                    }
                })
            }
        }

        if(friendsRdy.length === 0){
            friendsRdy = (
                <React.Fragment>
                    <h1>Ooops, you don't have a friend with that {this.state.filterIn}!</h1>
                    <hr />
                    <p>Do you wish to search for a user with this {this.state.filterIn}?</p>
                    <Button clicked={this.searchNewUser}>Search</Button>
                </React.Fragment>
            );
        }
        return friendsRdy;
    }

    render() { 
        let friends = (
            <div className={classes.nameListContainer}>
                {
                    this.filterFriends(this.state.filterIn, this.state.filterBy)
                }
            </div>
        );

        return (
            <div className={classes.mainContainer}>
                <div className={classes.upperContainer}>
                    <h1 className={classes.mainHeader}>Your friends:</h1>
                    <SearchBar 
                        placeholder="search friends by..."
                        clicked={this.filterSearchHandler}
                        selectValues={["nickname", "name", "surname", "id"]}
                        resetFilter={()=>{this.setState({filterIn: "none", filterBy: "none"})}}
                    />
                </div>
                {friends}
            </div>
        );
    }
}
 
export default FriendsList;


// resetFilter={()=>{this.setState({filterIn: "none", filterBy: "none"})}}