class Tile{
  constructor(name,canvasWidth,canvasHeight){
    this.information={
      name:name,
      canvasWidth:canvasWidth,
      canvasHeight:canvasHeight,
      xPos:canvasWidth/2,
      yPos:canvasHeight/2,
      tileWidth:160,
      tileHeight:80,
      outputs:[]
    };
  }
  show(){
    if(mouseIsPressed && (current==="None" || current==this.information.name)){
      const {tileWidth,tileHeight,xPos,yPos} = this.information;
      const leftWall = xPos-(tileWidth/2);
      const rightWall = xPos+(tileWidth/2);
      const bottomWall = yPos+(tileHeight/2);
      const topWall = yPos-(tileHeight/2);
      if(mouseX>leftWall && mouseX<rightWall && mouseY<bottomWall &&mouseY>topWall){
        current = this.information.name;
        this.information.xPos = mouseX;
        this.information.yPos = mouseY;
        strokeWeight(5)
        stroke("green")
      }
    }
    const {name,xPos,yPos,canvasWidth,canvasHeight,tileWidth,tileHeight} = this.information;
    rectMode(CENTER);
    fill('darkgrey');
    rect(xPos, yPos, tileWidth, tileHeight);
    stroke('black');
    strokeWeight(1)
    point(xPos,yPos);
    text(name,xPos,yPos);
    const {inputs,outputs} = this.information;
    if(outputs.length>0){
      outputs.forEach((element,index)=>{
        line(xPos+(tileWidth/2),yPos,element.information.xPos-(tileWidth/2),element.information.yPos);
      })
    }
  }
  addOutput(someTile){
    this.information.outputs.push(someTile)
  }
  removeOutput(someTileName){
    for(let i=0;i<this.information.outputs.length;i++){
      if(this.information.outputs[i].information.name===someTileName){
        this.information.outputs.splice(i,1)
      }
    }
  }
  flushOutput(){
    this.information.outputs=[]
  }
  
}

class Notebook{
  constructor(){
    this.name="Untitled-Notebook";
    this.tiles=[];
  }
  addTile(name,canvasWidth,canvasHeight){
    const newTile = new Tile(name,canvasWidth,canvasHeight);
    this.tiles.push(newTile);
  }
  display(){
    this.tiles.forEach((element,index)=>{
      element.show()
    })
  }
  setOutput(nodeName,outputTileName){
    let node;
    let outputTile;
    for(let i=0;i<this.tiles.length;i++){
      if(this.tiles[i].information.name===nodeName){
        node = this.tiles[i]; 
      }else if(this.tiles[i].information.name===outputTileName){
        outputTile = this.tiles[i]         
      }
    }
    node.addOutput(outputTile)
  }
  removeTile(tileName){
    this.tiles.forEach((element,index)=>{
      element.removeOutput(tileName)
    })
    for(let i=0;i<this.tiles.length;i++){
      if(this.tiles[i].information.name===tileName){
        this.tiles[i].flushOutput();
        this.tiles.splice(i,1);
        break;
      }
    }
  }
  
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
}
function mouseReleased(){
  current="None";
}
function draw() {
  background(220);
  noteBook.display();
}



let noteBook;
let canvasWidth=1600;
let canvasHeight=800;
let current="None";

noteBook = new Notebook();
noteBook.addTile("tile1",canvasWidth,canvasHeight);
noteBook.addTile("tile2",canvasWidth,canvasHeight);
noteBook.addTile("tile3",canvasWidth,canvasHeight);
noteBook.setOutput("tile1","tile2");
noteBook.setOutput("tile2","tile3");
noteBook.setOutput("tile1","tile3");

