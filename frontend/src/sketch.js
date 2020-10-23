const sketch = (p) => {
  let current = "None";
  const addTileButton = document.querySelector("#add-tile-button");
  const removeTileButton = document.querySelector("#remove-tile-button");
  const setOutputButton = document.querySelector("#set-output-button");
  const saveNotebookButton = document.querySelector("#save-notebook");
  let noteBook;
  let canvasWidth = p.windowWidth / 1.25;
  let canvasHeight = p.windowHeight / 1.35;
  class Tile {
    constructor(name, canvasWidth, canvasHeight) {
      this.information = {
        name: name,
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        xPos: canvasWidth / 2,
        yPos: canvasHeight / 2,
        tileWidth: 160,
        tileHeight: 80,
        outputs: [],
      };
    }

    addOutput(someTile) {
      this.information.outputs.push(someTile);
    }
    removeOutput(someTileName) {
      for (let i = 0; i < this.information.outputs.length; i++) {
        if (this.information.outputs[i].information.name === someTileName) {
          this.information.outputs.splice(i, 1);
        }
      }
    }
    flushOutput() {
      this.information.outputs = [];
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
      } = this.information;
      p.rectMode(p.CENTER);
      p.fill("darkgrey");
      p.rect(xPos, yPos, tileWidth, tileHeight);
      p.stroke("black");
      p.strokeWeight(1);
      p.point(xPos, yPos);
      p.text(name, xPos - 20, yPos);
      const { outputs } = this.information;
      if (outputs.length > 0) {
        outputs.forEach((element, index) => {
          p.line(
            xPos + tileWidth / 2,
            yPos,
            element.information.xPos - tileWidth / 2,
            element.information.yPos
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
    }

    addTile(name, canvasWidth, canvasHeight) {
      if (this.tileNames.includes(name)) {
        alert("Tile already exists, cannot create tile.");
      } else {
        const newTile = new Tile(name, canvasWidth, canvasHeight);
        this.tiles.push(newTile);
        this.tileNames.push(name);
      }
    }

    display() {
      this.tiles.forEach((element, index) => {
        element.show();
      });
    }

    setOutput(nodeName, outputTileName) {
      let node;
      let outputTile;
      for (let i = 0; i < this.tiles.length; i++) {
        if (this.tiles[i].information.name === nodeName) {
          node = this.tiles[i];
        } else if (this.tiles[i].information.name === outputTileName) {
          outputTile = this.tiles[i];
        }
      }
      node.addOutput(outputTile);
    }

    removeTile(tileName) {
      if (!this.tileNames.includes(tileName)) {
        alert("Tile does not exist.");
      } else {
        this.tiles.forEach((element, index) => {
          element.removeOutput(tileName);
        });
        for (let i = 0; i < this.tiles.length; i++) {
          if (this.tiles[i].information.name === tileName) {
            this.tiles[i].flushOutput();
            this.tiles.splice(i, 1);
            this.tileNames.splice(i, 1);
            break;
          }
        }
      }
    }
  }

  addTileButton.addEventListener("click", () => {
    const name = prompt();
    noteBook.addTile(name, canvasWidth, canvasHeight);
  });
  removeTileButton.addEventListener("click", () => {
    const name = prompt();
    noteBook.removeTile(name, canvasWidth, canvasHeight);
  });
  setOutputButton.addEventListener("click", () => {
    const tile1 = prompt("Enter name of input tile:");
    const tile2 = prompt("Enter name of output tile:");
    if (
      !noteBook.tileNames.includes(tile1) ||
      !noteBook.tileNames.includes(tile2)
    ) {
      alert("One of the two tile names entered does not exist.");
    } else {
      noteBook.setOutput(tile1, tile2);
    }
  });
  saveNotebookButton.addEventListener("click", () => {
    while (noteBook.name === "Untitled-Notebook") {
      const newName = prompt("Please enter name for notebook:");
      noteBook.name = newName;
    }
    console.log(noteBook);
  });
  p.setup = () => {
    p.createCanvas(canvasWidth, canvasHeight);
    p.background("grey");
  };
  p.mouseReleased = () => {
    current = "None";
  };
  p.draw = () => {
    p.background(220);
    noteBook.display();
  };
  noteBook = new Notebook();
};
export default sketch;
