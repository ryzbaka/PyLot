import axios from "axios";
import { navigate } from "@reach/router";
import openConnection from "socket.io-client";

const sketch = (p) => {
  let current = "None";
  const addTileButton = document.querySelector("#add-tile-button");
  const removeTileButton = document.querySelector("#remove-tile-button");
  const bindButton = document.querySelector("#bind-button");
  const saveNotebookButton = document.querySelector("#save-notebook");
  const editTileButton = document.querySelector("#edit-tile-code");
  const runTileButton = document.querySelector("#run-tile-code");
  const viewTileOutputButton = document.querySelector("#view-tile-output");
  const scheduleDAGButton = document.querySelector("#schedule-dag-button");
  const cancelDAGButton = document.querySelector("#cancel-job-button");
  let noteBook;
  let canvasWidth = p.windowWidth / 1.15;
  let canvasHeight = p.windowHeight / 1.35;
  
  let socket="No socket";
  axios.post("/getIp",{
    username:"testpilot",
    serverName:"Local Test Server"
  }).then(({data})=>{
    const ip = data;
    socket = openConnection(`http://${ip}:5000/`);
    socket.on("connect",()=>console.log("sketch socket connected to runtime"));
    socket.on("disconnect",()=>console.log("sketch socket disconnected from runtime"));
    socket.on("scheduled-dag",({message})=>{
      alert(message)
    })
    socket.on("cancelled-job",({message})=>alert(message))
    socket.on("ran-tile",(response)=>{
      if(Object.keys(response).includes("error")){
        alert(response.error)
      }else{
        console.log(response);
        alert(`Executed tile code successfully.`)
      }
    });
  })
  
  const notebookName = window.location.href.split("/")[
    window.location.href.split("/").length - 1
  ];
  const username = window.location.href.split("/")[
    window.location.href.split("/").length - 2
  ];

  class Tile {
    constructor(name, canvasWidth, canvasHeight) {
      this.information = {
        name: name,
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        xPos: canvasWidth / 2,
        yPos: canvasHeight / 2,
        tileWidth: canvasWidth / 10,
        tileHeight: canvasHeight / 10,
        // outputs: [],
        // inputs: [],
        outputTileNames: [],
        inputTileNames: [],
        code: "",
      };
    }

    addOutput(someTile) {
      // this.information.outputs.push(someTile);
      this.information.outputTileNames.push(someTile.information.name);
    }
    addInput(someTile) {
      // this.information.inputs.push(someTile);
      this.information.inputTileNames.push(someTile.information.name);
    }
    show() {
      if (
        p.mouseIsPressed &&
        (current === "None" || current === this.information.name)
      ) {
        const { tileWidth, tileHeight, xPos, yPos } = this.information;
        const leftWall = xPos - tileWidth / 2;
        const rightWall = xPos + tileWidth / 2;
        const bottomWall = yPos + tileHeight / 2;
        const topWall = yPos - tileHeight / 2;
        if (
          p.mouseX > leftWall &&
          p.mouseX < rightWall &&
          p.mouseY < bottomWall &&
          p.mouseY > topWall
        ) {
          current = this.information.name;
          this.information.xPos = p.mouseX;
          this.information.yPos = p.mouseY;
          p.strokeWeight(5);
          p.stroke("green");
        }
      }
      const {
        name,
        xPos,
        yPos,
        canvasWidth,
        canvasHeight,
        tileWidth,
        tileHeight,
        outputTileNames,
      } = this.information;
      p.rectMode(p.CENTER);
      p.fill("#42f5bf"); //teal fill for tile
      p.rect(xPos, yPos, tileWidth, tileHeight);
      p.stroke("black");
      p.strokeWeight(1);
      p.text(name, xPos - 20, yPos);
      p.point(xPos, yPos);
      const { outputs } = this.information;
      p.stroke("white");

      if (outputTileNames.length > 0) {
        // console.log(noteBook);
        outputTileNames.forEach((outputTileName, index) => {
          let outputTile;
          for (let i = 0; i < noteBook.tiles.length; i++) {
            if (noteBook.tiles[i].information.name === outputTileName) {
              outputTile = noteBook.tiles[i];
            }
          }
          p.line(
            xPos + tileWidth / 2,
            yPos,
            outputTile.information.xPos - tileWidth / 2,
            outputTile.information.yPos
          );
        });
      }
    }
  }

  class Notebook {
    constructor() {
      this.name = "Untitled-Notebook";
      this.tiles = [];
      this.tileNames = [];
      // localStorage.setItem("test","sketch set this value")
    }
    viewTileCode(name){
      if (!name) {
        alert("Please enter a tile name.");
      } else if (this.tileNames.includes(name)) {
        saveNotebookButton.click();//save notebook before editing tile code.
        navigate(`/view/${username}/${notebookName}/${name}`);
      } else {
        alert("Tile with that name does not exists.");
      }
    }
    editTileCode(name) {
      if (!name) {
        alert("Please enter a tile name.");
      } else if (this.tileNames.includes(name)) {
        saveNotebookButton.click();//save notebook before editing tile code.
        navigate(`/editor/${username}/${notebookName}/${name}`);
      } else {
        alert("Tile with that name does not exists.");
      }
    }

    addTile(name, canvasWidth, canvasHeight) {
      // console.log(name);
      if (!name) {
        alert("No name added to tile.");
      } else if (this.tileNames.includes(name)) {
        alert("Tile already exists, cannot create tile.");
      } else {
        const newTile = new Tile(name, canvasWidth, canvasHeight);
        this.tiles.push(newTile);
        this.tileNames.push(name);
        saveNotebookButton.click();
      }
    }

    display() {
      this.tiles.forEach((element, index) => {
        element.show();
      });
    }

    bind(nodeName, outputTileName) {
      const nodeIndex = this.tileNames.indexOf(nodeName);
      const outputTileIndex = this.tileNames.indexOf(outputTileName);
      if (nodeIndex === -1 || outputTileIndex === -1) {
        alert("Invalid tile names");
      } else {
        const nodeTile = this.tiles[nodeIndex];
        const outputTile = this.tiles[outputTileIndex];
        let alreadyOutput = false;
        for (let i = 0; i < nodeTile.information.outputTileNames.length; i++) {
          if (nodeTile.information.outputTileNames[i] === outputTileName) {
            alreadyOutput = true;
          }
        }
        console.log(alreadyOutput);
        if (alreadyOutput) {
          alert("Tiles already bound.");
          console.log(nodeTile.information.outputTileNames);
        } else {
          nodeTile.addOutput(outputTile);
          outputTile.addInput(nodeTile);
        }
      }
    }

    removeTile(tileName) {
      const tileIndex = this.tileNames.indexOf(tileName);
      this.tileNames.splice(tileIndex, 1);
      this.tiles.splice(tileIndex, 1);
      this.tiles.forEach((tile, index) => {
        tile.information.outputTileNames = tile.information.outputTileNames.filter(
          // (el) => el.information.name !== tileName
          (el) => el !== tileName
        );
        tile.information.inputTileNames = tile.information.inputTileNames.filter(
          // (el) => el.information.name !== tileName
          (el) => el !== tileName
        );
      });
      saveNotebookButton.click();
    }
  }
  cancelDAGButton.addEventListener("click",()=>{
    // alert("Cancel DAG button not implemented.")
    const nbName = window.location.href.split("/")[window.location.href.split("/").length-1];
    socket.emit("cancel-job",{notebookName:nbName});
  });
  scheduleDAGButton.addEventListener("click",()=>{
    const nbName = window.location.href.split("/")[window.location.href.split("/").length-1];
    const minutes = parseInt(prompt("Minutes(?)"));
    if(minutes===NaN){
      alert("Invalid input for minutes")
    }else{
      socket.emit("schedule-dag",{notebookName:nbName,minutes:minutes});
    }
  });
  viewTileOutputButton.addEventListener("click",()=>{
    const name = prompt("Enter name of tile you wish to view:");
    noteBook.viewTileCode(name)
  })
  editTileButton.addEventListener("click", () => {
    const name = prompt("Enter name of new tile:");
    noteBook.editTileCode(name);
  });
  addTileButton.addEventListener("click", () => {
    const name = prompt("Enter name of new tile:");
    noteBook.addTile(name, canvasWidth, canvasHeight);
  });
  removeTileButton.addEventListener("click", () => {
    const name = prompt("Enter name of the tile you wish to remove:");
    noteBook.removeTile(name, canvasWidth, canvasHeight);
  });
  bindButton.addEventListener("click", () => {
    const tile1 = prompt("Enter name of input tile:");
    const tile2 = prompt("Enter name of output tile:");
    if (
      !noteBook.tileNames.includes(tile1) ||
      !noteBook.tileNames.includes(tile2)
    ) {
      alert("One of the two tile names entered does not exist.");
    } else {
      noteBook.bind(tile1, tile2);
      saveNotebookButton.click();
    }
  });
  saveNotebookButton.addEventListener("click", () => {
    // console.log(socket) write code here to send notebook object to the runtime.js file 
    // socket.emit("test-sketch-socket",{message:"hello from sketch"})
    while (noteBook.name === "Untitled-Notebook" || noteBook.name == null) {
      const newName = window.location.href.split("/")[
        window.location.href.split("/").length - 1
      ];
      noteBook.name = newName;
    }
    const username = window.location.href.split("/")[
      window.location.href.split("/").length - 2
    ];
    axios
      .post("/users/test", { notebook: noteBook, user: username })
      .then(({ data: { message } }) => console.log(message));
    //This function is where all the communication with server takes place.
    // console.log(noteBook);
    socket.emit("test-sketch-socket",{ notebook: noteBook, user: username })
  });
  runTileButton.addEventListener("click",()=>{
    const tileName = prompt("Please enter tile name: ");
    if(!noteBook.tileNames.includes(tileName)){
      alert(`${tileName} not found in notebook: ${noteBook.name}`);
    }else{
      socket.emit("run-tile",{notebookName:noteBook.name,tileName:tileName})
    }
    //maybe add savebutton.click to save before running
  })
  let loadNotebook;
  p.preload = () => {
    axios
      .post("/loadNotebook", { notebook: notebookName, user: username })
      .then(({ data: { message, data } }) => {
        if (
          message === "Database connection error." ||
          message === "Username not found." ||
          message === "Notebook not found."
        ) {
          alert(message);
          loadNotebook = false;
        } else {
          // console.log("data");
          // console.log(data);
          const notebookName = data.name;
          const notebookTileNames = data.tileNames;
          const notebookTiles = [];
          if (notebookTileNames.length === 0) {
            console.log("Empty notebook, no data to load.");
            loadNotebook = false;
          } else {
            //POPULATING A NOTEBOOK OBJECT.
            // console.log(data.tiles);
            for (let i = 0; i < data.tiles.length; i++) {
              // console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
              // console.log(data.tiles[i].information);
              const tileInfo = data.tiles[i].information;
              const newTile = new Tile(
                tileInfo.name,
                tileInfo.canvasWidth,
                tileInfo.canvasHeight
              );
              newTile.information.code = tileInfo.code;
              newTile.information.inputTileNames = tileInfo.inputTileNames;
              newTile.information.outputTileNames = tileInfo.outputTileNames;
              newTile.information.tileHeight = tileInfo.tileHeight;
              newTile.information.tileWidth = tileInfo.tileWidth;
              newTile.information.xPos = tileInfo.xPos;
              newTile.information.yPos = tileInfo.yPos;
              // console.log(newTile);
              // console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
              notebookTiles.push(newTile);
            }
            // console.log(notebookTiles);
            noteBook = new Notebook();
            noteBook.name = notebookName;
            noteBook.tileNames = notebookTileNames;
            noteBook.tiles = notebookTiles;
            loadNotebook = true;
          }
        }
      });
  };
  p.setup = () => {
    p.createCanvas(canvasWidth, canvasHeight);
    p.background("grey");
    if (!loadNotebook) {
      noteBook = new Notebook();
    }
  };
  p.mouseReleased = () => {
    current = "None";
  };
  p.draw = () => {
    p.background(220);
    noteBook.display();
  };
};
export default sketch;
