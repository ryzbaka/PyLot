const express=require('express');
const route=express.Router()


route.post("/setupserver", ({ body: { username, serverName } }, res) => {
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

  module.exports=route
  