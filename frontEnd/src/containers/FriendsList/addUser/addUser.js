import React, { Component } from 'react';
import axios from 'axios';

import Spinner from '../../../components/UI/spinner';
import classes2 from '../FriendsList.module.css';
import classes from './addUser.module.css';
import SearchBar from '../../../components/UI/searchBar';
import Button from '../../../components/UI/button';
import {AiOutlineSearch} from 'react-icons/ai';
import {AiOutlineCloseCircle} from 'react-icons/ai';
import FriendsListItem from '../friendsListItem';

class AddUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            searched: false,
            userNotFound: false,
            filterIn: "none",
            filterBy: "none",
            loading: false
        }

        this.searchNewUser.bind(this);
        this.filterSearchHandler.bind(this);
    }

    searchNewUser = () => {
        this.setState({loading: true});
        axios({
            method: 'post',
            url: `http://localhost:3001/users/find`,
            headers: {'Authorization': this.state.token},
            data: {
                field: this.state.filterIn,
                payload: this.state.filterBy
            }
        })
        .then((res)=>{
            if(res.data === "user not found"){
                this.setState({userNotFound: true, searched: true, loading: false});
            }
            else{
                this.setState({users: res.data.users, searched: true, userNotFound: false, loading: false});
            }
        })
        .catch(error => {
            console.log(error);
        })
    }


    filterSearchHandler = (option, string) => {
        if(string===""){
            this.setState({filterIn: option});
        }
        else{
            this.setState({filterIn: option, filterBy: string});
        }
    }

    render() { 
        let content = (
            <div className={classes2.nameListContainer}>
                <h1>write in the searchbar in order to search</h1>
                <hr />
            </div>
        );

        if(this.state.searched){
            content = (
                <div className={classes2.nameListContainer}>
                    {
                        this.state.users.map((user, index) => {
                            let flag = false;
                            this.props.friendIds.forEach(friend => {
                                console.log(friend._id)
                                // console.log(user._id === friend._id)
                                // console.log("user: "+user._id)
                                // console.log("friend: "+friend._id)
                                if(user._id === friend._id) flag = true;
                            })
                            if(flag!==true){
                                return (
                                    <FriendsListItem 
                                        id={user._id} 
                                        key={index}  
                                        friend={user}
                                    />
                                );
                            }
                            else return null;
                        })
                    }
                </div>
            );         
        }

        return (
            <div className={classes.lightbox}>
                <div className={classes.addUserContainer}>
                <div className={classes.closeIcon} onClick={this.props.closeAddUser}>
                    <AiOutlineCloseCircle size="2em" color="#0a42a4" />
                </div>
                    <SearchBar 
                        placeholder="search users by..."
                        selectedOption={this.filterSearchHandler}
                        clicked={this.filterSearchHandler}
                        selectValues={["nickname", "name", "surname", "id"]} 
                        resetFilter={()=>{this.setState({filterIn: "none", filterBy: "none", users: []})}}
                    >
                        <div className={classes.buttonMinifier}>
                            <Button className={classes.SearchBtnAddUser}>
                                {
                                    this.state.loading ? <Spinner darkgreen small /> : (
                                        <div 
                                            style={{display: "flex", justifyContent:"center", alignItems: "center"}}
                                            onClick={this.searchNewUser}
                                        >
                                            search<AiOutlineSearch size="2em" color="#0a42a4" />
                                        </div>
                                    )
                                }
                            </Button>
                        </div>
                    </SearchBar>
                    {content}
                </div>
                <div style={{position: "absolute", top: "0px", left: "0px"}}>
                    <h1 style={{color: "white"}}>{this.state.filterBy}</h1>
                    <h1 style={{color: "white"}}>{this.state.filterIn}</h1>
                    <h1 style={{color: "white"}}>searched: {this.state.searched ? "yes" : "no"}</h1>
                </div>
            </div>
        );
    }
}
 
export default AddUser;