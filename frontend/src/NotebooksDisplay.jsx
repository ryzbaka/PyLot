import React,{Component} from "react";
import axios from 'axios'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import {navigate,Link} from '@reach/router'
import MenuBookIcon from '@material-ui/icons/MenuBook';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
/*
-> add buttons for adding and removing notebooks.
*/
class NotebooksDisplay extends Component{
    state = { username : this.props.username,notebooks:[]};
    componentDidMount(){
        axios.post("/getNotebooks",{
            username:this.state.username
        }).then(({data})=>{
            this.setState({notebooks:data.notebooks})
            console.log(this.state)
        });
    }
    render(){
        return (
            <div className="notebooks-container">
                <div className = "notebooks-page-controls">
                <h2>{this.state.username}'s Notebooks</h2>
                        <Button
                         variant="contained"
                        //  color="seagreen"
                         startIcon={<AddIcon/>}
                         onClick={()=>{navigate("/addNotebook")}}
                        >
                            Add Notebook
                        </Button>
                        <Button
                         variant="contained"
                        //  color="seagreen"
                         startIcon={<RemoveIcon/>}
                         onClick={()=>{navigate("/deleteNotebook")}}
                        >
                            Delete Notebook
                        </Button>
                </div>
                <div className="servers-container">
                    <List>
                        {
                            this.state.notebooks.map(({notebookName,createdOn,_id},index)=>{
                                return(
                                    <Link key={index} to={`/notebooks/${this.state.username}/${notebookName}`} style={{ textDecoration: "none", color: "white" }}>
                                    <ListItem button>
                                        <ListItemIcon>
                                            <MenuBookIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary={notebookName} secondary={createdOn}/>
                                    </ListItem>
                                    <Divider/>
                                    </Link>
                                )
                            })
                        }
                    </List>
                </div>
            </div>
        )
    }
}

export default NotebooksDisplay;