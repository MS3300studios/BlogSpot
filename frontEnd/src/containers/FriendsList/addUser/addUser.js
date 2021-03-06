import React, { Component } from 'react';
import axios from 'axios';
import { MAIN_URI } from '../../../config';

import Spinner from '../../../components/UI/spinner';
import SearchBar from '../../../components/UI/searchBar';
import Button from '../../../components/UI/button';
import {AiOutlineSearch} from 'react-icons/ai';
import {AiOutlineCloseCircle} from 'react-icons/ai';
import FriendsListItem from '../friendsListItem';
import Flash from '../../../components/UI/flash';

import getToken from '../../../getToken';
import getUserData from '../../../getUserData'
import getColor from '../../../getColor';

import classes2 from '../FriendsList.module.css';
import classes from './addUser.module.css';
import greenClasses from './greenClasses.module.css';
import blueClasses from './blueClasses.module.css';
import getMobile from '../../../getMobile';

const colorScheme = getColor();
let colorClasses = greenClasses;
if(colorScheme === "blue"){
    colorClasses = blueClasses;
}

class AddUser extends Component {
    constructor(props) {
        super(props);

        const token = getToken();
        const userData = getUserData();

        this.state = {
            token: token,
            userData: userData,
            users: [],
            searched: false,
            userNotFound: false,
            filterIn: "none",
            filterBy: "none",
            loading: false,
            flashMessage: "",
            flashNotClosed: true,
            skip: 0,
            loadingInit: true
        }

        this.searchNewUser.bind(this);
        this.filterSearchHandler.bind(this);
        this.flash.bind(this);
        this.getRandomUsers.bind(this);
        this.isMobile = getMobile();
    }

    getRandomUsers = () => {
        axios({
            method: 'post',
            url: `${MAIN_URI}/users/getRandomUsers`,
            headers: {'Authorization': this.state.token},
            data: {
                skip: this.state.skip
            }
        })
        .then((res)=>{
            if(res.status===200){
                this.setState(prevState => {
                    return ({loadingInit: false, users: prevState.users.concat(res.data.users), skip: prevState.skip+5})
                })
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    componentDidMount(){
        this.getRandomUsers();
    }

    searchNewUser = () => {
        if(this.state.filterBy!=="none" && this.state.filterIn!=="none"){
            this.setState({loading: true});
            axios({
                method: 'post',
                url: `${MAIN_URI}/users/find`,
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
        let content;
        if(this.state.loadingInit){
            content = (
                <Spinner />
            );
        }
        else{
            content = (
                <div className={classes2.nameListContainer}>
                    {
                        this.state.users.map((user, index) => {
                            if(user._id !== this.state.userData._id){
                                return (
                                    <FriendsListItem
                                        noInteractionIcon
                                        hideOnlineIcon 
                                        key={index}  
                                        id={user._id} 
                                        name={user.name}
                                        nickname={user.nickname}
                                        surname={user.surname}
                                        photo={user.photo}
                                    />
                                );
                            }
                            else return null;
                        })
                    }
                    <Button clicked={()=>{
                        this.getRandomUsers();                            
                    }}>Load more</Button>
                </div>
            )
        }

        if(this.state.searched){
            if(this.state.users.length === 0){
                content = (
                    <div className={classes2.nameListContainer}>
                        <h1 style={{color: "white"}}>No user with this {this.state.filterIn} was found!</h1>
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
                                    if(user._id === friend._id) flag = true;
                                })
                                if(flag!==true){
                                    return (
                                        <FriendsListItem
                                            noInteractionIcon
                                            hideOnlineIcon 
                                            key={index}  
                                            id={user._id} 
                                            name={user.name}
                                            nickname={user.nickname}
                                            surname={user.surname}
                                            photo={user.photo}
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
                <div className={colorClasses.addUserContainer} style={this.isMobile ? {width: "90%", marginTop: "30px", minHeight: "unset"} : null}>
                <div className={classes.closeIcon} onClick={this.props.closeAddUser}>
                    <AiOutlineCloseCircle size="2em" color="#0a42a4" />
                </div>
                <div style={this.isMobile ? {paddingLeft: "45px"} : null}>
                    <SearchBar 
                        dontMove
                        placeholder="search users by..."
                        selectedOption={this.filterSearchHandler}
                        clicked={this.filterSearchHandler}
                        selectValues={["nickname", "name", "surname", "id"]} 
                        resetFilter={()=>{this.setState({filterIn: "none", filterBy: "none", users: [], searched: false})}}
                        sendSearch={this.searchNewUser}
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
                </div>
                {content}
                </div>
                {flash}
            </div>
        );
    }
}
 
export default AddUser;