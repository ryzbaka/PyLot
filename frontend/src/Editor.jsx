import React, {Component} from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-vibrant_ink";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/keybinding-vscode"
class Editor extends Component{
    changer(value){
        console.log(`change : ${value}`)
    }
    render(){
        return(
            <div class="editor-space">
                <h5>Code Editor</h5>
                <AceEditor
                    keyboardHandler="vscode"
                    name="editordiv"
                    mode="python"
                    theme="vibrant_ink"
                    defaultValue="#This is the PyLot code editor."
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
        )
    }
}
export default Editor;