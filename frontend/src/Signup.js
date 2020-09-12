import React, { useState } from "react";
import axios from "axios";
const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  function verifyDetails() {
    if (password !== password2) {
      alert("Passwords do not match.");
    } else {
      const signUpForm = document.getElementById("sign-up-form");
      const formElements = signUpForm.elements;
      for (let i = 0; i < formElements.length - 1; i++) {
        if (formElements[i].value === "") {
          alert("Form incomplete!");
          return 0;
        }
      }
      const formData = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: password,
        email: email,
        servers: [],
      };
      console.log("sending post request");
      axios
        .post("/users/signup", formData)
        .then((response) => alert(response.data));
    }
  }
  return (
    <div className="form-container">
      <form
        id="sign-up-form"
        onSubmit={(e) => {
          e.preventDefault();
          verifyDetails();
        }}
      >
        <label htmlFor="first-name">
          <input
            id="first-name"
            value={firstName}
            placeholder="First Name"
            onChange={(event) => setFirstName(event.target.value)}
          />
        </label>
        <label htmlFor="last-name">
          <input
            id="last-name"
            value={lastName}
            placeholder="Last Name"
            onChange={(event) => setLastName(event.target.value)}
          />
        </label>
        <label htmlFor="username">
          <input
            id="username"
            value={username}
            placeholder="username"
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>
        <label htmlFor="email">
          <input
            id="email"
            value={email}
            placeholder="email"
            onChange={(event) => setEmail(event.target.value)}
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
        <label htmlFor="password2">
          <input
            id="password2"
            placeholder="retype password"
            type="password"
            value={password2}
            onChange={(event) => setPassword2(event.target.value)}
          />
        </label>
        <button>submit</button>
      </form>
    </div>
  );
};
export default Signup;
