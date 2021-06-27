import React, { Component } from 'react';
import classes from './chatMenu.module.css';


class ChatMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            converstaions: [
                {
                    user: "Monica",
                    message: "Hello, how are you doing?"
                },
                {
                    user: "Andrew",
                    message: "Sup my man!"
                },
                {
                    user: "Mike",
                    message: "I like gherkins"
                },
                {
                    user: "Kate",
                    message: "I love react"
                }
            ],
        }
    }
    render() { 
        let converstaions = this.state.converstaions.map((el, index) => {
            return (
                <div className={classes.converstaion} onClick={()=>this.props.selectChat(index)} key={index}>
                    <h1>{el.user}</h1>
                    <p>{el.message}</p>
                </div>
            )
        })
        return (
            <div className={classes.chatMenu}>
                {converstaions}
            </div>
        );
    }
}
 
export default ChatMenu;