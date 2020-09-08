import React from "react";
import Apitest from "./Apitest";
import Sidebar from "./Sidebar";
const App = () => {
  return (
    <div className='main-container'>
      <Sidebar options={['Home','About','Sign Up / Sign In',]}/>
    </div>
  );
};

export default App;
