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
            <div>
                <h3>Notebook</h3>
                <input id="tileName"/>
                <button id="add-tile-button">Add tile</button>
                <button id="remove-tile-button">Remove tile</button>
                <P5Wrapper sketch={sketch} ></P5Wrapper>
            </div>
        )
    }
}
export default NotebookDisplay;