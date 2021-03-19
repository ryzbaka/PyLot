import React,{Component} from 'react';

class NotebookServerBridge extends Component{
    constructor(props){
        super(props);
        this.state={
            status:props.status
        };
    }
    render(){
        const state = this.state.status;
        let connectionStatus = state === "Disconnected from PyLot runtime."
        return(
            <div style = {
                    {
                        backgroundColor:connectionStatus
                        ?
                        'red'
                        :
                        'green',
                        width:"40%"
                    }
                }className = "bridge">
                <p style={
                    {
                        color: connectionStatus?'pink':'lightgreen',
                        fontFamily:"sans-serif"
                    }
                }>{this.state.status}</p>
            </div>
        )
    }
}

export default NotebookServerBridge;