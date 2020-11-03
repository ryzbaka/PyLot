import React, { useContext } from "react";
import SignInContext from "./SignInContext";
import Profile from "./Profile.jsx";
const Home = () => {
  const [signInState, setsignInState] = useContext(SignInContext);
  //return <div>{signInState.status}</div>;
  if (signInState[0] === "Signed Out") {
    return (
      <div className="server-page-container">
        <img
          src="https://i.ibb.co/27hZ9sY/image.png"
          alt="image"
          border="0"
        ></img>
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
