import React, { useState, useContext } from "react";
import { Link, navigate } from "@reach/router";
import axios from "axios";
import SignInContext from "./SignInContext";
const Signupin = () => {
  const [username, setUsername] = useState("username");
  const [password, setPassword] = useState("*******");
  const [signInState, setSignInState] = useContext(SignInContext);
  function verifyDetails() {
    if (username === "" || password === "") {
      alert("Form missing information.");
    } else {
      const formData = {
        username: username,
        password: password,
      };
      axios.post("/users/signin", formData).then((response) => {
        if (response.data === "Authentication Successful") {
          setSignInState(["Signed In", username, password]);
          navigate("/");
        } else {
          alert("Authentication failed.");
        }
      });
    }
  }
  return (
    <div className="form-page-container">
      <div className="form-container">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            verifyDetails();
          }}
        >
          <label htmlFor="username" className="teal-text text-accent-3">
            Username
            <input
              id="username"
              onChange={(event) => setUsername(event.target.value)}
              className="teal-text text-accent-3"
            />
          </label>
          <label htmlFor="password" className="teal-text text-accent-3">
            Password
            <input
              id="password"
              type="password"
              onChange={(event) => setPassword(event.target.value)}
              className="teal-text text-accent-3"
            />
          </label>
          <button className="teal white-text accent-3">submit</button>
          <Link
            to="/signup"
            style={{ textDecoration: "none", color: "#4c5357" }}
          >
           <span className="teal-text text-accent-3">Sign Up</span>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Signupin;
