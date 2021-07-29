import React, { Component } from 'react';
import axios from 'axios';

import classes from './JoiningConversation.module.css';
import classes2 from './addingConversation.module.css';
import classes3 from '../../FriendsList/addUser/addUser.module.css';

import {AiOutlineSearch} from 'react-icons/ai';
import { Redirect } from 'react-router-dom';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import SearchBar from '../../../components/UI/searchBar';
import Spinner from '../../../components/UI/spinner';
import Button from '../../../components/UI/button';
import Flash from '../../../components/UI/flash';
import getToken from '../../../getToken';

class JoiningConversation extends Component {
    constructor(props) {
        super(props);

        let token = getToken();

        this.state = {
            token: token,
            redirectChat: false,
            filterIn: "name",
            filterBy: "",
            loading: false,
            flashMessage: "",
            flashNotClosed: true,
        }
        this.filterSearchHandler.bind(this);
        this.searchNewConversation.bind(this);
        this.flash.bind(this);
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

    filterSearchHandler = (option, string) => {
        if(string===""){
            this.setState({filterIn: option});
        }
        else{
            this.setState({filterIn: option, filterBy: string});
        }
    }

    searchNewConversation = () => {
        if(this.state.filterBy === ""){
            this.flash('you need to write the name or Id of the conversation in the searchbar');
        }
        else{
            axios({
                method: 'post',
                url: `http://localhost:3001/`,
                headers: {'Authorization': this.state.token},
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
    }

    render() { 
        let flash = null;
        if(this.state.flashMessage && this.state.flashNotClosed){
            flash = <Flash>{this.state.flashMessage}</Flash>
        }
        else if(this.state.flashMessage && this.state.flashNotClosed === false){
            flash = <Flash close>{this.state.flashMessage}</Flash>
        }

        return (
            <div className={classes2.backDrop}>
                <div className={classes2.addUserContainer}>
                    <div className={classes2.closeIcon} onClick={()=>this.setState({redirectChat: true})}>
                        <AiOutlineCloseCircle size="2em" color="#0a42a4" />
                    </div>
                    <div className={classes.searchingContainer}>
                        <SearchBar 
                            placeholder="search conversations in..."
                            clicked={this.filterSearchHandler}
                            selectedOption={this.filterSearchHandler}
                            resetFilter={()=>{this.setState({filterIn: "name", filterBy: ""})}}
                            selectValues={["name", "id"]}
                        />
                        <div className={classes3.buttonMinifier}>
                            <Button className={classes3.SearchBtnAddUser}>
                                {
                                    this.state.loading ? <Spinner darkgreen small /> : (
                                        <div 
                                            style={{display: "flex", justifyContent:"center", alignItems: "center"}}
                                            onClick={this.searchNewConversation}
                                        >
                                            search<AiOutlineSearch size="2em" color="#0a42a4" />
                                        </div>
                                    )
                                }
                            </Button>
                        </div>
                    </div>


                </div>
            {this.state.redirectChat ? <Redirect to="/chat/" /> : null}
            {flash}
        </div>
        );
    }
}
 
export default JoiningConversation;