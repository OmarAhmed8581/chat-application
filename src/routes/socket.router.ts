import express from "express";
import crypto from "crypto";
import conversationController from "../controllers/conversation.controller";
import messageController from "../controllers/message.controller";
const router = express.Router();

let users: any = [];
let agents: any = [];
let takenUsers: any = [];
let activeChats: any = [];
let activeCalls: any = [];

const addUser = ({ userId, socketId, ...data }) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId, ...data });
};

const addDeclinePropertyToUser = (userId, agentId) => {
    users.forEach((user) => {
        if (user.userId === userId && !user.declinedAgents.some((agent) => agent.agentId === agentId)) {
            user.declinedAgents.push(agentId);
        }
    })
};

const removeUserSocket = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const removeUser = (user) => {
    users = users.filter((notremoved) => notremoved.userId !== user._id)
    takenUsers = takenUsers.filter((notremoved) => notremoved.userId !== user._id)
};

const removeUserFromUsersOnly = (user) => {
    users = users.filter((notremoved) => notremoved.userId !== user._id)
};

const declineUser = (user) => {
    users = users.filter((notremoved) => notremoved.userId !== user._id)
    takenUsers = takenUsers.filter((notremoved) => notremoved.userId !== user._id)
};

const getUser = (userId) => {
    return users.find((user) => user.userId == userId);
};

const getUserBySocketId = (socketId) => {
    return users.find((user) => user.socketId == socketId);
};

const addAgent = ({ userId, socketId, ...data }) => {
    !agents.some((user) => user.userId === userId) &&
        agents.push({ userId, socketId, ...data });
};

const removeAgent = (user) => {
    agents = agents.filter((notremoved) => notremoved.userId !== user._id)
};

const getAgent = (userId) => {
    console.log(userId, "getAgent, userId");
    return agents.find((user) => user.userId == userId);
};

const removeAgentSocket = (socketId) => {
    agents = agents.filter((user) => user.socketId !== socketId);
};

const getUsers = () => {
    return users.map((user) => {
        if (user.role == 'user' && !takenUsers.some((takenUser) => takenUser.userId === user.userId)) {
            return user
        }
    }).filter(Boolean)
};

const addActiveChat = ({ userId, agentId, conversationId, isOnline, ...data }) => {
    !activeChats.some((user) => user.userId === userId) &&
        activeChats.push({ userId, agentId, conversationId, isOnline, ...data });
};

const getActiveChats = (agentId) => {
    return activeChats.filter((activeChat) => {
        if (activeChat.agentId == agentId) {
            return activeChat
        }
    })
};

const getActiveChatUser = (userId) => {
    return activeChats.find((activeChat) => activeChat.userId === userId)
};

const editActiveChat = (userId, isOnline) => {
    activeChats = activeChats.map((chat) => {
        if (chat.userId === userId) {
            chat.isOnline = isOnline
            return chat
        } else {
            return chat
        }
    })
}

const removeActiveChatUser = (userId) => {
    activeChats = activeChats.filter((notremoved) => notremoved.userId !== userId)
};

const removeActiveChatagent = (agentId) => {
    activeChats = activeChats.filter((notremoved) => notremoved.agentId !== agentId)
};

const addActiveCall = (userId, agentId, type, createdAt, channelName = 123, uid = 123, isDirectVideoCall = false) => {
    !activeCalls.some((user) => user.userId === userId && user.type === type) &&
        activeCalls.push({ userId, agentId, type, createdAt, channelName, uid, isDirectVideoCall });
};

const getActiveCalls = (agentId) => {
    return activeCalls.filter((activeCall) => {
        if (activeCall.agentId == agentId) {
            return activeCall
        }
    })
};

const getParticulatCallByBoth = (userId, agentId) => {
    return activeCalls.find((activeCall) => activeCall.userId === userId && activeCall.agentId === agentId)
};

const getActiveCallUser = (userId) => {
    return activeCalls.find((activeCall) => activeCall.userId === userId)
};

const getActiveCallsUser = (userId) => {
    return activeCalls.filter((activeCall) => activeCall.userId === userId)
};

