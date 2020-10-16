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

class ServerDetails extends Component {
  state = {
    password: this.props.serverPassword,
    user: this.props.serverUser,
    username: this.props.username,
    serverName: this.props.serverName,
    columnNames: [],
    loading: true,
  };
  componentDidMount() {
    //write code here to fetch data

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
      const { serverName, username } = this.state;
      function randomlmao() {
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
              <Typography>{this.state.user}</Typography>
              <Typography>
                Health reporting service is offline on remote server
              </Typography>
              <p
                className="waves-effect btn remove-server"
                onClick={randomlmao}
              >
                REMOVE SERVER
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
          <Card style={{ maxHeight: "29%" }}>
            <CardContent>
              <Typography variant="h5">{this.state.serverName}</Typography>
              <Typography>{this.state.user}</Typography>
              <p
                className="waves-effect btn remove-server"
                onClick={randomlmao}
              >
                REMOVE SERVER
              </p>
            </CardContent>
          </Card>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Epoch Time</TableCell>
                  <TableCell align="right">CPU Usage (%)</TableCell>
                  <TableCell align="right">Memory Free (bytes)</TableCell>
                  <TableCell align="right">DiskFree (bytes)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {row.col1}
                    </TableCell>
                    <TableCell align="right">{row.col2}</TableCell>
                    <TableCell align="right">{row.col3}</TableCell>
                    <TableCell align="right">{row.col4}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      );
    }
  }
}

export default ServerDetails;
