import React, {useState} from 'react';

import Button from '../UI/button';
import searchIcon from '../../assets/gfx/search.png';
import classes from './searchBar.module.css';

const SearchBar = (props) => {
    const [searchString, setsearchString] = useState("");
    const [optionSelected, setoptionSelected] = useState("title");

    let resetState = () => {
        setsearchString("");
        setoptionSelected("title");
        props.resetFilter()
    }

    let selectOptionHandler = (option) => {
        setoptionSelected(option);
    }

    let searchHandler = (e) => {
        setsearchString(e.target.value);
        sendSearch(optionSelected, e.target.value)
    }
    
    let sendSearch = (option, string) => {
        props.clicked(option, string);
    }
    

    let select = (
        <select className={classes.Select} value={optionSelected} onChange={(e)=>selectOptionHandler(e.target.value)}>
            {
                props.selectValues.map((value, index) => {
                    return (
                        <option key={index}>{value}</option>
                    )
                })
            }
        </select>
    )

    return (
        <div className={classes.centerContainer}>
            <div className={classes.smallContainer}>
                <input 
                    type="text" 
                    value={searchString}
                    className={classes.Input} 
                    placeholder={props.placeholder} 
                    onChange={searchHandler}
                    onKeyPress={(ev)=>{if(ev.key === "Enter") sendSearch(optionSelected, searchString)}}
                />
                <img 
                    alt="search icon" 
                    src={searchIcon} 
                    className={classes.searchIcon}
                    onClick={()=>sendSearch(optionSelected, searchString)}
                />
            </div>
            {select}
            <div className={classes.buttonConfinement}><Button clicked={resetState}>reset filter</Button></div>
        </div>
    );
}
 
export default SearchBar;