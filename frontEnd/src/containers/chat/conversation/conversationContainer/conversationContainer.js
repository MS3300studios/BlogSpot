import React from 'react';
import Conversation from '../conversation';
import { withRouter } from 'react-router';

const conversationContainer = (props) => {
    console.log(props)
    return (
        <div>
            <Conversation conversation/>
        </div>
    );
}
 
export default withRouter(conversationContainer);