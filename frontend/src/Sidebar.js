import React from "react";
import { Link } from "@reach/router";

const Sidebar = ({ options, links }) => {
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
