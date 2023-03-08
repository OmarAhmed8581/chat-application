# Itechnology chat app


## Requriments

1. Nodejs
2. Npm
3. Typescript
4. MongoDB

## Installation

Make sure you have the requirements installed on your machine.

Run mongoDB on default port that is 27017.

Go to the root directory of the project and run the following command:

```
npm install

```
This project is based on TypeScript. So, you need to install TypeScript compiler.
If you don't want to do so then latest JS build is already in the project directory, so you can skip this step.

Go to build folder and run the following command:

```
node server.js

```

If you can't find the build folder in the project directory and you have a TypeScript compiler installed then you can run the following command in the root directory of the project:


```
tsc
    
```
and then run the server.js file in the build folder by running the above command.


## Testing APIs

Here's the Postman documentation for APIs:
    
    []: # Language: markdown
    []: # Path: https://documenter.getpostman.com/view/17101335/2s83KNk7qy


## Testing Sockets

To test sockets or use the chat feature what you would have to do is connect to the socket server with client by making connection with following URL: 
    
```
ws://110.93.216.28:3005
```
## User
You can add user to the chat server using the following channel
    
```
io.emit("addUser", user); // here user is an object with all attributes of the user specially id should be sent as _id

// {
//    _id: "id of user",
//    other fields
//}
```
    
You can get online users by using the following code:
    
```
socket.current.on("getUsers", (users) => {
    console.log(users);
});
```


## Message and Call (These channels are same for User and Agent)
You can send a message to online user by:
        
```
io.emit("sendMessage", ({ conversationId, senderId, receiverId, text, type, mimeType, name, size, role }) => {
});
```

You can receive messages by using the following code:
        
```
socket.current.on("getMessage", (data) => {
console.log(data)
});

```
You can initiate a call with agent

```
io.emit("startCall", ({ senderId, receiverId, type, role, channelName, uid }) => { // here role should be "user" if initiated by user else "agent", type should be "audio"
```

You can pass some options while being in the call like mute hold etc
Specifically you can start video call too for video call you will have to pass these key value pairs in options
```
{
    type: "video",
    action: true //or false if closing the video
}
```

```
io.emit("callOptions", ({ senderId, receiverId, option, role, channelName, uid }) => { // options here is an object where you can pass any key value pairs
```

You can end call with 

```
io.emit("endCall", ({ senderId, receiverId, type, role, channelName, uid }) => {
```

Both User and agent can decline call too with

```
io.emit("declineCall", ({ senderId, receiverId, role, channelName, uid }) => {
```

User can exit the socket with

```
io.emit("removeUser", (user, agent) => { 
// here user is first object which contains all attributes of user including _id 
// In case of removing user from socket while chatting or calling
// you must pass second object in which all attributes of agent must be passed to whom user was chatting

```

You can listen to this channel too if you want to verify if the user successfully left the socket check with the userId

```
socket.current.on("userLeft", {
    userId: user._id
})

```

You can listen to this channel to know if the agent to which user was chatting has disconnected
Here userId is agent's id

```
socket.current.on("agentLeft", {
    userId: agent._id
})
```


### Agent

You can add agent to the chat server using the following channel

```
io.emit("addAgent", (user) => { // here user must be an object and must contain _id as id of agent and other related fields like name etc

```

You can watch the new connecting users

```
socket.current.on("getUsers");

```

You can accept/take any user's request of chat

```
io.emit("takeUser", (user, agent) => { // here first object is user and second object is agent and both must contain _id

```

You can decline the request of a user

```
io.emit("declineUser", (user, agent) => { // here first object is user and second object is agent and both must contain _id
```

You can get active chats of current Agent

```
socket.on("getAgentActiveChats", (user) => { // here user is agent object and must contain _id of agent
```

You can listen to this channel to get active chats of current Agent whenever some event happens like user socket disconnect etc

```
socket.current.on("getActiveChats", (data) => {
console.log(data)
});
```

Agent can exit the socket with 

```
socket.on("removeAgent", (agent) => { // here agent is an object and must contain _id
```

You can listen to this channel for confirmation of exit

```
socket.current.on("removedagent", {
    text: 'agent has removed successfully',
})
```

You can listen to this channel if the user to whom agent was chatting has disconnected
Here userId is user's id

```
socket.current.on("userLeft", {
    userId: user._id
})

```