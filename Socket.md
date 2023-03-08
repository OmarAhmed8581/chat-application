## Testing Sockets

To test sockets or use the chat feature what you would have to do is connect to the socket server with client by making connection with following URL: 
    
```
ws://103.125.240.24:80
```
After that first step for the client is to send the connected user object to the server through the following channel "addUser"
    
```
socket.emit("addUser", user);
```
    
You can get online users by using the following code:
    
```
socket.on("getUsers", (users) => {
    console.log(users);
});
```

If you want to accept a user which you got from "getUsers" channel then send the user object to the channel 
"takeUser":
    
```
socket.emit("takeUser", (user) => {
});
```

Now you will get an updated list of users from "getUsers" which will not have the user you just accepted.

Now you have to create a conversationId with conversation API which is /conversation/create, when you create a conversation you will get an _id from API which you will have to send with everymessage you send.

You can send a message to the taken user by:
        
```
socket.emit("sendMessage", {
conversationId: conversationId, //which you created above
senderId: yourId,
receiverId: receiverId, // which user you accepted or taken
text: 'newMessage',
type:'text', //or 'file'
createdAt: new Date().toISOString()
});
```

You can receive messages by using the following code:
        
```
socket.current.on("getMessage", (data) => {
console.log(data)
});

```
