const express = require("express");
const app = express();
const port = 5555;

app.get("/endpoint", (req, res) => {
  res.json({
    message: "This is an example Node.js endpoint for PyLot",
  });
});

app.listen(port, () => {
  console.log(`PyLot server listening on port: ${port}`);
});
