/* eslint-disable no-useless-constructor */
import React, {Component,useContext} from "react";
import {XTerm} from 'xterm-for-react';
import openConnection from "socket.io-client";
import SignInContext from "./SignInContext";
// function subscribeToSocket(ipAddr, callBack) {
//   const socket = openConnection(`http://${ipAddr}:5000/`);
//   socket.emit("get-health", window.location.href);
//   socket.on("send-health", (receivedData) => callBack(null, receivedData));
// }
class Terminal extends Component{
    constructor(props){
        super(props);
        this.xtermRef = React.createRef();
        this.state={
            command:""
        }
    };
    static contextType=SignInContext;//the sign in context can now be accessed using this.context
    componentDidMount(){
        this.xtermRef.current.terminal.writeln("Welcome to PyLot terminal");
        if(this.context[0][0]==="Signed Out"){
            this.xtermRef.current.terminal.writeln("You must be signed in to use the terminal");    
        }
    }
    render(){
        
        return (
            <div className="terminal-container">
                <XTerm ref={this.xtermRef} onKey={({key,domEvent})=>{
                    if(this.context[0][0]==="Signed Out"){
                        this.xtermRef.current.terminal.writeln("Did not process keystroke. Log in to continue.")                     
                    }else{
                        if(domEvent.code==="Enter"){
                            console.log("enter key was pressed.")
                            console.log(`The command issued was ${this.state.command}`)
                            this.state.command=[];
                        }else{
                            this.state.command+=key
                            this.xtermRef.current.terminal.write(key)
                        }
                    }
                }}
                />
            </div>
        )
    }    
}
export default Terminal;
// if(domEvent.code==="Enter"){
//     console.log("enter key was pressed.")
//     console.log(`The command issued was ${this.state.command}`)
//     this.state.command=[];
// }else{
//     this.state.command+=key
//     this.xtermRef.current.terminal.write(key)
// }