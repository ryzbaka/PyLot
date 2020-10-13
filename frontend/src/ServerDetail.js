import React, { Component, setState } from "react";
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
        console.log(JSON.stringify(data));
        this.setState({
          health: data,
          loading: false,
        });
      });

    //this.setState({ loading: false });
  }
  render() {
    if (this.state.loading) {
      return <h1>Loading</h1>;
    } else {
      return (
        <div>
          <h1>Username: {this.state.username}</h1>
          <h2>Server Name: {this.state.serverName}</h2>
          <h3>Server Username: {this.state.user}</h3>
          <h4>Server Password:{this.state.password}</h4>
        </div>
      );
    }
  }
}

export default ServerDetails;
