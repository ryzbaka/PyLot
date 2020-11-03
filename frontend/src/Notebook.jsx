/* eslint-disable no-useless-constructor */
import React, {Component} from "react";
import P5Wrapper from "react-p5-wrapper";
import sketch from "./sketch.js";

class NotebookDisplay extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div className="notebook-container">
                <h3 className="teal-text text-accent-3">Notebook</h3>
                <button id="add-tile-button">Add tile</button>
                <button id="remove-tile-button">Remove tile</button>
                <button id="set-output-button">Set Output</button>
                <button id="save-notebook">Save Notebook</button>
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