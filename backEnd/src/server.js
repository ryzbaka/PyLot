const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const User = require("./models/Users");
const port = 5555;

app.use(bodyParser.json());
require("dotenv").config({ path: path.join(__dirname, ".env") });

//~~DB OPERATIONS~~
app.post(
  "/users/signup",
  async ({ body: { firstName, lastName, username, password, email } }, res) => {
    User.findOne({ username: username }, "username").then((resultant) => {
      if (resultant) {
        res.send("Username already exists!");
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            const newUser = new User({
              firstName: firstName,
              lastName: lastName,
              username: username,
              hash: hash,
              email: email,
              servers: [],
            });
            newUser
              .save()
              .then(() => res.send("User created."))
              .catch((err) => res.send(err));
          });
        });
      }
    });
  }
);
app.post("/users/signin", ({ body: { username, password } }, res) => {
  User.findOne({ username: username }, "username hash")
    .then(async ({ hash }) => {
      const result = await bcrypt.compare(password, hash);
      result
        ? res.send("Authentication Successful")
        : res.send("Authenication Failed");
    })
    .catch((err) => res.send(err));
});

app.post(
  "/users/addserver",
  ({ body: { username, serverName, ipAddr, sshKey, password } }, res) => {
    User.findOne({ username: username }).exec((err, resultant) => {
      if (err) {
        throw err;
      } else {
        resultant.servers.push({
          serverName: serverName,
          ipAddr: ipAddr,
          sshKey: sshKey,
          password: password,
        });
        console.log(resultant);
        resultant.save();
        res.send("UPDATED");
        //add functionality for ensuring unique servernames.
      }
    });
  }
);
//~~END OF DB OPERATIONS
mongoose
  .connect(
    process.env.DB_CONNECTION, //environment variable
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to MongoDB cluster..."))
  .catch((err) => console.error(err));

app.listen(port, () => {
  console.log(`listening on port ... ${port}`);
});
