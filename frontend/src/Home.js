import React, {useContext} from "react";
import SignInContext from "./SignInContext";

const Home = () => {
  const [signInState,setsignInState] = useContext(SignInContext); 
  return <div>{signInState}</div>;
};
export default Home;
