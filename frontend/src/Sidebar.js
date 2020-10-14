import React, { useContext } from "react";
import { Link } from "@reach/router";
import SignInContext from "./SignInContext";

const Sidebar = ({ options, links, home }) => {
  const [signInState, setSignInState] = useContext(SignInContext);
  if (signInState[0] !== "Signed Out" && home) {
    return (
      <div className="side-container-content">
        <Link to="/logout" style={{ textDecoration: "none", color: "white" }}>
          <p>Logout</p>
        </Link>
      </div>
    );
  }
  return (
    <div className="side-container-content">
      {options.map((item, index) => (
        <Link
          key={index}
          to={links[index]}
          style={{ textDecoration: "none", color: "white" }}
        >
          <p key={index}>{item}</p>
        </Link>
      ))}
    </div>
  );
};
export default Sidebar;
