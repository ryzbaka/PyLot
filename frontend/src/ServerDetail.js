/* eslint-disable no-useless-constructor */
import React, { Component, setState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import { navigate } from "@reach/router";
import openConnection from "socket.io-client";

function subscribeToSocket(ipAddr, callBack) {
  const socket = openConnection(`http://${ipAddr}:5000/`);
  socket.emit("get-health", window.location.href);
  socket.on("send-health", (receivedData) => callBack(null, receivedData));
}

class ServerDetails extends Component {
  constructor(props) {
    super(props);
    subscribeToSocket(this.state.ipAddr, (err, receivedData) => {
      this.setState({ data: receivedData, socketRunning: true });
    });
  }
  state = {
    password: this.props.serverPassword,
    user: this.props.serverUser,
    username: this.props.username,
    serverName: this.props.serverName,
    ipAddr: this.props.ipAddr,
    columnNames: [],
    loading: false,
    socketRunning: false,
    data: {
      uptime: "🤷‍",
      operatingSystem: "🤷‍♂️",
      memoryUsedPercent: "🤷‍",
      cpuUsage: "🤷‍♂️",
    },
  };
  render() {
    if (this.state.loading) {
      return (
        <div className="serverDetailsPageMainContainer ">
          <CircularProgress />
        </div>
      );
    } else {
      const { serverName, username, socketRunning } = this.state;
      function RemoveServer() {
        const sName = prompt(
          "Please enter name of the server to continue server deletion."
        );
        if (sName === serverName) {
          axios
            .post("/users/removeserver", {
              username: username,
              serverName: sName,
            })
            .then((response) => {
              if (
                response.data ===
                `Server : ${serverName} was deleted successfully.`
              ) {
                alert("Server deleted successfully.");
                navigate("/");
              } else {
                alert("Failed to delete server.[Internal Issue]");
              }
            });
        } else {
          alert("Did not delete server.");
        }
      }
      function startHealthReportingService() {
        if (socketRunning) {
          alert("Health reporting service already running on remote server.");
        } else {
          const data = {
            username: username,
            serverName: serverName,
          };
          axios.post("/health/setupserver", data).then((response) => {
            console.log(response);
            alert("Done.");
          });
        }
      }
      function openTerminal() {
        // alert(`Open new window to ${ipAddr}`)
        navigate(`/terminal/${username}/${serverName}`);
      }
      function openNotebook() {
        navigate("/notebook");
      }
      const { ipAddr } = this.state;
      const healthData = this.state.health;
      return (
        <Card style={{ maxHeight: "30%", minHeight: "50%" }}>
          <CardContent>
            <Typography variant="h5">{this.state.serverName}</Typography>
            <Typography>{this.state.data.operatingSystem}</Typography>
            <Typography>User: {this.state.user}</Typography>
            <Typography>Uptime: {this.state.data.uptime}</Typography>
            <Typography>{this.state.data.cpuUsage}💻</Typography>
            <Typography>
              Memory Usage: {this.state.data.memoryUsedPercent}🐏
            </Typography>
            <Typography>
              {this.state.socketRunning
                ? "Health Reporting Service is online 🩺"
                : "Health reporting service is offline on remote server 😢"}
            </Typography>
            <p
              className="waves-effect btn remove-server teal accent-3"
              onClick={RemoveServer}
            >
              REMOVE SERVER
            </p>
            <p
              className="waves-effect btn remove-server teal accent-3"
              onClick={startHealthReportingService}
            >
              Setup Health Reporting Service
            </p>
            <p
              className="waves-effect btn remove-server teal accent-3"
              onClick={openTerminal}
            >
              Open Terminal
            </p>
            <p
              className="waves-effect btn remove-server teal accent-3"
              onClick={openNotebook}
            >
              Open Notebook
            </p>
          </CardContent>
        </Card>
      );
    }
  }
}

export default ServerDetails;
