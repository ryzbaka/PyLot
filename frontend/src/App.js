import React from "react";
import Sidebar from "./Sidebar";
import { Router } from "@reach/router";
import Home from "./Home";
import About from "./About";
import Signupin from "./Signupin";

const App = () => {
  return (
    <React.StrictMode>
      <div className="main-container">
        <div className="side-container">
          <Router>
            <Sidebar
              options={["Home", "About"]}
              links={["/", "/about"]}
              path="/signupin"
            />
            <Sidebar
              options={["Home", "Sign Up / Sign In"]}
              links={["/", "/signupin"]}
              path="/about"
            />
            <Sidebar
              options={["Home", "About", "Sign Up / Sign In"]}
              links={["/", "/about", "/signupin"]}
              path="/*"
            />
          </Router>
        </div>
        <div className="nested-main-container">
          <Router>
            <Home path="/" />
            <About path="/about" />
            <Signupin path="/signupin" />
          </Router>
        </div>
      </div>
    </React.StrictMode>
  );
};

export default App;
