import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { TEST } from './store/actions';

const Test = (props) => {

    const [received, setreceived] = useState(false)
    const style = {backgroundColor: "black", cursor: "pointer"};

    useEffect(() => {
        props.socket.on('test-response', () => setreceived(true));
    }, [props.socket])

    return (
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%"}}>
            <div>
                <h1>test</h1>
                <button
                    style={style}
                    onClick={()=>{
                        props.socket.emit('test')
                    }}
                >
                    click to test
                </button>
                <button
                    style={style}
                    onClick={()=>{
                        props.update();
                    }}
                >
                    update state
                </button>
                <button
                    style={style}
                    onClick={()=>{
                        setreceived(false)
                    }}
                >
                    reset state
                </button>
            </div>
            {received ? <h1>I received!</h1> : <h1>I didn't receive</h1>}
        </div>
    );
}
 
const mapStateToProps = state => {
    return {
        socket: state.socket
    }
}

const mapDispatchToProps = dispatch => {
    return {
        update: () => dispatch({type: TEST, data: "testing"})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Test);