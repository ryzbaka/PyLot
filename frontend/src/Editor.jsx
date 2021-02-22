import React, {Component} from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-vibrant_ink";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/keybinding-vscode"
import axios from "axios";
import {navigate} from "@reach/router"
let codeText;
class Editor extends Component{
    state = {
        username : this.props.username,
        notebookName : this.props.notebookName,
        tileName : this.props.name,
        code:"#Welcome to PyLot code editor.",
        loadedData:false
    }
    changer(value){
        // console.log(`change : ${value}`);
        codeText = value;
    }
    saveCode(){
        axios.post("/editTile",{
            notebook:window.location.href.split("/")[window.location.href.split("/").length-2],
            tile:window.location.href.split("/")[window.location.href.split("/").length-1],
            user:window.location.href.split("/")[window.location.href.split("/").length-3],
            code:codeText
        }).then(({data:{message}})=>{
            alert(message);
        });    
    }
    componentDidMount(){
        axios.post("/getTile",{
            notebook:window.location.href.split("/")[window.location.href.split("/").length-2],
            tile:window.location.href.split("/")[window.location.href.split("/").length-1],
            user:window.location.href.split("/")[window.location.href.split("/").length-3]
        }).then(({data:{message}})=>{
            this.setState({code:message,loadedData:true})
        });    
    }
    backToNotebook(){
        navigate(`/notebooks/${window.location.href.split("/")[window.location.href.split("/").length-3]}/${window.location.href.split("/")[window.location.href.split("/").length-2]}`)
    }
    render(){
        if(!this.state.loadedData){
            return <h5>Loading...</h5>
        }else{
        return(
            <div className="editor-space">
                <h5>Code Editor</h5>
                <button onClick = {this.saveCode} id="save-notebook">Save Notebook</button>
                <button onClick = {this.backToNotebook} id="save-notebook">Back</button>
                <AceEditor
                    keyboardHandler="vscode"
                    name="editordiv"
                    mode="python"
                    theme="vibrant_ink"
                    defaultValue={this.state.code}
                    onChange={this.changer}
                    height="100%"
                    width="100%"
                    setOptions={{
                        enableBasicAutocompletion:true,
                        enableLiveAutocompletion:true,
                    }}
                    editorProps={{$blockScrolling:true}}
                />
            </div>
        )}
    }
}
export default Editor;