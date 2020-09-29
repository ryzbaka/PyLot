import React, {useContext} from "react";
import SignInContext from "./SignInContext";
import Something from "./TestResult.jsx"
const Home = () => {
  const [signInState,setsignInState] = useContext(SignInContext); 
  //return <div>{signInState.status}</div>;
  if(signInState[0]==="Signed Out"){
    return (
      <div>
        <h1>PyLot Banner</h1>
      </div>
    )
  }else{
  return <Something status={signInState[0]} username={signInState[1]} password={signInState[2]}></Something>
  }
};
export default Home;
