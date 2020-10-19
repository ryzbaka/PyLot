const express=require('express')
const route=express.Router()

route.post(
    "/",
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

module.exports=route