const sketch = (p) => {
  let current = "None";
  const addTileButton = document.querySelector("#add-tile-button");
  const removeTileButton = document.querySelector("#remove-tile-button");
  const tileNameInput = document.querySelector("#tileName");
  let noteBook;
  let canvasWidth = 1200;
  let canvasHeight = 400;
  
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
      p.text(name, xPos, yPos);
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
    }

    addTile(name, canvasWidth, canvasHeight) {
      const newTile = new Tile(name, canvasWidth, canvasHeight);
      this.tiles.push(newTile);
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
      this.tiles.forEach((element, index) => {
        element.removeOutput(tileName);
      });
      for (let i = 0; i < this.tiles.length; i++) {
        if (this.tiles[i].information.name === tileName) {
          this.tiles[i].flushOutput();
          this.tiles.splice(i, 1);
          break;
        }
      }
    }
  }

  addTileButton.addEventListener("click", () => {
    const name = tileNameInput.value;
    noteBook.addTile(name, canvasWidth, canvasHeight);
  });
  removeTileButton.addEventListener("click", () => {
    const name = tileNameInput.value;
    noteBook.removeTile(name, canvasWidth, canvasHeight);
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

  noteBook.addTile("tile1", canvasWidth, canvasHeight);
  noteBook.addTile("tile2", canvasWidth, canvasHeight);
  noteBook.addTile("tile3", canvasWidth, canvasHeight);
  noteBook.setOutput("tile1", "tile2");
  noteBook.setOutput("tile2", "tile3");
  noteBook.setOutput("tile1", "tile3");
};
export default sketch;
