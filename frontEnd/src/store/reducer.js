import * as actionTypes from './actions';

const initialState = {
    fullFriends: [],
    friendReqIdToBeRemoved: null,
    refreshComments: false
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.ADD_FRIEND:
            let arr = state.fullFriends;
            console.log(state.fullFriends)
            arr.push(action.data);
            return {
                ...state,
                fullFriends: arr
            };
        case actionTypes.CHECK_STORE:
            console.log(state)
            return state;
        case actionTypes.CLEAR_FULLFRIENDS:
            return {
                ...state,
                fullFriends: []
            };
        case actionTypes.REMOVE_NOTIF_FRIENDREQ:
            return {
                ...state,
                friendReqIdToBeRemoved: action.data
            };
        case actionTypes.REFRESH_COMMENTS:
            let temp = initialState.refreshComments;
            return {
                ...state,
                refreshComments: !temp
            };
        default:
            return state;
    }
};

export default reducer;