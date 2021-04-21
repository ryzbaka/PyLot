import React, {Component} from "react";
import axios from "axios";
import {navigate} from "@reach/router"
import CircularProgress from "@material-ui/core/CircularProgress";
import openConnection from "socket.io-client";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

class View extends Component{
    state = {
        username:this.props.username,
        notebookName:window.location.href.split("/")[window.location.href.split("/").length-2],
        tileName:window.location.href.split("/")[window.location.href.split("/").length-1],
        loadedData:false,
        socket : "No Socket",
        data:"No data",
        columnNames:"None",
        rows:"None"
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
                                const columnNames = Object.keys(data);
                                console.log(columnNames);
                                const rows = []
                                columnNames.forEach((column,index)=>{
                                    const keys = Object.keys(data[column]);
                                    const row = [];
                                    keys.forEach((el,index)=>{
                                        row.push(data[column][el])
                                    })
                                    rows.push(row)
                                });
                                // console.log(rows)
                                this.setState({loadedData:true,data:data,columnNames:columnNames,rows:rows})
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
            const columnNames = this.state.columnNames;
            const array = this.state.rows;
            const numColumns = array[0].length;
            const numRows = array.length;
            const newArray = []
            for(let j=0;j<numColumns;j++){
                const newRow=[]
                for(let i=0;i<numRows;i++){
                    newRow.push(array[i][j])
                }
                newArray.push(newRow);
            }
            console.log(array)
            console.log(newArray)
            return(
                <div className="container">
                    <h5>{this.state.tileName}</h5>
                    <button onClick={this.backToNotebook}>Back</button>
                    {/* <p>{JSON.stringify(this.state.data)}</p> */}
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                   {columnNames.map((columnName,i)=>(
                                       <TableCell key={i+"columnHead"}>{columnName}</TableCell>
                                   ))} 
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    newArray.map((row,i)=>(
                                        <TableRow>
                                            {row.map((value,index)=>(
                                                <TableCell>
                                                    {value}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            )
        }
    }
}
export default View;