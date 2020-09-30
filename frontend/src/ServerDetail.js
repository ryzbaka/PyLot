import React, { Component, setState } from "react";

class ServerDetails extends Component {
  state = { loading: true };
  componentDidMount() {
    //write code here to fetch data
    this.setState({ loading: false });
  }
  render() {
    if (this.state.loading) {
      return <h1>Loading</h1>;
    } else {
      return (
        <div>
          <h1>Username: {this.props.username}</h1>
          <h2>Servername: {this.props.serverName}</h2>
        </div>
      );
    }
  }
}

export default ServerDetails;
