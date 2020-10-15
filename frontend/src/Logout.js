import React, { useContext } from "react";
import { navigate } from "@reach/router";
import SignInContext from "./SignInContext";

const Logout = () => {
  const [signInState, setSignInState] = useContext(SignInContext);
  if (signInState[0] === "Signed In") {
    setSignInState(["Signed Out", "None", "None"]);
    navigate("/")
    return <h1>Signing out</h1>
  } else {
    return <h1>Signed Out</h1>;
  }
};

export default Logout;
