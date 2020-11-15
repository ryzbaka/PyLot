const sketch = (p) => {
  let current = "None";
  const addTileButton = document.querySelector("#add-tile-button");
  const removeTileButton = document.querySelector("#remove-tile-button");
  const bindButton = document.querySelector("#bind-button");
  const saveNotebookButton = document.querySelector("#save-notebook");
  let noteBook;
  let canvasWidth = p.windowWidth / 1.12;
  let canvasHeight = p.windowHeight / 1.7;

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
        outputs: [],
        inputs: [],
      };
    }

    addOutput(someTile) {
      this.information.outputs.push(someTile);
    }
    addInput(someTile) {
      this.information.inputs.push(someTile);
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
      p.fill("#42f5bf"); //teal fill for tile
      p.rect(xPos, yPos, tileWidth, tileHeight);
      p.stroke("black");
      p.strokeWeight(1);
      p.text(name, xPos - 20, yPos);
      p.point(xPos, yPos);
      const { outputs } = this.information;
      p.stroke("white");
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

    bind(nodeName, outputTileName) {
      const nodeIndex = this.tileNames.indexOf(nodeName);
      const outputTileIndex = this.tileNames.indexOf(outputTileName);
      if (nodeIndex === -1 || outputTileIndex === -1) {
        alert("Invalid tile names");
      } else {
        const nodeTile = this.tiles[nodeIndex];
        const outputTile = this.tiles[outputTileIndex];
        const alreadyOutput = nodeTile.information.outputs
          .map((el) => el.information.name)
          .some((el) => el === outputTileName);
        if (alreadyOutput) {
          alert("Tiles already bound.");
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
        tile.information.outputs = tile.information.outputs.filter(
          (el) => el.information.name !== tileName
        );
        tile.information.inputs = tile.information.inputs.filter(
          (el) => el.information.name !== tileName
        );
      });
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
    }
  });
  saveNotebookButton.addEventListener("click", () => {
    while (noteBook.name === "Untitled-Notebook" || noteBook.name == null) {
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
