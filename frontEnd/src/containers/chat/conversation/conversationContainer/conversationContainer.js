import React, { Component } from 'react';
import Conversation from '../conversation';
import Spinner from '../../../../components/UI/spinner';
import axios from 'axios';
import getToken from '../../../../getToken';
import getUserData from '../../../../getUserData';
import { MAIN_URI } from '../../../../config';

class ConversationContainer extends Component {
    constructor(props) {
        super(props);
        let queryParams = new URLSearchParams(props.location.search);
        let id = queryParams.get('id'); 

        let token = getToken();
        let userData = getUserData();

        this.state = {
            loading: true,
            friendId: id,
            token: token,
            userData: userData,
            conversation: null
        }
    }
    
    componentDidMount(){
        axios({
            method: 'post',
            url: `${MAIN_URI}/conversations/checkPrivate`,
            headers: {'Authorization': this.state.token},
            data: {
                userId: this.state.userData._id,
                friendId: this.state.friendId
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

    render() { 
        return (
            <div>
                {
                    this.state.loading ? <Spinner/> : <Conversation conversation={this.state.conversation}/>
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