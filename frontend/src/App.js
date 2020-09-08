import React from "react";
import Apitest from "./Apitest";
import Sidebar from "./Sidebar";
import { Router } from "@reach/router";
import Home from "./Home";
import About from "./About";
import Signupin from "./Signupin";

const App = () => {
  return (
    <React.StrictMode>
      <div className="main-container">
        <Sidebar
          options={["Home", "About", "Sign Up / Sign In"]}
          links={["/", "/about", "/signupin"]}
        />
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
