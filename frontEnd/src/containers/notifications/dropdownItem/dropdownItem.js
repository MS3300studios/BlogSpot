import classes from '../notifications.module.css';
import React, { Component } from 'react';
import getToken from '../../../getToken';
import axios from 'axios';
import Spinner from '../../../components/UI/spinner';
import { Link } from 'react-router-dom';
import { FaRegTrashAlt } from 'react-icons/fa';

class DropdownItem extends Component {
    constructor(props) {
        super(props);

        let token = getToken();

        this.state = {
            token: token,
            user: null,
            mainClassNames: [classes.dropdownItem] 
        }

        this.getuserData.bind(this);
    }

    componentDidMount(){
        let userToGetId;
        if(this.props.data.senderId !== undefined){
            userToGetId = this.props.data.senderId;
        }
        else{
            userToGetId = this.props.data.userId;
        }

        console.log(userToGetId)
        this.getuserData(userToGetId);
    }

    getuserData = (userId) => {
        axios({
            method: 'get',
            url: `http://localhost:3001/users/getUser/${userId}`,
            headers: {'Authorization': this.state.token},
        })
        .then((res)=>{
            this.setState({user: res.data.user});
        })
        .catch(error => {
            console.log(error);
        })
    }

    render() { 
        let notification = <Spinner darkgreen />;
        if(this.state.user != null && this.props.data.senderId === undefined){
            notification = (
                <React.Fragment>
                    <a href={"/user/profile/?id="+this.state.user._id} className={classes.notificationLink}>
                        <img src={this.state.user.photo} alt="this person wants to be your friend" className={classes.friendRequestPhoto}/>
                        <div><p className={classes.bold}>{`@${this.state.user.nickname}`}</p> wants to be your friend</div> 
                        <div className={classes.notificationItemTrashIconPositionContainer}>
                            <FaRegTrashAlt size="2em" color="#0a42a4"/>
                        </div>
                    </a>
                </React.Fragment>
            )
        }
        else if(this.state.user != null){
            let grammar = null;
            let link = null;
            if(this.props.data.actionType === "commented") grammar = "on";    
            if(this.props.data.objectType === "photo") link = `/photo/?id=${this.props.data.objectId}`
            else link = `post/?id=${this.props.data.objectId}`
            
            notification = (
                <div className={classes.notificationLink}>
                    <a href={"/user/profile/?id="+this.state.user._id} style={{color: 'unset', textDecoration: "none"}}>
                        <img src={this.state.user.photo} alt="friend" className={classes.friendRequestPhoto}/>
                    </a>
                    <Link to={link} className={classes.notificationLink}>
                        <div><p className={classes.bold}>{`@${this.state.user.nickname}`}</p>{this.props.data.actionType} {grammar} your {this.props.data.objectType}</div> 
                    </Link>
                    <div 
                        className={classes.notificationItemTrashIconPositionContainer}
                        onClick={()=>this.setState(prevState => {
                            let temp = prevState.mainClassNames;
                            temp.push(classes.moveRight)
                            return {
                                ...prevState,
                                mainClassNames: temp
                            }
                        })}
                    >
                        <FaRegTrashAlt size="2em" color="#0a42a4"/>
                    </div>
                </div>
            )
        }

        return (
            <React.Fragment>
                <div className={this.state.mainClassNames.join(" ")}>
                    {notification}
                </div>
                <hr />
            </React.Fragment>
        );
    }
}
 
export default DropdownItem;