import React, { Component } from 'react';
import { connect } from "react-redux";
import Alert from 'react-bootstrap/Alert'

class Message extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (                        
            this.props.msg.flag ? 
            <Alert variant={this.props.msg.msgType} onClose={() => this.props.setMessage(false)} dismissible>
                <Alert.Heading>{this.props.msgHead} </Alert.Heading>
                <p>
                    {this.props.msgBody}
                </p>
            </Alert>
            :
            null
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    setMessage:msg=> dispatch({ type: MESSAGE_DATA, payload: msg })
});

const mapStateToProps = (state) => ({
    msg:stat.common.msg
});

export default connect(mapStateToProps, mapDispatchToProps)(Message);