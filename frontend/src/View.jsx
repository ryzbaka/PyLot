import React, {Component} from "react";
import axios from "axios";
import {navigate} from "@reach/router"
import CircularProgress from "@material-ui/core/CircularProgress";
import openConnection from "socket.io-client";


class View extends Component{
    state = {
        username:this.props.username,
        notebookName:window.location.href.split("/")[window.location.href.split("/").length-2],
        tileName:window.location.href.split("/")[window.location.href.split("/").length-1],
        loadedData:false,
        socket : "No Socket",
        data:"No data"
    }
    componentDidMount(){
        if(this.state.socket=="No Socket"){
            axios
            .post("/getIp", {
                username: this.state.username,
                serverName: "Local Test Server",
            })
            .then(({ data }) => {
            // console.log(this.state)
                    let connectionStatus;
                    if (typeof data === "string") {
                        this.state.socket = openConnection(`http://${data}:5000/`);
                        this.state.socket.on("connect", () => {
                            console.log("view socket connected to runtime")
                        });
                        this.state.socket.on("disconnect", () => {
                            console.log("view socket disconnected from runtime")
                        });
                        this.state.socket.on("got-data",(data)=>{
                            // console.log(data);
                            if(Object.keys(data).includes("error")){
                                alert(data.error);
                            }else{
                                this.setState({loadedData:true,data:data})
                            }
                        })
                        this.state.socket.emit("fetch-data",{
                            notebookName:this.state.notebookName,
                            tileName:this.state.tileName
                        });
                    } else {
                        alert(data.message);
                    }
                }
            );
        }
    }
    backToNotebook(){
        navigate(`/notebooks/${window.location.href.split("/")[window.location.href.split("/").length-3]}/${window.location.href.split("/")[window.location.href.split("/").length-2]}`)
    }
    render(){
        if(!this.state.loadedData){
            return(
                <CircularProgress style={{color:"#42f5bf"}}/>
            )
        }else{
            return(
                <div className="container">
                    <h5>{this.state.tileName}</h5>
                    <button onClick={this.backToNotebook}>Back</button>
                    <p>{JSON.stringify(this.state.data)}</p>
                </div>
            )
        }
    }
}
export default View;