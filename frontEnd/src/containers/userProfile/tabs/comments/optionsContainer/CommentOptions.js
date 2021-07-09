import React, { Component } from 'react';
import axios from 'axios';
import getToken from '../../../../../getToken';

import { BsThreeDots } from 'react-icons/bs';
import classes from '../comments.module.css';

class CommentOptions extends Component {
    constructor(props) {
        super(props);

        let token = getToken();

        this.state = {
            token: token,
            open: false
        }
        this.openHandler.bind(this);
    }

    openHandler = () => {
        let curropen = this.state.open;
        this.setState({open: !curropen});
    }

    optionsAction = (type) => {
        if(type === "delete"){
            //delete comment from props id
            axios({
                method: 'delete',
                url: `http://localhost:3001/comments/delete/${this.props.commentId}`,
                headers: {'Authorization': this.state.token}
            })
            .then((res)=>{
                if(res.status===200){
                    this.props.flashProp("comment deleted");
                    return;
                }
            })
            .catch(error => {
                console.log(error);
            })
        }
        else if(type === "edit"){
            this.props.editComment();
        }
    }

    render() { 
        return (
            <div className={classes.optionsDiv} onClick={this.openHandler}>
                <BsThreeDots size="1.5em" color="#0a42a4" className={classes.threeDotsIcon}/>
                { this.state.open ? (
                    <div className={classes.optionsContainer}>
                        <option onClick={()=>this.optionsAction("edit")}>edit</option>
                        <option onClick={()=>this.optionsAction("delete")}>delete</option>
                    </div>
                ) : null }
            </div>
        );
    }
}
 
export default CommentOptions;