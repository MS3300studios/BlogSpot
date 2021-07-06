import * as actionTypes from './actions';

const initialState = {
    fullFriends: []
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.ADD_FRIEND:
            let arr = state.fullFriends;
            arr.push(action.data);
            return {
                ...state,
                fullFriends: arr
            };
        case actionTypes.CHECK_STORE:
            console.log(state)
            return state;
        default:
            return state;
    }
};

export default reducer;