import React, { useContext } from "react";
import SignInContext from "./SignInContext";
import Profile from "./Profile.jsx";
const Home = () => {
  const [signInState, setsignInState] = useContext(SignInContext);
  //return <div>{signInState.status}</div>;
  if (signInState[0] === "Signed Out") {
    return (
      <div className="banner-container">
        <img
          src="https://i.ibb.co/27hZ9sY/image.png"
          alt="banner"
          border="0"
        ></img>
        <p className="flow-text">A web based IDE for writing and scheduling ETL pipelines in Python</p>
      </div>
    );
  } else {
    return (
      <Profile
        status={signInState[0]}
        username={signInState[1]}
        password={signInState[2]}
      ></Profile>
    );
  }
};
export default Home;
