const express = require("express");
const app = express();
const path = require("path");
const port = 5555;
const host = "127.0.0.1";

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port);
console.log(`Listening on port ${port}`);
