import React, {Component,useState,useContext,useEffect} from "react";
import SignInContext from "./SignInContext";
import axios from "axios";
import {redirectTo, Link} from "@reach/router";

class Profile extends Component{
    state = {username:this.props.username,password:this.props.password,servers:[],loading:true};
    componentDidMount(){
        axios.post("/users/getservers",{
            username:this.state.username,
            password:this.state.password
        }).then(({data})=>{
            this.setState({servers:data,loading:false})
        })
    }
    render(){
        if(this.state.loading){
            return (
                <h1>Loading</h1>
            )
        }else{
            const {servers} = this.state;
            return(
                <div className="server-page-container">
                    <h2>{this.state.username}'s Servers</h2>
                    <div className="servers-container">
                        {servers.map(({serverName,ipAddr,sshKey},index)=>{
                            return (<div className="server-container">
                                <p>{serverName}</p>
                                <p>{ipAddr}</p>
                                <p>{sshKey?"SSH enabled":"Password access"}</p>
                                <Link to={`/serverDetails/${this.state.username}/${serverName}`}>Details</Link>
                            </div>)
                        })}
                    </div>
                </div>
            )
        }
    }
}
export default Profile;
/*
const Profile =  ({status,username,password})=>{
    //const servers = ["server1","server2","server3","server4","server5","server6","server6","server6","server6","server6","server6","server6","server6","server6","server6","server6","server6","server6"];
    function addServer(){
        alert("Add functionality to redirect page to /addserver route where there will be a form to accept information about new server.")
    }
    const postObject ={
        username:username,
        password:password
    }
    //const server =  axios.post("/users/getservers",postObject);
    const [servers,setServers] = useState([])
    async function requestServers(){
        const fetchedServers = await axios.post("/users/getservers");
        setServers(fetchedServers);
    }
    return (
        <div className="server-page-container">
            <h1>{username}'s Servers</h1>
            <div className="servers-container">
                <button className = "add-server" onClick={addServer}> Add server</button>                
                {servers.map((server)=>(
                <div className="server-container">
                    {server}
                </div>
                ))}
            </div>
        </div>
    )
}
export default Profile;
*/