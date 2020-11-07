/* eslint-disable no-useless-constructor */
import React, {Component,useContext} from "react";
import {XTerm} from 'xterm-for-react';
import openConnection from "socket.io-client";
import SignInContext from "./SignInContext";
import axios from 'axios';
class Terminal extends Component{
    constructor(props){
        super(props);
        this.xtermRef = React.createRef();
        this.state={
            command:"",
            username:this.props.username,
            serverName:this.props.serverName
        }
    };
    static contextType=SignInContext;//the sign in context can now be accessed using this.context
    componentDidMount(){
        
        this.xtermRef.current.terminal.writeln("Welcome to PyLot terminal");
        axios.post("/getIp",{
            username:this.state.username,
            serverName:this.state.serverName
        }).then(({data})=>{
            console.log(data)
            if(typeof data==="string"){
                const socket = openConnection(`http://${data}:5000/`)
                this.state.socket = socket;
                socket.on('connect',()=>{
                    this.writeToTerminal('\x1B[1;1;32m***Connected to PyLot terminal runtime ✈ ***\x1B[0m \n\r')
                });
                socket.on('disconnect',()=>{
                    this.writeToTerminal('\x1B[1;3;31m***Disconnected from PyLot terminal runtime ☠ ***\x1B[0m \n\r')     
                })
                socket.on('send-output',data=>{
                    this.xtermRef.current.terminal.write(data)
                })
            }else{
                alert(data.message)
            }
        })
        // const socket = openConnection("http://167.71.237.73:5550/");
        // this.state.socket = socket;
        // socket.on('connect',()=>{
        //     this.writeToTerminal('\x1B[1;1;32m***Connected to PyLot terminal runtime ✈ ***\x1B[0m \n\r')
        // })
        // socket.on('disconnect',()=>{
        //     this.writeToTerminal('\x1B[1;3;31m***Disconnected from PyLot terminal runtime ☠ ***\x1B[0m \n\r')
        // })
        // socket.on('send-output',data=>{
        //     this.xtermRef.current.terminal.write(data)
        // })
    }
    writeToTerminal(dataString){
        this.xtermRef.current.terminal.writeln('\n\r'+dataString)
    }
    render(){
        
        return (
            <div className="terminal-container">
                <XTerm ref={this.xtermRef} onKey={({key,domEvent})=>{
                    
                        if(domEvent.code==="Enter"){
                            console.log(this.state);
                            this.xtermRef.current.terminal.writeln("");
                            this.state.socket.emit('run-command',this.state.command);
                            this.state.command="";
                        }else{
                            this.state.command+=key
                            this.xtermRef.current.terminal.write(key)
                        }
                }}
                />
            </div>
        )
    }    
}
export default Terminal;
