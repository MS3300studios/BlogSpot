import React, { Component } from 'react';
import Conversation from '../conversation';
import Spinner from '../../../../components/UI/spinner';
import axios from 'axios';

class ConversationContainer extends Component {
    constructor(props) {
        super(props);
        let queryParams = new URLSearchParams(props.location.search);
        let id = queryParams.get('id'); 

        this.state = {
            loading: true,
            conversationId: id,
        }
    }
    
    componentDidMount(){
        //axios call to fetch conversation data
    }

    render() { 
        return (
            <div>
                <Conversation conversation/>
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