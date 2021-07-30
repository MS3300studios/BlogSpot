import React, { useRef, useEffect } from 'react'

const MessagesScroll = (props) => {
    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        // return () => {
        // }
    }, [])

    let handleScroll = (e)=>{
        console.log('wadadaddwad')
        console.log(e.target.scrollTop)
    }

    const bottom = useRef();

    return (
        <div>
            {props.children}
            <div style={{border: "3px dashed black"}} ref={bottom}></div>
        </div>
    );
}
 
export default MessagesScroll;