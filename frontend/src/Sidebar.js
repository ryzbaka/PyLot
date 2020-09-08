import React from "react";
import { Link } from "@reach/router";

const Sidebar = ({ options, links }) => {
  return (
    <div className="side-container-content">
      {options.map((item, index) => (
        <Link
          to={links[index]}
          style={{ textDecoration: "none", color: "white" }}
        >
          <p>{item}</p>
        </Link>
      ))}
    </div>
  );
};
export default Sidebar;
