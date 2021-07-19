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
import Flash from '../../../components/UI/flash';

class AddUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            searched: false,
            userNotFound: false,
            filterIn: "none",
            filterBy: "none",
            loading: false,
            flashMessage: "",
            flashNotClosed: true,
        }

        this.searchNewUser.bind(this);
        this.filterSearchHandler.bind(this);
        this.flash.bind(this);
    }

    searchNewUser = () => {
        if(this.state.filterBy!=="none" && this.state.filterIn!=="none"){
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
        else{
            this.flash("Write something in the search bar first!");
        }
    }


    filterSearchHandler = (option, string) => {
        if(string===""){
            this.setState({filterIn: option});
        }
        else{
            this.setState({filterIn: option, filterBy: string});
        }
    }

    flash = (message) => {
        this.setState({flashMessage: message});
        
        setTimeout(()=>{
            this.setState({flashNotClosed: false});
        }, 2000)

        setTimeout(()=>{
            this.setState({flashMessage: ""});
        }, 3000);
    
        setTimeout(()=>{
            this.setState({flashNotClosed: true});
        }, 3000);
    }

    render() { 
        let content = (
            <div className={classes2.nameListContainer}>
                <h1>Write in the searchbar in order to search</h1>
                <hr />
            </div>
        );

        if(this.state.searched){
            if(this.state.users.length === 0){
                content = (
                    <div className={classes2.nameListContainer}>
                        <h1>No user with this {this.state.filterIn} was found!</h1>
                        <hr />
                    </div>
                );
            }
            else{
                content = (
                    <div className={classes2.nameListContainer}>
                        {
                            this.state.users.map((user, index) => {
                                let flag = false;
                                this.props.friends.forEach(friend => {
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
        }

        let flash = null;
        if(this.state.flashMessage && this.state.flashNotClosed){
            flash = <Flash>{this.state.flashMessage}</Flash>
        }
        else if(this.state.flashMessage && this.state.flashNotClosed === false){
            flash = <Flash close>{this.state.flashMessage}</Flash>
        }

        return (
            <div className={classes.lightbox}>
                <div className={classes.addUserContainer}>
                <div className={classes.closeIcon} onClick={this.props.closeAddUser}>
                    <AiOutlineCloseCircle size="2em" color="#0a42a4" />
                </div>
                    <SearchBar 
                        dontMove
                        placeholder="search users by..."
                        selectedOption={this.filterSearchHandler}
                        clicked={this.filterSearchHandler}
                        selectValues={["nickname", "name", "surname", "id"]} 
                        resetFilter={()=>{this.setState({filterIn: "none", filterBy: "none", users: [], searched: false})}}
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
                {flash}
            </div>
        );
    }
}
 
export default AddUser;