const removeActiveCallUser = (userId) => {
    activeCalls = activeCalls.filter((notremoved) => notremoved.userId !== userId)
};

const removeActiveCallsUserWithType = (userId, type) => {
    activeCalls = activeCalls.filter((notremoved) => notremoved.userId !== userId && notremoved.type !== type)
};

class SocketRouter {
    constructor() {
        this.ioFunction = this.ioFunction.bind(this);
    }
    public getAgents = () => {
        return agents.map((user) => {
            return user
        }).filter(Boolean)
    };

    public ioFunction(io) {
        io.on("connection", (socket: any) => {
            //when ceonnect
            console.log("a user connected." + socket.id);

            //take userId and socketId from user
            socket.on("addUser", (user) => {
                try {
                    if (!user._id) {
                        io.to(socket.id).emit("error", {
                            text: "Required field is ( _id )",
                        });
                    } else {
                        console.log("add User", user);
                        removeUserFromUsersOnly(user)
                        addUser({ userId: user._id, socketId: socket.id, ...user });
                        console.log(getUsers());
                        io.emit("getUsers", getUsers());

                        let activeChat = getActiveChatUser(user._id)
                        if (activeChat) {
                            editActiveChat(user._id, true)
                            let agentId = activeChat.agentId
                            let agent = getAgent(agentId);
                            io.to(agent.socketId).emit("getActiveChats", getActiveChats(agentId));

                        } else {
                            agents.forEach((agent) => {
                            })
                        }
                    }
                } catch (error) {
                    console.log(error)
                }
            });

            socket.on("addAgent", (user) => {
                try {
                    if (!user._id) {
                        io.to(socket.id).emit("error", {
                            text: "Required fields are ( _id )",
                        });
                    } else {
                        removeAgent(user)
                        addAgent({ userId: user._id, socketId: socket.id, ...user });
                        let agent = getAgent(user._id)
                        io.emit("getUsers", getUsers());
                        io.to(agent.socketId).emit("getActiveChats", getActiveChats(user._id));

                    }
                } catch (e) {
                    console.log(e)
                }
            });

            socket.on("declineUser", (user, agent) => {
                try {

                    addDeclinePropertyToUser(user._id, agent._id);
                    // let userToBeRemoved = getUser(user._id);
                    // if (userToBeRemoved) {
                    //     io.to(userToBeRemoved.socketId).emit("removedUser", {
                    //         text: 'User has removed successfully',
                    //     })
                    // }
                    // removeUser(user);
                    // io.emit("userLeft", {
                    //     userId: user._id
                    // })
                    io.emit("getUsers", getUsers());
                } catch (error) {
                    console.log(error);
                }
            });

            socket.on("takeUser", async (user, agent) => {
                try {
                    // let  = JSON.parse(user)
                    // user = JSON.parse(user)
                    // agent = JSON.parse(agent)
                    console.log(user, agent, "user and agent");
                    console.log(agent._id, "agents");
                    let isAgent = getAgent(agent._id);
                    console.log(isAgent,"isAgent" );
                    if (isAgent) {
                        if (!takenUsers.some((takenUser) => takenUser.userId === user._id)) {
                            takenUsers.push({ userId: user._id });
                            const userForTemplate = getUser(user._id);
                            console.log(userForTemplate, "user for template");
                            if (userForTemplate) {
                                let conversationId = crypto.randomBytes(20).toString("hex");
                                try {
                                    let conversation = await conversationController._findConversation(user._id)
                                    if (!conversation) {
                                        conversationController.create({
                                            payload: {
                                                conversationId: user._id,
                                                members: [user._id, agent._id],
                                                agentId: agent._id,
                                                userId: user._id,
                                            }
                                        });
                                    }
                                } catch (error) {
                                    console.error(error)
                                }
                                addActiveChat({ userId: user._id, agentId: agent._id, conversationId: user._id, isOnline: true, ...user });
                                io.to(userForTemplate.socketId).emit("getMessage", {
                                    conversationId: user._id,
                                    senderId: agent._id,
                                    name:agent.name,
                                    text: 'Welcome!',
                                    type: 'text',
                                    isTemplate: true,
                                    createdAt: Date.now(),

                                });
                                io.to(isAgent.socketId).emit("getMessage", {
                                    conversationId: user._id,
                                    senderId: user._id,
                                    text: 'You have taken a user, Please start the conversation',
                                    type: 'text',
                                    isTemplate: true,
                                    createdAt: Date.now(),
                                    userId: userForTemplate.userId,
                                    ...userForTemplate
                                });
                                io.to(isAgent.socketId).emit("getActiveChats", getActiveChats(agent._id));
                                io.emit("getUsers", getUsers());
                                console.log(getActiveChats(agent._id));
                            } else {
                                const sender = getAgent(agent._id)
                                if (sender) {
                                    io.to(sender.socketId).emit("error", {
                                        text: "Please wait till the user rejoin the chat. Take the user again after that",
                                    });
                                }
                            }
                        }
                    } else {
                        const sender = getUser(user._id)
                        if (sender) {
                            io.to(sender.socketId).emit("error", {
                                text: "Please wait till the user rejoin the chat",
                            });
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            });

            //send and get message
            socket.on("sendMessage", ({ conversationId, senderId, receiverId, text, type, mimeType, name, size, role }) => {
                try {
                    let user
                    if (role === 'user') {
                        user = getAgent(receiverId);
                    } else {
                        user = getUser(receiverId)
                    }

                    if (!user) {
                        if (role === 'user') {
                            const sender = getUser(senderId)
                            if (sender) {
                                io.to(sender.socketId).emit("error", {
                                    text: "Please wait till the user rejoin the chat",
                                });
                            }
                        } else {
                            const sender = getAgent(senderId)
                            if (sender) {
                                io.to(sender.socketId).emit("error", {
                                    text: "Please wait till the user rejoin the chat",
                                });
                            }
                        }
                    } else {
                        try {
                            messageController.create({
                                payload: {
                                    conversationId,
                                    senderId,
                                    text,
                                    type,
                                    mimeType,
                                    name,
                                    size,
                                    createdAt: Date.now(),
                                }
                            });
                        } catch (error) {
                            console.error(error)
                        }
                        io.to(user.socketId).emit("getMessage", {
                            conversationId,
                            senderId,
                            text,
                            type,
                            createdAt: Date.now(),
                            mimeType,
                            name,
                            size
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            });

            socket.on("removeUser", (user, agent) => {
                try {
                    console.log(user, agent, "user, agent");
                    let userToBeRemoved = getUser(user._id);
                    if (userToBeRemoved) {
                        io.to(userToBeRemoved.socketId).emit("removedUser", {
                            text: 'User has removed successfully',
                        })
                        if (agent) {
                            console.log(agent, "agent");
                            let chat = getActiveChatUser(user?._id)
                            if (!chat) return
                            removeActiveChatUser(user._id);
                            let agentToSend = getAgent(agent._id);
                            io.to(agentToSend.socketId).emit("getActiveChats", getActiveChats(agent._id))
                            console.log(getActiveChats(agent._id), "removeUser");
                            let calls = getActiveCallsUser(user._id)
                            if (calls) {
                                calls.forEach((call) => {
                                    io.to(userToBeRemoved.socketId).emit("callEnded", {
                                        senderId: user._id,
                                        type: call.type,
                                        channelName: call.channelName,
                                        uid: call.uid,
                                        ...userToBeRemoved
                                    });
                                    io.to(agentToSend.socketId).emit("callEnded", {
                                        senderId: agent._id,
                                        type: call.type,
                                        channelName: call.channelName,
                                        uid: call.uid,
                                        ...userToBeRemoved
                                    });
                                })
                                removeActiveCallUser(user._id)

                            }
                        }
                        removeUser(user);
                        io.emit("userLeft", {
                            userId: user._id
                        })
                    } else {
                        let chat = getActiveChatUser(user._id)
                        if (chat) {
                            removeActiveChatUser(user._id);
                            let agentToSend = getAgent(chat.agentId);
                            io.to(agentToSend.socketId).emit("getActiveChats", getActiveChats(chat.agentId))
                            let calls = getActiveCallsUser(user._id)
                            if (calls) {
                                calls.forEach((call) => {
                                    io.to(userToBeRemoved.socketId).emit("callEnded", {
                                        senderId: user._id,
                                        type: call.type,
                                        channelName: call.channelName,
                                        uid: call.uid,
                                        ...userToBeRemoved
                                    });
                                    io.to(agentToSend.socketId).emit("callEnded", {
                                        senderId: agent._id,
                                        type: call.type,
                                        channelName: call.channelName,
                                        uid: call.uid,
                                        ...userToBeRemoved

                                    });
                                })
                                removeActiveCallUser(user._id)
                            }

                            removeUser(user);
                            io.emit("userLeft", {
                                userId: user._id
                            })
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            });

            socket.on("removeAgent", (agent) => {
                try {
                    let agentToBeRemoved = getAgent(agent._id);
                    if (agentToBeRemoved) {
                        io.to(agentToBeRemoved.socketId).emit("removedagent", {
                            text: 'agent has removed successfully',
                        })
                        let chats = getActiveChats(agent._id)
                        if (chats) {
                            chats.forEach((chat) => {
                                let userToBeRemoved = getUser(chat.userId)
                                removeActiveChatUser(chat.userId);
                            })
                        }
                        let calls = getActiveCalls(agent._id)
                        if (calls) {
                            calls.forEach((call) => {
                                removeActiveCallUser(call.userId)
                                let user = getUser(call.userId)
                                if (user) {
                                    io.to(user.socketId).emit("callEnded", {
                                        senderId: call.userId,
                                        type: call.type,
                                        channelName: call.channelName,
                                        uid: call.uid,
                                        ...user
                                    });
                                }

                            });

                        }

                        removeActiveChatagent(agent._id);
                        removeAgent(agent);
                        io.emit("agentLeft", {
                            userId: agent._id
                        })
                    }
                } catch (error) {
                    console.log(error);
                }
            });

            socket.on("getAgentActiveChats", (user) => {
                try {
                    let agent = getAgent(user._id);
                    if (agent) {
                        io.to(agent.socketId).emit("getActiveChats", getActiveChats(user._id));
                    }
                } catch (error) {
                    console.log(error);
                }
            })

            //Calls
            socket.on("startCall", ({ senderId, receiverId, type, role, channelName, uid }) => {
                try {
                    console.log("startCall", senderId, receiverId, type, role, channelName, uid);
                    console.log(typeof(senderId), typeof(receiverId));
                    let agent
                    if (role === 'user') {
                        agent = getActiveCalls(receiverId);
                    } else {
                        agent = getActiveCalls(senderId);
                    }

                    let ifBothAreAlreadyInACall = getParticulatCallByBoth(senderId, receiverId)
                    console.log(agent, "agent");
                    console.log(ifBothAreAlreadyInACall, "ifBothAreAlreadyInACall");
                    if (agent.length < 1 || ifBothAreAlreadyInACall) {
                        console.log({ senderId, receiverId, type, role, channelName, uid });
                        let user
                        let userWhoIsRequesting
                        if (role === 'user') {
                            console.log("here in role user");
                            user = getAgent(receiverId);
                            console.log(user);
                            userWhoIsRequesting = getUser(senderId);
                        } else {
                            console.log("here in role agent");
                            user = getUser(receiverId)
                        }
                        console.log(user);
                        if (!user) {
                            if (role === 'user') {
                                const sender = getUser(senderId)
                                if (sender) {
                                    io.to(sender.socketId).emit("error", {
                                        text: "Please wait till the user rejoin the chat",
                                    });
                                }
                            } else {
                                const sender = getAgent(senderId)
                                if (sender) {
                                    io.to(sender.socketId).emit("error", {
                                        text: "Please wait till the user rejoin the chat",
                                    });
                                }
                            }
                        } else {
                            if (role === 'user') {
                                addActiveCall(senderId, receiverId, type, new Date(), channelName, uid);
                            } else {
                                addActiveCall(receiverId, senderId, type, new Date(), channelName, uid)
                            }
                            if (userWhoIsRequesting) {
                                console.log(userWhoIsRequesting, "userWhoIsRequesting");
                                console.log(user, "user");
                                console.log(agents, "agents");
                                console.log(user.socketId, "user.socketId");
                                io.to(user.socketId).emit("callStarted", {
                                    senderId,
                                    type,
                                    channelName,
                                    uid,

                                    ...userWhoIsRequesting
                                });
                            } else {
                                console.log("call Started if agent found");
                                console.log("called");
                                console.log(user, "user");
                                io.to(user.socketId).emit("callStarted", {
                                    senderId,
                                    type,
                                    channelName,
                                    uid,
                                    ...user
                                });
                            }

                        }
                    } else {
                        console.log("!agent case");
                        let user
                        if (role === 'user') {
                            user = getUser(senderId);
                            console.log(user, "user object");
                            io.to(user.socketId).emit("error", {
                                text: "agent is already in a call",
                            });
                        } else {
                            user = getAgent(senderId)
                            io.to(user.socketId).emit("error", {
                                text: "You are already in a call",
                            });
                        }

                    }
                } catch (error) {
                    console.log(error)
                }
            });

            socket.on("callOptions", ({ senderId, receiverId, option, role, channelName, uid }) => {
                try {
                    let user
                    let userWhoIsRequesting
                    if (role === 'user') {
                        user = getAgent(receiverId);
                        userWhoIsRequesting = getUser(senderId);
                    } else {
                        user = getUser(receiverId)
                    }

                    if (!user) {
                        if (role === 'user') {
                            const sender = getUser(senderId)
                            if (sender) {
                                io.to(sender.socketId).emit("error", {
                                    text: "Please wait till the user rejoin the chat",
                                });
                            }
                        } else {
                            const sender = getAgent(senderId)
                            if (sender) {
                                io.to(sender.socketId).emit("error", {
                                    text: "Please wait till the user rejoin the chat",
                                });
                            }
                        }
                    } else {
                        // for starting video call log
                        if (role === 'user' && option.type === 'video' && option.action === true) {
                            console.log("active calls users", senderId, receiverId);
                            addActiveCall(senderId, receiverId, option.type, new Date(), channelName, uid)
                            console.log(activeCalls, "activeCalls for video");
                        }

                        // for completing video call log
                        if (option.type === 'video' && option.action === false) {
                            if (role === 'user') {
                                let calls = getActiveCallsUser(senderId)
                                if (calls) {
                                    calls.forEach((call) => {
                                        console.log(call, "inside call option");
                                        if (call.type === 'video') {
                                            removeActiveCallsUserWithType(call.userId, call.type)

                                        }

                                    })
                                }
                            } else {
                                let calls = getActiveCallsUser(receiverId)
                                if (calls) {
                                    calls.forEach((call) => {
                                        console.log(call, "inside call option");
                                        if (call.type === 'video') {
                                            removeActiveCallsUserWithType(call.userId, call.type)

                                        }

                                    })
                                }
                            }
                        }
                        if (userWhoIsRequesting) {
                            io.to(user.socketId).emit("callOptions", {
                                senderId,
                                option,
                                channelName,
                                uid,
                                ...userWhoIsRequesting
                            });
                        } else {
                            io.to(user.socketId).emit("callOptions", {
                                senderId,
                                channelName,
                                option,
                                uid,
                                ...user
                            });
                        }
                    }

                } catch (error) {
                    console.log(error)
                }
            });

            socket.on("endCall", ({ senderId, receiverId, type, role, channelName, uid }) => {
                try {
                    console.log(senderId, receiverId, type, role, channelName, uid);
                    let user
                    let userWhoIsRequesting
                    if (role === 'user') {
                        user = getAgent(receiverId);
                        userWhoIsRequesting = getUser(senderId);
                    } else {
                        user = getUser(receiverId)
                    }
                    console.log(user, "user");
                    console.log(userWhoIsRequesting, "userWhoIsRequesting");
                    console.log(receiverId, "receiverId");
                    console.log(user, "endCall");
                    if (!user) {
                        if (role === 'user') {
                            const sender = getUser(senderId)
                            if (sender) {
                                io.to(sender.socketId).emit("error", {
                                    text: "Please wait till the user rejoin the chat",
                                });
                            }
                        } else {
                            const sender = getAgent(senderId)
                            if (sender) {
                                io.to(sender.socketId).emit("error", {
                                    text: "Please wait till the user rejoin the chat",
                                });
                            }
                        }
                    } else {
                        if (role === 'user') {
                            let calls = getActiveCallsUser(senderId)
                            if (calls) {
                                calls.forEach((call) => {
                                    console.log(call);
                                    removeActiveCallUser(call.userId)
                                    if (call.type === 'video') {

                                    } else {

                                    }
                                })

                            }
                        } else {
                            let calls = getActiveCallsUser(receiverId)
                            if (calls) {
                                calls.forEach((call) => {
                                    console.log(call);
                                    removeActiveCallUser(call.userId)
                                    if (call.type === 'video') {

                                    } else {

                                    }
                                })
                            }
                        }
                        if (userWhoIsRequesting) {
                            io.to(user.socketId).emit("callEnded", {
                                senderId,
                                type,
                                channelName,
                                uid,
                                ...userWhoIsRequesting
                            });
                        } else {
                            io.to(user.socketId).emit("callEnded", {
                                senderId,
                                type,
                                channelName,
                                uid,
                                ...user
                            });
                        }
                    }

                } catch (error) {
                    console.log(error)
                }
            });


            socket.on("declineCall", ({ senderId, receiverId, role, channelName, uid }) => {
                try {
                    let user
                    let userWhoIsRequesting
                    if (role === 'user') {
                        user = getAgent(receiverId);
                        userWhoIsRequesting = getUser(senderId);
                    } else {
                        user = getUser(receiverId)
                    }

                    if (!user) {
                        if (role === 'user') {
                            const sender = getUser(senderId)
                            if (sender) {
                                io.to(sender.socketId).emit("error", {
                                    text: "Please wait till the user rejoin the chat",
                                });
                            }
                        } else {
                            const sender = getAgent(senderId)
                            if (sender) {
                                io.to(sender.socketId).emit("error", {
                                    text: "Please wait till the user rejoin the chat",
                                });
                            }
                        }
                    } else {
                        if (role === 'user') {
                            let call = getActiveCallUser(senderId)
                            if (call) {
                                console.log(receiverId, "receiverId");
                                removeActiveCallUser(call.userId)
                                console.log(activeCalls, "activeCalls");
                            }
                        } else {
                            let call = getActiveCallUser(receiverId)
                            if (call) {
                                console.log(receiverId, "receiverId");
                                removeActiveCallUser(call.userId)
                                console.log(activeCalls, "activeCalls");
                            }
                        }
                        if (userWhoIsRequesting) {
                            io.to(user.socketId).emit("declinedCall", {
                                senderId,
                                decline: true,
                                channelName,
                                uid,
                                ...userWhoIsRequesting
                            });
                        } else {
                            io.to(user.socketId).emit("declinedCall", {
                                senderId,
                                channelName,
                                decline: true,
                                uid,
                                ...user
                            });
                        }
                    }

                } catch (error) {
                    console.log(error)
                }
            });

            //when disconnect
            socket.on("disconnect", () => {
                try {
                    console.log("a user disconnected!", socket.id);
                    let user = getUserBySocketId(socket.id);
                    if (user) {
                        let activeChat = getActiveChatUser(user.userId)
                        if (activeChat) {
                            editActiveChat(user.userId, false)
                            let agentId = activeChat.agentId
                            let agent = getAgent(agentId);
                            io.to(agent.socketId).emit("getActiveChats", getActiveChats(agentId));
                        }
                    }

                    removeUserSocket(socket.id);
                    removeAgentSocket(socket.id);
                    io.emit("getUsers", getUsers());
                } catch (error: any) {
                    console.log(error);
                }
            });
        });
        return router;
    };
}

module.exports = new SocketRouter().ioFunction;
module.exports.SocketData = class SocketData {
    constructor() {
    }
    public getAgents = () => {
        return agents
    };
};
