const mongoose = require("mongoose");

const UsersSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    requires: true,
  },
  servers: [
    {
      user: {
        type: String,
      },
      serverName: {
        type: String,
      },
      ipAddr: {
        type: String,
      },
      sshKey: {
        type: Boolean,
      },
      password: {
        type: String,
      },
    },
  ],

  notebooks: [
    {
      notebookName: String, //name of the notebook
      server: String, // server associated with the notebook
      createdOn: String,
      data: {
        name: String, //name of the notebook.
        tileNames: [String], //array contains names of the tiles in the notebook.
        tiles: [
          //array consists of an objects with one key 'information' that maps to another object.
          {
            information: {
              canvasHeight: Number, //height of the canvas
              canvasWidth: Number, //width of the canvas
              code: String, // code string.
              inputTileNames: [String],
              name: String, //name of the tile
              outputTileNames: [String],
              tileHeight: Number,
              tileWidth: Number,
              xPos: Number,
              yPos: Number,
            },
          },
        ],
      },
    },
  ],
});

module.exports = mongoose.model("Users", UsersSchema);
