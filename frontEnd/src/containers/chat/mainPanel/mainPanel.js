import React, { Component } from 'react';
import classes from './mainPanel.module.css';
import { RiSendPlaneFill, RiSendPlaneLine } from 'react-icons/ri' 


class MainPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return (
            <div className={classes.mainPanel}>
                <h1>{this.props.chatId}</h1>
                <div className={classes.messagesContainer}>
                    <div className={classes.message}>

                    </div>
                </div>
                <div className={classes.inputMenu}>
                    <input type="text"/>
                    <div 
                        onMouseDown={(e)=>{
                            this.setState({sendPressed: true})
                            console.log(e.target.value);
                        }}
                        onMouseUp={()=>{this.setState({sendPressed: false})}} 
                        className={classes.sendIcon}>
                        {this.state.sendPressed ? <RiSendPlaneLine size="2em"/> : <RiSendPlaneFill size="2em" />}
                    </div>
                </div>
            </div>
        );
    }
}
 
export default MainPanel;