import React,{useContext,useState} from "react";
import axios from "axios";
import {navigate} from "@reach/router"
import SignInContext from "./SignInContext";
/*

    "username":"hamza.ryzvy",
    "serverName":"digitalOceanFlaskServer-2",
    "ipAddr":"167.71.237.73",
    "sshKey":false,
    "user":"hamza",
    "password":"Zainab151214124"
*/
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
            if(response.data==="Added server."){
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
                <label htmlFor="serverName">
                Server Name
                <input 
                    id="serverName"
                    onChange={(event)=>setServerName(event.target.value)}
                />
                </label>
                <label htmlFor="ipAddress">
                IP Address
                <input 
                    id="ipAddress"
                    onChange={(event)=>setIpAddr(event.target.value)}
                />
                </label>
                <label htmlFor="serverUser">
                User account on server
                <input 
                    id="serverUser"
                    onChange={(event)=>setServerUser(event.target.value)}
                />
                </label>
                <label htmlFor="serverPassword">
                Password for server user account
                <input 
                    id="serverPassword"
                    onChange={(event)=>setServerPassword(event.target.value)}
                />
                </label>
                <button>Submit</button>
            </form>
        </div>
    )
}
export default AddServer;