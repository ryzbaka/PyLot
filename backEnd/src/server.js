const request = require("request");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const User = require("./models/Users");
const { Client } = require("ssh2");
const Users = require("./models/Users");
const port = 5555;
const app = express();

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
    User.findOne({ username: username }, "username").exec((resultant) => {
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
      "git clone https://github.com/ryzbaka/PyLotHealthReportingServicePayload.git;cd PyLotHealthReportingServicePayload;npm i;npx forever start server2.js",
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
app.post("/getIp",({body:{username,serverName}},res)=>{
  User.findOne({username:username}).exec((err,result)=>{
    if(err){
      res.json({message:err})
    }else{
      if(result){
        const {servers}=result;
        let found="";
        for(let i=0;i<servers.length;i++){
          const sName = servers[i].serverName;
          if(sName===serverName){
            found = servers[i].ipAddr
          }
        }
        if(found===""){
          res.json({message:"Server with that name not found."});
        }else{
          res.send(found);
        }
      }else{
        res.json({message:"User does not exist."})
      }
    }
  });
})
//================================================================================================================================================================================
//~~Notebook CRUD/Operations~
//================================================================================================================================================================================
app.post("/loadNotebook",({body:{notebook,user}},res)=>{
  console.log(`Requested ${user}'s notebook: ${notebook}`);
  User.findOne({username:user}).exec((err,result)=>{
    if(err){
      res.send({message:"Database connection error.",data:{}})
    }else{
      if(result){
        let targetIndex=null;
        for(let i=0;i<result.notebooks.length;i++){
          // console.log(notebook)
          // console.log(result.notebooks[i].data.name)
          if(result.notebooks[i].notebookName==notebook){
            targetIndex = i;
          }
          console.log(result.notebooks[i].notebookName)
          console.log(notebook);
          console.log(notebook ===result.notebooks[i].notebookName)
        }
        console.log(targetIndex)
        //get rid of these console.logs later.
        if(targetIndex===null){
          res.send({message:"Notebook not found.",data:{}})
        }else{
          res.send(
            {
              message:"Notebook found.",
              data:result.notebooks[targetIndex].data
            }
          )
        }
      }else{
        res.send({message:"Username not found.",data:{}})
      }
    }
  })
})
app.post("/users/test",({body:{notebook,user}},res)=>{ //rename this to /saveNotebook.
  //this saves a notebook DAG to MongoDB.
  User.findOne({username:user}).exec((err,result)=>{
    if(err){
      res.send({message:"error connecting to PyLot database."})
    }else{
      if(result){
        for(let i=0;i<result.notebooks.length;i++){
          if(result.notebooks[i].notebookName==notebook.name){
            result.notebooks[i].data = notebook;
          }
        }
        console.log(result)
        result.save();
        res.send({message:"Found user with that notebook."})
      }else{
        res.send({message:"That username does not exist."})
      }
    }
  })
})

app.post("/addNotebook",({body:{username,name}},res)=>{
  User.findOne({username:username}).exec((err,result)=>{
    if(err){
      res.json({message:"Query error."})
    }
    else{
      if(result){
        const {notebooks} = result;
        const notebookObject ={
          notebookName:name,
          createdOn:new Date().toString()
        }
        const alreadyExists = notebooks.map(({notebookName})=>notebookName===name).some(el=>el);
        if(alreadyExists){
          res.json({message:"Notebook with that name already exists."})
        }else{
          result.notebooks.push(notebookObject);
          // console.log(result);
          result.save();
          res.json({message:`Added notebook with name ${name}`});
        }
      }else{
        res.json({message:"Invalid username."})
      }
    }
  })
})
app.post("/getNotebooks",({body:{username}},res)=>{
  User.findOne({username:username}).exec((err,result)=>{
    if(err){
      res.json({message:"Query error."})
    }else{
      if(result){
        res.json({notebooks:result.notebooks})
      }else{
        res.json({message:"Invalid username."})
      }
    }
  })
})
app.post("/deleteNotebook",({body:{username,name}},res)=>{
  //backend working fine.
  //test frontend.
  User.findOne({username:username}).exec((err,resultant)=>{
    if(err){
      res.send({message:"Database error."})
    }else{
      if(resultant){
        let targetIndex=null;
        for(let i=0;i<resultant.notebooks.length;i++){
          // console.log(resultant.notebooks[i].notebookName+" "+name);
          if(resultant.notebooks[i].notebookName===name){
            targetIndex = i;
          }  
        }
        if(targetIndex!=null){
        resultant.notebooks.splice(targetIndex,1);
        resultant.save();
        res.send({message:`Deleted ${username}'s notebook : ${name}`})
        }else{
          res.send({message:"Notebook with that name does not exist"})
        }
      }else{
        res.send({message:"That username does not exist"})
      }
    }
  })
})
app.post('/deleteAllNotebooks',({body:{username}},res)=>{
  User.findOne({username:username}).exec((err,result)=>{
    if(err){
      res.json({message:"Query Error"});  
    }else if(result){
      result.notebooks=[]
      result.save();
      res.json({message:"Deleted all notebooks."})
    }else{
      res.json({message:"Invalid username."})
    }
  })
})
//================================================================================================================================================================================
//~End of notebook CRUD/Operations
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
//~ STARTING NODE JS SERVER AND SETTING TO LISTEN ON PORT
//================================================================================================================================================================================
const server = app.listen(port, () => {
  console.log(`listening on port ... ${port}`);
});
//================================================================================================================================================================================
//================================================================================================================================================================================
