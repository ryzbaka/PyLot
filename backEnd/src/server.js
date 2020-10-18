const request = require("request");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const User = require("./models/Users");
const { Client } = require("ssh2");
const port = 5555;
const app = express();

app.use(bodyParser.json());
require("dotenv").config({ path: path.join(__dirname, ".env") });

const UserController = require('./controllers/userController')

//================================================================================================================================================================================
//================================================================================================================================================================================
//~~DB OPERATIONS~~
//================================================================================================================================================================================
//================================================================================================================================================================================

app.use('/users', UserController);

app.post("/health/setupserver", ({ body: { username, serverName } }, res) => {
  User.findOne({ username: username }).exec(async (err, resultant) => {
    if (resultant) {
      const { servers, hash } = resultant;
      const authenticationSuccessful = true; // await bcrypt.compare(password, hash);
      if (authenticationSuccessful) {
        const serverIndex = servers
          .map((el, index) => el.serverName === serverName)
          .indexOf(true);
        const { user, password, ipAddr } = servers[serverIndex];
        const command = await sshInit(user, password, ipAddr, res);
      } else {
        res.send("Authentication failed.");
      }
    } else {
      res.send("User not found.");
    }
  });
});
//================================================================================================================================================================================
//================================================================================================================================================================================
//~~END OF DB OPERATIONS
//================================================================================================================================================================================
//================================================================================================================================================================================
//================================================================================================================================================================================
//~ SSH OPERATIONS
//================================================================================================================================================================================
async function sshInit(username, password, host, res) {
  const connectionDetails = {
    host: host,
    port: 22,
    username: username,
    password: password,
  };
  const conn = new Client();
  let log = "";
  conn.on("ready", () => {
    log += "\nPyLot connected to user's remote server\n";
    conn.exec(
      "git clone https://github.com/ryzbaka/PyLotHealthReportingServicePayload.git;cd PyLotHealthReportingServicePayload;npm i;npx forever start healthMonitor.js",
      (err, stream) => {
        if (err) {
          log += "\nCommand execution failed\n";
        }
        stream.stdout.on("data", (data) => {
          log += `\n***\n STDOUT : \n${data.toString()}\n***`;
        });
        stream.stderr.on("data", (data) => {
          log += `\n***\n STDERR : \n${data.toString()}\n***`;
        });
        stream.on("close", () => {
          log += "\nConnection closed from server\n";
          conn.end();
        });
      }
    );
  });
  conn.on("end", () => {
    log += "\nDisconnected to server.\n";
    res.send(`\nLog:\n${log}`);
  });
  conn.on("error", () => {
    log += "\nConnection error.\n";
  });
  conn.connect(connectionDetails);
}
//================================================================================================================================================================================
//~Connecting to Health Server Application
//================================================================================================================================================================================
app.post(
  "/display",
  ({ body: { username, password, user, serverName, details } }, res) => {
    User.findOne({ username: username }, "hash servers").exec(
      async (err, result) => {
        if (err) {
          res.json({ message: err });
        } else {
          if (result) {
            const name = serverName;
            const { hash, servers } = result;
            let ip = "";
            let serverUsername = "";
            if (servers.length === 0) {
              res.json({ message: "This user does not have any servers" });
            }
            for (let i = 0; i < servers.length; i++) {
              const { serverName, ipAddr, user } = servers[i];
              if (serverName === name) {
                ip = ipAddr;
                serverUsername = user;
                break;
              }
            }
            if (ip === "" || serverUsername === "") {
              res.json({
                message:
                  "server with that name not found or server username is invalid.",
              });
            }
            const checkAuthentication = await bcrypt.compare(password, hash);
            if (checkAuthentication) {
              request.post(
                {
                  url: `http://${ip}:4400/Display`, //shouldn't this be the IP of the user's server.
                  json: {
                    Username: user,
                    Servername: serverName,
                    Details: details, //again wtf is details.
                  },
                  headers: {
                    "Content-type": "application/json",
                  },
                },
                (err, response) => {
                  //callback to be executed once request has been sent.
                  if (err) {
                    res.json({ message: err });
                  } else {
                    res.send(response.body);
                  }
                }
              );
            } else {
              res.json({
                message: "Data retrieval failed. Invalid credentials.",
              });
            }
          } else {
            res.json({ message: "User does not exist." });
          }
        }
      }
    );
  }
);
//================================================================================================================================================================================
//================================================================================================================================================================================
//================================================================================================================================================================================
//~CONNECTIING TO MONGODB SERVER
//================================================================================================================================================================================
mongoose
  .connect(
    process.env.DB_CONNECTION, //environment variable
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to MongoDB cluster..."))
  .catch((err) => console.error(err));
//================================================================================================================================================================================
//~ STARTTING NODE JS SERVER AND SETTING TO LISTEN ON PORT
//================================================================================================================================================================================
const server = app.listen(port, () => {
  console.log(`listening on port ... ${port}`);
});
//================================================================================================================================================================================
//================================================================================================================================================================================
