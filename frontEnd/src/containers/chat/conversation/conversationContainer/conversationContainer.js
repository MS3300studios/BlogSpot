import React, { Component } from 'react';
import Conversation from '../conversation';
import Spinner from '../../../../components/UI/spinner';
import axios from 'axios';
import getToken from '../../../../getToken';
import getUserData from '../../../../getUserData';
import { MAIN_URI } from '../../../../config';
import getMobile from '../../../../getMobile';

class ConversationContainer extends Component {
    constructor(props) {
        super(props);
        let queryParams = new URLSearchParams(props.location.search);
        const id = queryParams.get('id'); 

        const token = getToken();
        const userData = getUserData();

        this.state = {
            loading: true,
            queryId: id,
            token: token,
            userData: userData,
            conversation: null,
            failedToFind: false
        }
    }
    
    componentDidMount(){
        if(this.props.location.search.split("=")[0] === "?id"){
            axios({
                method: 'get',
                url: `${MAIN_URI}/conversation/${this.state.queryId}`, 
                headers: {'Authorization': this.state.token}
            })
            .then((res)=>{
                if(res.status===200){
                    if(res.data.error) this.setState({loading: false, failedToFind: true})
                    else this.setState({loading: false, conversation: res.data.conversation})
                }
            })
            .catch(error => {
                console.log(error);
            })
        }
        else if(this.props.location.search.split("=")[0] === "?friendId"){
            axios({
                method: 'post',
                url: `${MAIN_URI}/conversations/checkPrivate`,
                headers: {'Authorization': this.state.token},
                data: {
                    userId: this.state.userData._id,
                    friendId: this.props.location.search.split("=")[1]
                }
            })
            .then((res)=>{
                if(res.status===200 || res.status===201){
                    this.setState({
                        conversation: res.data.conversation,
                        loading: false
                    })
                    return;
                }
            })
            .catch(error => {
                console.log(error);
            })
        }
        else{
            this.setState({loading: false, failedToFind: true});
        }
    }

    render() { 
        return (
            <div>
                {
                    this.state.loading ? <Spinner/> : (
                        <>
                            {
                                this.state.failedToFind ? (
                                    <div style={{padding: "15px"}}>
                                        <h1 style={{color: "salmon", fontSize: "50px"}}>404:</h1>
                                        <h1 style={{color: "white"}}>failed to find the conversation with id={this.state.queryId}</h1>
                                    </div>
                                ) : <Conversation conversation={this.state.conversation}/>
                            }
                        </>
                    )
                }
            </div>
        );
    }
}
 
export default ConversationContainer;

/*

LOGIC:
in friendsList component every friendListItem will check if there is a conversation length 2 with
userlogged id, and user id as participants. If these criteria are met, then the conversation ID 
will be sent to the link. Otherwise the ID will be 'to be created' and such a conversation will be created in the conversation
container component

*/