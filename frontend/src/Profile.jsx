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