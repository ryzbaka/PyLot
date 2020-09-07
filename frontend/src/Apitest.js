import React, { Component } from "react";
import axios from "axios";

class Apitest extends Component {
  constructor() {
    super();
    this.state = {
      message: "No message",
    };
  }
  componentDidMount = () => {
    axios.get("/endpoint").then((res) => {
      //console.log(res.data)
      this.setState({
        message: res.data.message,
      });
    });
  };
  render() {
    return (
      <div>
        <h2>Message from node server : {this.state.message}</h2>
      </div>
    );
  }
}
export default Apitest;
