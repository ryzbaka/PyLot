import React, { useState } from "react";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  function verifyDetails() {
    if (password !== password2) {
      alert("Passwords do not match.");
    }
  }
  return (
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
