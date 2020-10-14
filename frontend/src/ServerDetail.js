import React, { Component, setState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import axios from "axios";

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
          <CircularProgress/>
        </div>
      );
    } else {
      const healthData = this.state.health;
      console.log(healthData)
      const {Epoch_Time,CPU_Usage_Percent, Memory_Free, Disk_Free} = healthData;
      if(Epoch_Time==undefined){
        return <h1>Health Reporting server offline</h1>//temp fix
      }
      const headCells=[
        {id:"time",numeric:true,disablePadding:true,label:"Epoch Time"},
        {id:"cpupercent",numeric:true,disablePadding:true,label:"CPU Usage (%)"},
        {id:"memfree",numeric:true,disablePadding:true,label:"Memory Free (bytes)"},
        {id:"diskfree",numeric:true,disablePadding:true,label:"Disk Free (bytes)"},
      ]
      const rows = [];
      function createData(col1,col2,col3,col4){
        return {col1,col2,col3,col4}
      }
      Epoch_Time.forEach((element,index) => {
        const newRow = createData(element,parseFloat(CPU_Usage_Percent[index]),parseFloat(Memory_Free[index]),parseFloat(Disk_Free[index]));
        rows.push(newRow);
      });
      console.log(rows)
      return (
        <div className="health-data">

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
                {
                  rows.map((row,index)=>(
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {row.col1}
                      </TableCell>
                      <TableCell align="right">{row.col2}</TableCell>
                      <TableCell align="right">{row.col3}</TableCell>
                      <TableCell align="right">{row.col4}</TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>
          </div>
      );
    }
  }
}

export default ServerDetails;
