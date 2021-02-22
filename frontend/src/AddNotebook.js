import React, { useContext, useState } from "react";
import axios from "axios";
import { navigate } from "@reach/router";
import SignInContext from "./SignInContext";

const AddNotebook = () => {
  const [context, setSignInstate] = useContext(SignInContext);
  const [notebookName, setNotebookName] = useState("");
  function verifyAndSendDetails() {
    const ssh = false;
    const formData = {
      username: context[1],
      name: notebookName,
    };
    if (formData.username === "None") {
      navigate("/");
    }
    if (formData.username === "") {
      alert("please enter a name.");
    }
    axios.post("/addNotebook", formData); //.then(({data:{message}})=>alert(message));
    navigate(`/notebooks/${context[1]}`);
  }
  return (
    <div className="form-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          verifyAndSendDetails();
        }}
      >
        <label htmlFor="notebookName" className="teal-text text-accent-3">
          Notebook Name
          <input
            id="notebookName"
            onChange={(event) => setNotebookName(event.target.value)}
            className="teal-text text-accent-3"
          />
        </label>
        <button className="teal accent-3">
          <span className="white-text">submit</span>
        </button>
      </form>
    </div>
  );
};
export default AddNotebook;
