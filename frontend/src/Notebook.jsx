/* eslint-disable no-useless-constructor */
import { navigate } from "@reach/router";
import React, {Component} from "react";
import P5Wrapper from "react-p5-wrapper";
import sketch from "./sketch.js";

class Notebook extends Component{
    state = {
        username:this.props.username,
        notebookName:this.props.notebookName
    }
    editTileHandler(){
        alert("Under development.")
        //this handler has to relocate to a text editor where user can edit code
        //inside a tile.
    }
    render(){
        const username = this.state.username;
        const notebookName = this.state.notebookName;
        return(
            <div className="notebook-container">
                <h3 className="teal-text text-accent-3">{username}'s Notebook [{notebookName}]</h3>
                <div id="notebook-buttons-container">
                <button id="add-tile-button">Add tile</button>
                <button id="remove-tile-button">Remove tile</button>
                <button id="bind-button">Bind Tiles</button>
                <button id="save-notebook">Save Notebook</button>
                <button id="edit-tile-code" onClick={this.editTileHandler}>Edit Tile Code</button>
                </div>
                <P5Wrapper sketch={sketch} ></P5Wrapper>
                <div className="tile-info">
                    <p id="tile-name"></p>
                    <p></p>
                </div>
            </div>
        )
    }
}
export default Notebook;