import React from 'react';

import classes from './flash.module.css';

const flash = (props) => {

    let classNames = [classes.Flash];
    
    if(props.close){
        classNames.push(classes.Close);
    }

    return ( 
        <div className={classNames.join(' ')}>
            <p>{props.children}</p>
        </div>
    );
}
 
export default flash;




// import React, { Component } from 'react';
// import classes from './flash.module.css';

// class Flash extends Component {
//     constructor(props){
//         super(props);
//         this.state = {
//             classNames: [classes.Flash]
//         }
//     }

//     render(){

//         if(this.props.close){
//             this.setState({classNames: [classes.Flash, classes.Close]})
//         }

//         return( 
//             <div className={this.state.classNames.join(' ')}>
//                 <p>{this.props.children}</p>
//             </div>
//         )
//     }
// }
   
 
// export default Flash;


