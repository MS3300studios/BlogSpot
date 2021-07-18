import React, { Component } from 'react';

import classes from './addUser.module.css';
import SearchBar from '../../../components/UI/searchBar';
import Button from '../../../components/UI/button';
import {AiOutlineSearch} from 'react-icons/ai';
import {AiOutlineCloseCircle} from 'react-icons/ai';


class AddUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            usedFilter: false,
            filterIn: "none",
            filterBy: "none",
        }
    }

    filterSearchHandler = (option, string) => {
        this.setState({filterIn: option, filterBy: string, usedFilter: true});
    }

    render() { 
        let initMsg = <p>write in the searchbar in order to search</p>
        if(this.state.searched){
            // initMsg = this.state.users.map()
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
                        resetFilter={()=>{this.setState({filterIn: "none", filterBy: "none", usedFilter: false})}}
                    ><div className={classes.buttonMinifier}><Button className={classes.SearchBtnAddUser}>
                        <div style={{display: "flex", justifyContent:"center", alignItems: "center"}}>
                            search<AiOutlineSearch size="2em" color="#0a42a4" />
                        </div>
                    </Button></div></SearchBar>
                    {initMsg}
                </div>
                <p>{this.state.filterBy}</p>
                <p>{this.state.filterIn}</p>
            </div>
        );
    }
}
 
export default AddUser;