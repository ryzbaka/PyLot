const express=require('express');
const route=express.Router()

route.post(
    "/signup",
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

  route.post("/signin", ({ body: { username, password } }, res) => {
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


  route.post(
    "/addserver",
    ({ body: { username, user, serverName, ipAddr, sshKey, password } }, res) => {
      User.findOne({ username: username }).exec((err, resultant) => {
        if (err) {
          throw err;
          res.send("An error occurred.");
        } else {
          if (resultant) {
            if (resultant.servers.length === 0) {
              resultant.servers.push({
                user: user,
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
                  user: user,
                };
                resultant.servers.push(newServer);
                resultant.save();
                res.send("Added server.");
              }
              //addpasswordencryption for server passwords
            }
          } else {
            res.send("User not found. Failed to add server.");
          }
        }
      });
    });

  route.post("/removeserver", ({ body: { username, serverName } }, res) => {
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

  route.post("/getservers", ({ body: { username, password } }, res) => {
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

module.exports=route