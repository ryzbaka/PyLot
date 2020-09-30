import React, { useState, useContext } from "react";
import { Link } from "@reach/router";
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
          <label htmlFor="username">
            <input
              id="username"
              value={username}
              placeholder="username"
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>
          <label htmlFor="password">
            <input
              id="password"
              placeholder="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <button>submit</button>
          <Link
            to="/signup"
            style={{ textDecoration: "none", color: "#4c5357" }}
          >
            Sign Up
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Signupin;
