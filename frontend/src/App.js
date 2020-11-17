import React, { useState, useContext } from "react";
import Sidebar from "./Sidebar";
import { Router } from "@reach/router";
import Home from "./Home";
import About from "./About";
import Signupin from "./Signupin";
import Signup from "./Signup";
import SignInContext from "./SignInContext";
import ServerDetails from "./ServerDetail.js";
import Logout from "./Logout.js";
import AddServer from "./AddServer";
import SocketApi from "./Api.jsx";
import NotebookDisplay from "./Notebook.jsx";
import Terminal from "./Terminal.jsx";
import Editor from "./Editor";

const App = () => {
  const signedStateHook = useState(["Signed Out", "None", "None"]); //maybe add a dictionary similar to the one in SignInContext.js
  const [signInState, setSignInState] = useContext(SignInContext);
  return (
    <React.StrictMode>
      <SignInContext.Provider value={signedStateHook}>
        <div className="main-container">
          <div className="side-container">
            <Router>
              <Sidebar
                options={["Home", "Sign In"]}
                links={["/", "/signupin"]}
                path="/signup"
              />
              <Sidebar options={["Home"]} links={["/"]} path="/signupin" />
              <Sidebar
                options={["Sign Up / Sign In"]}
                links={["/signupin"]}
                home={true}
                path="/"
              />
              <Sidebar
                options={["Home"]}
                links={["/"]}
                path="/serverDetails/*"
              />
              <Sidebar options={["Home"]} links={["/"]} path="/addServer" />
              <Sidebar options={["Home"]} links={["/"]} path="/notebook" />
              <Sidebar options={["Home"]} links={["/"]} path="/terminal/*" />
            </Router>
          </div>
          <div className="nested-main-container">
            <Router>
              <Home path="/" />
              <About path="/about" />
              <Signupin path="/signupin" />
              <Signup path="/signup" />
              <ServerDetails path="/serverDetails/:username/:serverName/:ipAddr/:serverUser/:serverPassword" />
              <Logout path="/logout" />
              <AddServer path="/addServer" />
              <SocketApi path="/testSocket" />
              <NotebookDisplay path="/notebook" />
              <Terminal path="/terminal/:username/:serverName" />
              <Editor path="/editor" />
            </Router>
          </div>
        </div>
      </SignInContext.Provider>
    </React.StrictMode>
  );
};

export default App;
