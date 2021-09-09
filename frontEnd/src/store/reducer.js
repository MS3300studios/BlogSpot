import * as actionTypes from './actions';

import io from 'socket.io-client';

const initialState = {
    socket: io('http://localhost:3001')
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
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