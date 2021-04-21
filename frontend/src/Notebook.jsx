/* eslint-disable no-useless-constructor */
import { navigate } from "@reach/router";
import React, { Component } from "react";
import P5Wrapper from "react-p5-wrapper";
import sketch from "./sketch.js";
import NotebookServerBridge from "./NotebookServerBridge";
import axios from "axios";
// import SignInContext from "./SignInContext";
import openConnection from "socket.io-client";
// let socket="No socket";
class Notebook extends Component {
  state = {
    username: this.props.username,
    notebookName: this.props.notebookName,
    connectionStatus: "Disconnected from PyLot runtime.",
    server: "",
    socket: "No socket",
    // something: ()=>console.log(this.notebookName)
  };
  notebookConnected() {
    console.log("Notebook connected to websocket.");
    this.setState({ connectionStatus: "Connected to PyLot runtime" });
    // console.log(this.state)
  }
  notebookDisconnected() {
    console.log("Notebook disconnected from websocket.");
    this.setState({ connectionStatus: "Disconnected from PyLot runtime." });
    // console.log(this.state)
  }
  componentDidMount() {
    const username = "testpilot";
    // const serverName = prompt("Enter server name: ");
    const serverName = "Local Test Server"
    if (this.state.socket === "No socket") {
      axios
        .post("/getIp", {
          username: username,
          serverName: serverName,
        })
        .then(({ data }) => {
          // console.log(this.state)
          let connectionStatus;
          if (typeof data === "string") {
            this.state.socket = openConnection(`http://${data}:5000/`);
            this.state.socket.on("connect", () => {
              this.notebookConnected();
            });
            this.state.socket.on("disconnect", () => {
              this.notebookDisconnected();
            });
          } else {
            alert(data.message);
          }
        });
    // console.log(this.state.socket)
    }
  }
  render() {
    const username = this.state.username;
    const notebookName = this.state.notebookName;
    const servers = this.state.servers;
    return (
      <div className="notebook-container">
        {/* <h1>{this.state.connectionStatus}</h1> */}
        <h3 className="teal-text text-accent-3">
          {username}'s Notebook [{notebookName}]
        </h3>
        <div id="notebook-buttons-container">
          <button id="add-tile-button">Add tile</button>
          <button id="remove-tile-button">Remove tile</button>
          <button id="bind-button">Bind Tiles</button>
          <button id="save-notebook">Save Notebook</button>
          {/* <button id="edit-tile-code" onClick={this.editTileHandler}>Edit Tile Code</button> */}
          <button id="edit-tile-code">Edit Tile Code</button>
          <button
            id="back-button"
            onClick={() => navigate(`/notebooks/${username}`)}
          >
            Back
          </button>
          <button id="run-tile-code">Run Tile Code</button>
          <button id="view-tile-output">View Tile Output</button>
          <div
            className="connection-status-display"
            style={{
              backgroundColor:
                this.state.connectionStatus === "Connected to PyLot runtime"
                  ? "green"
                  : "red",
              width: "40%",
            }}
          >
            <p
              style={{
                color: "white",
              }}
            >
              {this.state.connectionStatus}
            </p>
          </div>
        </div>
        <P5Wrapper sketch={sketch}></P5Wrapper>
        <div className="tile-info">
          <p id="tile-name"></p>
          <p></p>
        </div>
      </div>
    );
  }
}
// Notebook.contextType = SignInContext;
export default Notebook;
