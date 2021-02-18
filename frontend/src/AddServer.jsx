import React,{useContext,useState} from "react";
import axios from "axios";
import {navigate} from "@reach/router"
import SignInContext from "./SignInContext";

const AddServer=()=>{
    const [context,setSignInstate]=useContext(SignInContext);
    const [serverName,setServerName]=useState("");
    const [ipAddr,setIpAddr]=useState("");
    const [sshKey,setSSH]=useState(false);
    const [serverPassword,setServerPassword]=useState("")
    const [serverUser,setServerUser]=useState("")
    function verifyAndSendDetails(){
        const ssh=false;
        const formData={
            username:context[1],
            serverName:serverName,
            ipAddr:ipAddr,
            sshKey:ssh,
            user:serverUser,
            password:serverPassword
        }
        axios.post("/users/addserver",formData).then((response)=>{
            if(response.data==="Added server." || response.data==="Added user's first server!"){
                navigate('/')
            }else{
                alert("An error ocurred");
            }
        })
    }
    return (
        <div className="form-container">
            <form
             onSubmit={(e)=>{
                 e.preventDefault();
                 verifyAndSendDetails()
             }}
            >
                <label htmlFor="serverName" className="teal-text text-accent-3">
                Server Name
                <input 
                    id="serverName"
                    onChange={(event)=>setServerName(event.target.value)}
                    className="teal-text text-accent-3"
                />
                </label>
                <label htmlFor="ipAddress" className="teal-text text-accent-3">
                IP Address
                <input 
                    id="ipAddress"
                    onChange={(event)=>setIpAddr(event.target.value)}
                    className="teal-text text-accent-3"
                />
                </label>
                <label htmlFor="serverUser" className="teal-text text-accent-3">
                User account on server
                <input 
                    id="serverUser"
                    onChange={(event)=>setServerUser(event.target.value)}
                    className="teal-text text-accent-3"
                />
                </label>
                <label htmlFor="serverPassword" className="teal-text text-accent-3">
                Password for server user account
                <input 
                    id="serverPassword"
                    onChange={(event)=>setServerPassword(event.target.value)}
                    className="teal-text text-accent-3"
                />
                </label>
                <button className="teal accent-3"><span className="white-text">submit</span></button>
            </form>
        </div>
    )
}
export default AddServer;