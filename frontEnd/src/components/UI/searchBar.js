import React, {useState} from 'react';

import Button from '../UI/button';
import searchIcon from '../../assets/gfx/search.png';
import classes from './searchBar.module.css';
import getMobile from '../../getMobile';

const SearchBar = (props) => {
    const [searchString, setsearchString] = useState("");
    const [optionSelected, setoptionSelected] = useState(props.selectValues[0]);
    const isMobile = getMobile();

    let resetState = () => {
        setsearchString("");
        setoptionSelected(props.selectValues[0]);
        props.resetFilter();
    }

    let selectOptionHandler = (option) => {
        props.selectedOption(option, searchString);
        setoptionSelected(option);
    }

    let searchHandler = (e) => {
        if(e.target.value === "") resetState();
        setsearchString(e.target.value);
        sendSearch(optionSelected, e.target.value)
    }
    
    let sendSearch = (option, string, sendSearch) => {
        props.clicked(option, string);
        if(sendSearch === true){
            if(props.sendSearch) props.sendSearch();
        }
    }
    
    return (
        <>
            {
                isMobile ? (
                    <div>
                        <input 
                            type="text" 
                            value={searchString}
                            className={classes.Input} 
                            style={{margin: "0px"}}
                            placeholder={props.placeholder} 
                            onChange={searchHandler}
                            onKeyPress={(ev)=>{if(ev.key === "Enter") sendSearch(optionSelected, searchString, true)}}
                        />
                        <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <select style={{margin: "5px"}} className={classes.Select} value={optionSelected} onChange={(e)=>selectOptionHandler(e.target.value)}>
                                {
                                    props.selectValues.map((value, index) => {
                                        return (
                                            <option key={index}>{value}</option>
                                        )
                                    })
                                }
                            </select>
                            <Button clicked={resetState}>reset filter</Button>
                        </div>
                    </div>
                ) : (
                    <div className={classes.centerContainer}>
                        <div className={classes.smallContainer}>
                            <input 
                                type="text" 
                                value={searchString}
                                className={classes.Input} 
                                placeholder={props.placeholder} 
                                onChange={searchHandler}
                                onKeyPress={(ev)=>{if(ev.key === "Enter") sendSearch(optionSelected, searchString, true)}}
                            />
                            <img 
                                alt="search icon" 
                                src={searchIcon} 
                                className={classes.searchIcon}
                                onClick={()=>sendSearch(optionSelected, searchString)}
                            />
                        </div>
                        <select className={classes.Select} value={optionSelected} onChange={(e)=>selectOptionHandler(e.target.value)}>
                            {
                                props.selectValues.map((value, index) => {
                                    return (
                                        <option key={index}>{value}</option>
                                    )
                                })
                            }
                        </select>
                        <div className={classes.buttonConfinement}><Button clicked={resetState}>reset filter</Button></div>
                        {props.children}
                    </div>
                ) 
            }
        </>
    );
}
 
export default SearchBar;