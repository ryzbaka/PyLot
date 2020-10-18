import React,{Component} from "react";
import openConnection from "socket.io-client";

function subscribeToSocket(ipAddr,cb){
    let socket=openConnection(`http://${ipAddr}:5000`);
    socket.emit('get-health',null);
    socket.on('send-health',receivedData=>cb(null,receivedData));
}

class SocketApi extends Component{
    constructor(props){
        super(props);
        subscribeToSocket("167.71.237.73",(err,receivedData)=>{
            this.setState({
                data:receivedData
            })
        });
    }
    state={
        data:"No data received from websocket"
    }
    render(){
        return (
            <div>
                <h1>Socket Test</h1>
                <h2>Socket data:{JSON.stringify(this.state.data)}</h2>
            </div>
        )
    }
}
export default SocketApi;