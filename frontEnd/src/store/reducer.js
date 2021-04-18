import * as actionTypes from './actions';
import axios from 'axios';

const initialState = {
    posts: [],
    id: "",
    token: " "
};


if(this.state.token!== " ")
axios.get('/blogs')
.then(res => {
    for(let key in res.data) {
        initialState.posts.push({
            ...res.data[key],
            id: key
        });
    }
});


console.log("initial state posts after axios.get\n",initialState.posts);


const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.ADD_POST:
            return {
                ...state,
                posts: [
                    ...state.posts,
                    {
                        author: action.data.author,
                        content: action.data.content,
                        title: action.data.title,
                        id: action.data.id
                    }
                ]
            };
        case actionTypes.REMOVE_POST:
            return {
                ...state,
                posts: state.posts.filter(post => post.id !== action.id)
            };
        case actionTypes.STORE_TOKEN:
            return {
                ...state,
                token: action.token
            };
        case actionTypes.REFRESH_POSTS:
            let newPosts = [];
            axios.get('/blogs')
                .then(res => {
                    for(let key in res.data) {
                        newPosts.push({
                            ...res.data[key],
                            id: key
                        });
                    }
                });
            return {
                ...state,
                posts: newPosts
            };
        default:
            return state;
    }
};

export default reducer;