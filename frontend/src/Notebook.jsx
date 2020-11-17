/* eslint-disable no-useless-constructor */
import { navigate } from "@reach/router";
import React, {Component} from "react";
import P5Wrapper from "react-p5-wrapper";
import sketch from "./sketch.js";

class NotebookDisplay extends Component{
    constructor(props){
        super(props)
    }
    editTileHandler(){
        const name = prompt("Enter name of tile you want to edit");
        navigate("/editor");
    }
    render(){
        return(
            <div className="notebook-container">
                <h3 className="teal-text text-accent-3">Notebook</h3>
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
export default NotebookDisplay;