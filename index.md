# Welcome to PyLot Documentation
## API Documentation
### User Account Management
#### Create User [POST]
  * Path : `/users/signup`
  * Params :
    * <strong>firstName</strong> : User's First Name (String)
    * <strong>lastName</strong> : User's Last Name (String)
    * <strong>username</strong> : Username (String).
    * <strong>password</strong> : Password (String).
    * <strong>email</strong> : User's email address (String).
```
{
  firstName: "John",
  lastName: "Doe",
  username: "johndoe123",
  password: "testpass",
  email: "john.doe@snailmail.com
}
```

#### Add Server [POST]
  * Path : `/users/addserver`
  * Params :
    * <strong>username</strong> : Username (String).
    * <strong>serverName</strong> : Server's name (String) [A user cannot have multiple servers with the same name].
    * <strong>ipAddr</strong> : Server IP address.
    * <strong>sshKey</strong> : Password field contains SSH Key (Boolean).
    * <strong>password</strong> : Server password (String).
```
Example
{
  username: "johndoe123",
  serverName: "server-1",
  ipAddr: "192.168.1.1",
  sshKey: false,
  password: "serverpassowrd1"
}
```

#### Remove Server [POST]
  * Path : `/users/removeserver`
  * Params :
    * <strong>username</strong> : Username (String).
    * <strong>serverName</strong> : Server Name (String).
```
Example
{
  username: "johndoe123",
  serverName: "server-1",
}
```

#### Fetch Servers [POST]
  * Path : `/users/getservers`
  * Params :
    * <strong>username</strong> : Username (String).
    * <strong>password</strong> : Password (String).
```
Example
{
  username: "johndoe123",
  password: "testpass",
}
```
