import * as actionTypes from './actions';

import { MAIN_URI } from '../config';

import io from 'socket.io-client';

const initialState = {
    socket: io(`${MAIN_URI}`)
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