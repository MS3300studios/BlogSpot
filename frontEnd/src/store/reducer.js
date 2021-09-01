import * as actionTypes from './actions';

const initialState = {
    newMessage: "",
    newSendMessage: ""
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
        default:
            return state;
    }
};

export default reducer;