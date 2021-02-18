import React,{Component} from "react";
import axios from "axios";
import {navigate, Link} from "@reach/router";
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import DnsIcon from '@material-ui/icons/Dns';
import CircularProgress from "@material-ui/core/CircularProgress";
import AddIcon from '@material-ui/icons/Add';
import MenuBookIcon from '@material-ui/icons/MenuBook';
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
                <div className="serverDetailsPageMainContainer">
          <CircularProgress/>
        </div>
            )
        }else{
            const {servers} = this.state;
            return (
                <div className="server-page-container">
                    <div className="server-page-controls">
                        <h2>{this.state.username}'s Servers</h2>
                        <Button
                         variant="contained"
                         color="seagreen"
                         startIcon={<AddIcon/>}
                         onClick={()=>{navigate("/addServer")}}
                        >
                            Add Server
                        </Button>
                        <Button
                         variant="contained"
                         color="seagreen"
                         startIcon={<MenuBookIcon/>}
                         onClick={()=>{navigate(`/notebooks/${this.state.username}`)}}
                        >
                            Notebooks
                        </Button>
                    </div>
                    <div className="servers-container">
                        <List>
                        {servers.map(({serverName,ipAddr,sshKey,user,password},index)=>{
                            return (
                            <Link key={index} to={`/serverDetails/${this.state.username}/${serverName}/${ipAddr}/${user}/${password}`} style={{ textDecoration: "none", color: "white" }}>
                            <ListItem button>
                                <ListItemIcon>
                                    <DnsIcon/>
                                </ListItemIcon>
                                <ListItemText primary={serverName} secondary={`${user} | ${ipAddr}`}/>
                            </ListItem>
                            <Divider/>
                            </Link>
                            )
                        })}
                        </List>
                    </div>
                </div>
            )
        }
    }
}
export default Profile;