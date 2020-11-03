/* eslint-disable no-useless-constructor */
import React, { Component, setState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
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
    loading: true,
    socketRunning: false,
    data: {
      uptime: "🤷‍",
      operatingSystem: "🤷‍♂️",
      memoryUsedPercent: "🤷‍",
      cpuUsage: "🤷‍♂️",
    },
  };
  componentDidMount() {
    axios
      .post("/display", {
        username: this.state.username,
        password: this.state.password,
        user: this.state.user,
        serverName: this.state.serverName,
        details: "last10",
      })
      .then(({ data }) => {
        this.setState({
          health: data,
          loading: false,
        });
      });

    //this.setState({ loading: false });
  }
  render() {
    if (this.state.loading) {
      return (
        <div className="serverDetailsPageMainContainer">
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
            alert("Done. Refresh page.");
          });
        }
      }
      function openTerminal() {
        // alert(`Open new window to ${ipAddr}`)
        navigate("/terminal");
      }
      const { ipAddr } = this.state;
      const healthData = this.state.health;
      console.log(healthData);
      const {
        Epoch_Time,
        CPU_Usage_Percent,
        Memory_Free,
        Disk_Free,
      } = healthData;
      if (Epoch_Time === undefined) {
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
                className="waves-effect btn remove-server"
                onClick={RemoveServer}
              >
                REMOVE SERVER
              </p>
              <p
                className="waves-effect btn remove-server"
                onClick={startHealthReportingService}
              >
                Setup Health Reporting Service
              </p>
              <p
                className="waves-effect btn remove-server"
                onClick={openTerminal}
              >
                Open Terminal
              </p>
            </CardContent>
          </Card>
        );
      }
      const rows = [];
      function createData(col1, col2, col3, col4) {
        return { col1, col2, col3, col4 };
      }
      Epoch_Time.forEach((element, index) => {
        const epochTime = element;
        const newRow = createData(
          epochTime,
          parseFloat(CPU_Usage_Percent[index]),
          parseFloat(Memory_Free[index]),
          parseFloat(Disk_Free[index])
        );
        rows.push(newRow);
      });
      return (
        <div className="health-data">
          <Card style={{ maxHeight: "29%" }} className="card-container">
            <CardContent>
              <Typography variant="h5">{this.state.serverName}</Typography>
              <Typography>{this.state.user}</Typography>
              <p
                className="waves-effect btn remove-server"
                onClick={RemoveServer}
              >
                REMOVE SERVER
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }
  }
}

export default ServerDetails;
