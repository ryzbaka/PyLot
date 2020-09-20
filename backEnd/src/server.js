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

//================================================================================================================================================================================
//================================================================================================================================================================================
//~~DB OPERATIONS~~
//================================================================================================================================================================================
//================================================================================================================================================================================
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
//================================================================================================================================================================================
//================================================================================================================================================================================
/*app.post("/users/signin", ({ body: { username, password } }, res) => {
  User.findOne({ username: username }, "username hash")
    .then(async ({ hash }) => {
      const result = await bcrypt.compare(password, hash);
      result
        ? res.send("Authentication Successful")
        : res.send("Authenication Failed");
    })
    .catch((err) => res.send(err));    REMOVE THIS COMMENTED CODE ONCE VERIFIED FRONTEND FUNCTIONALITY.
});*/
app.post("/users/signin", ({ body: { username, password } }, res) => {
  User.findOne({ username: username }, "username hash").exec(
    async (err, result) => {
      if (result) {
        const { hash, servers } = result;
        const authenticationSuccessful = await bcrypt.compare(password, hash);
        if (authenticationSuccessful) {
          res.send("Authentication Successful");
        } else {
          res.send("Authentication Failed");
        }
      } else {
        res.send("Authentication Failed");
      }
    }
  );
});
//================================================================================================================================================================================
//================================================================================================================================================================================
app.post(
  "/users/addserver",
  ({ body: { username, serverName, ipAddr, sshKey, password } }, res) => {
    User.findOne({ username: username }).exec((err, resultant) => {
      if (err) {
        throw err;
        res.send("An error occurred.");
      } else {
        if (resultant) {
          if (resultant.servers.length === 0) {
            resultant.servers.push({
              serverName: serverName,
              ipAddr: ipAddr,
              sshKey: sshKey,
              password: password,
            });
            resultant.save();
            res.send("Added user's first server!");
          } else {
            const checkNameAvailable = (server) =>
              server.serverName === serverName;
            const nameNotAvailable = resultant.servers
              .map(checkNameAvailable)
              .some((el) => el === true);
            if (nameNotAvailable) {
              res.send(
                "Server with that name already exists. Did not add server."
              );
            } else {
              const newServer = {
                serverName: serverName,
                ipAddr: ipAddr,
                sshKey: sshKey,
                password: password,
              };
              resultant.servers.push(newServer);
              resultant.save();
              res.send("Added server.");
            }
            //addpasswordencryption
          }
        } else {
          res.send("User not found. Failed to add server.");
        }
      }
    });
  }
);
//================================================================================================================================================================================
//================================================================================================================================================================================
app.post("/users/removeserver", ({ body: { username, serverName } }, res) => {
  User.findOne({ username: username }).exec((err, resultant) => {
    if (err) {
      res.send("An error ocurred");
    } else {
      const serverExists = resultant.servers
        .map((el) => el.serverName === serverName)
        .some((el) => el === true);
      if (serverExists) {
        const serverIndex = resultant.servers
          .map((el) => el.serverName === serverName)
          .indexOf(true);
        resultant.servers.splice(serverIndex, 1);
        resultant.save();
        res.send(`Server : ${serverName} was deleted successfully.`);
      } else {
        res.send("Server with that name does not exist.");
      }
    }
  });
});
//================================================================================================================================================================================
//================================================================================================================================================================================
app.post("/users/getservers", ({ body: { username, password } }, res) => {
  User.findOne({ username: username }).exec(async (err, resultant) => {
    if (err) {
      res.send("An error ocurred.");
    } else {
      if (resultant) {
        const { hash, servers } = resultant;
        const authenticationSuccessful = await bcrypt.compare(password, hash);
        if (authenticationSuccessful) {
          res.send(servers);
        } else {
          res.send("Authentication failed. Did not retrieve servers.");
        }
      } else {
        res.send("Authentication failed. Did not retrieve servers.");
      }
    }
  });
});
//================================================================================================================================================================================
//================================================================================================================================================================================
//~~END OF DB OPERATIONS
//================================================================================================================================================================================
//================================================================================================================================================================================
mongoose
  .connect(
    process.env.DB_CONNECTION, //environment variable
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to MongoDB cluster..."))
  .catch((err) => console.error(err));
//================================================================================================================================================================================
//================================================================================================================================================================================
app.listen(port, () => {
  console.log(`listening on port ... ${port}`);
});
//================================================================================================================================================================================
//================================================================================================================================================================================
