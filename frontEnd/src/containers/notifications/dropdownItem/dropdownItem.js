import classes from '../notifications.module.css';
import React, { Component } from 'react';
import getToken from '../../../getToken';
import axios from 'axios';
import Spinner from '../../../components/UI/spinner';
import { Link } from 'react-router-dom';
import { FaRegTrashAlt } from 'react-icons/fa';
import { MAIN_URI } from '../../../config';

class DropdownItem extends Component {
    constructor(props) {
        super(props);

        let token = getToken();

        this.state = {
            token: token,
            user: null,
            mainClassNames: [classes.dropdownItem],
            hide: false,
            wasSeen: this.props.data.wasSeen
        }

        this.getuserData.bind(this);
        this.setSeen.bind(this);
    }

    componentDidMount(){
        let userToGetId;
        if(this.props.data.senderId !== undefined){
            userToGetId = this.props.data.senderId;
        }
        else{
            userToGetId = this.props.data.userId;
        }
        this.getuserData(userToGetId);
    }

    getuserData = (userId) => {
        axios({
            method: 'get',
            url: `${MAIN_URI}/users/getUser/${userId}`,
            headers: {'Authorization': this.state.token},
        })
        .then((res)=>{
            this.setState({user: res.data.user});
        })
        .catch(error => {
            console.log(error);
        })
    }

    setSeen = () => {
        if(this.state.wasSeen === false){
            axios({
                method: 'get',
                url: `${MAIN_URI}/notifications/setSeen/${this.props.data._id}`,
                headers: {'Authorization': this.state.token}
            })
            .then((res)=>{
                if(res.status===200){
                    if(res.data.wasSeen === true){
                        this.setState({wasSeen: true});
                        this.props.decrementCounter();
                    } 
                }
            })
            .catch(error => {
                console.log(error);
            })
        }
    }

    render() { 
        let notification = <Spinner darkgreen />;
        if(this.state.user != null && this.props.data.senderId === undefined){
            notification = (
                <React.Fragment>
                    <div className={classes.notificationLink}>
                        <a href={"/#/user/profile/?id="+this.state.user._id} className={classes.notificationLink}>
                            <img src={this.state.user.photo} alt="this person wants to be your friend" className={classes.friendRequestPhoto}/>
                            <div><p className={classes.bold}>{`@${this.state.user.nickname}`}</p> wants to be your friend</div> 
                        </a>
                        <div 
                            className={classes.notificationItemTrashIconPositionContainer}
                            onClick={()=>this.setState(prevState => {
                                setTimeout(()=>{
                                    this.setState({hide: true});
                                },600);

                                this.props.deleteNotif(true, false, {
                                    friendReqId: this.props.data._id
                                }); //TODO: fill data object with data required for identification of friendReq to deleted

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
                </React.Fragment>
            )
        }
        else if(this.state.user != null){
            let grammar = null;
            let link = null;
            if(this.props.data.actionType === "commented") grammar = "on";    
            if(this.props.data.objectType === "photo") link = `/photo/?id=${this.props.data.objectId}`
            else link = `/post/?id=${this.props.data.objectId}`
            
            notification = (
                <div className={classes.notificationLink}>
                    <div style={{height: "100%", display: "flex", alignItems: "center", marginRight: "25px"}}>
                        {
                            this.state.wasSeen ? null : (
                                <div className={classes.newIcon}></div>
                            )
                        }
                    </div>
                    <Link to={"/user/profile/?id="+this.state.user._id} style={{color: 'unset', textDecoration: "none"}}>
                        <img src={this.state.user.photo} alt="friend" className={classes.friendRequestPhoto}/>
                    </Link>
                    <Link to={link} className={classes.notificationLink} replace>
                        <div><p className={classes.bold}>{`@${this.state.user.nickname}`}</p>{this.props.data.actionType} {grammar} your {this.props.data.objectType}</div> 
                    </Link>
                    <div 
                        className={classes.notificationItemTrashIconPositionContainer}
                        onClick={()=>{
                            setTimeout(()=>{
                                this.setState({hide: true});
                            },600);

                            this.setState(prevState => {

                                this.props.deleteNotif(false, false, {notificationId: this.props.data._id}, this.props.elKey); 

                                let temp = prevState.mainClassNames;
                                temp.push(classes.moveRight);

                                return {
                                    ...prevState,
                                    mainClassNames: temp
                                }
                            })
                        }}
                    >
                        <FaRegTrashAlt size="2em" color="#0a42a4"/>
                    </div>
                </div>
            )
        }

        return (
            <React.Fragment>
                <div className={this.state.hide ? classes.hide : null} onClick={this.setSeen}>
                    <div className={this.state.mainClassNames.join(" ")}>
                        {notification}
                    </div>
                    <hr />
                </div>
            </React.Fragment>
        );
    }
}
 
export default DropdownItem;