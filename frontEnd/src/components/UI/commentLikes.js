// import React, { Component } from 'react';
// import axios from 'axios';

// import classes from './commentLikes.module.css';

// class CommentLikes extends Component {
//     constructor(props){
//         super(props);
//         this.state = {

//         }
//         this.getLikesCount.bind(this);
//         this.getFill.bind(this);
//         this.sendAction.bind(this);
//     }

//     componentDidMount(){
//         this.getLikesCount(true); //get dislikes count
//         this.getLikesCount(false); //get likes count
//         this.getFill();
//     }

//     getLikesCount = (dislike) => {
//         let url = "http://localhost:3001/commentLike/count";
//         if(dislike) url = "http://localhost:3001/commentDislike/count";    
//         axios({
//             method: 'post',
//             url: url,
//             headers: {'Authorization': this.state.token},
//             data: { commentId: this.props.objectId }
//         })
//         .then((res)=>{
//             if(res.status===200){
//                 if(dislike){
//                     this.setState({DislikeCount: res.data.count});
//                 }
//                 else{
//                     this.setState({LikeCount: res.data.count});
//                 }
//             }
//         })
//         .catch(error => {
//             console.log(error);
//         })

//         else{
//             let url = "";
//             if(dislike) url = "";
    
//             axios({
//                 method: 'post',
//                 url: url,
//                 headers: {'Authorization': this.state.token},
//                 data: { commentId: this.state.objectId }
//             })
//             .then((res)=>{
//                 if(res.status===200){
//                     if(dislike){
//                         this.setState({DislikeCount: res.data.count});
//                     }
//                     else{
//                         this.setState({LikeCount: res.data.count});
//                     }
//                 }
//             })
//             .catch(error => {
//                 console.log(error);
//             })
//         }
//     }

//     render() { 
//         return (
//             <div className={classes.container}>

//             </div>
//         );
//     }
// }
 
// export default CommentLikes;