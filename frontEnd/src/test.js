import React from 'react';
import { connect } from 'react-redux'

const test = (props) => {

    console.log(props.redux)

    return (
        <>
            <h1>test</h1>
        </>
    );
}
 
const mapStateToProps = state => {
    return {
        redux: state
    }
}

export default connect(mapStateToProps)(test);