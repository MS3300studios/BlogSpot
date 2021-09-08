import * as actionTypes from './actions';

import io from 'socket.io-client';

// const initialState = {
//     newMessage: "",
//     newSendMessage: "",
//     socket: io('http://localhost:3001')
// };
const initialState = {
    socket: io('http://localhost:3001')
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.RECEIVING_MESSAGE:
            console.log("[STORE]", action);
            return {
                ...state,
                newMessage: action.data                
            };
        case actionTypes.SENDING_MESSAGE:
            console.log("[STORE]", action);
            return {
                ...state,
                newSendMessage: action.data                
            };
        case actionTypes.TEST:
            console.log("[STORE]", action);
            return {
                ...state            
            };

        default:
            return state;
    }
};

export default reducer;