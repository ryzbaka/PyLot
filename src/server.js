const express = require("express");
const app = express();
const port = 5555;
const hostname = "127.0.0.1";
const path = require("path");

app.get("/", (req, res) => {
  res.send("Hello")
});
app.use(express.static(__dirname + "/public/")); //public data
app.listen(port, hostname, () => {
  console.log(`Running on ${port}...`);
});
