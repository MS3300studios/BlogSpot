import React, { useEffect, useState } from 'react'
import {FaArrowUp} from 'react-icons/fa'

import classes from './scrollListener.module.css';

const ScrollListener = (props) => {
    const [scrollNum, setscrollNum] = useState()

    let handleScroll = () => {
        console.log(window.scrollY)
        setscrollNum(window.scrollY);
    }

    let backToTop = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [scrollNum])

    let classNames = classes.scrollContainer;
    if(scrollNum>350){
        classNames = [classes.scrollContainer, classes.btnActive].join(" ");
    }

    return (
        <div>
            {props.children}
            <div className={classNames} onClick={backToTop}>
                <FaArrowUp size="2em" color="white"/>
            </div>
        </div>
    );
}
 
export default ScrollListener;