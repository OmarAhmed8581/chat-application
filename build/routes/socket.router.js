"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var crypto_1 = __importDefault(require("crypto"));
var conversation_controller_1 = __importDefault(require("../controllers/conversation.controller"));
var message_controller_1 = __importDefault(require("../controllers/message.controller"));
var router = express_1.default.Router();
var users = [];
var agents = [];
var takenUsers = [];
var activeChats = [];
var activeCalls = [];
var addUser = function (_a) {
    var userId = _a.userId, socketId = _a.socketId, data = __rest(_a, ["userId", "socketId"]);
    !users.some(function (user) { return user.userId === userId; }) &&
        users.push(__assign({ userId: userId, socketId: socketId }, data));
};
var addDeclinePropertyToUser = function (userId, agentId) {
    users.forEach(function (user) {
        if (user.userId === userId && !user.declinedAgents.some(function (agent) { return agent.agentId === agentId; })) {
            user.declinedAgents.push(agentId);
        }
    });
};
var removeUserSocket = function (socketId) {
    users = users.filter(function (user) { return user.socketId !== socketId; });
};
var removeUser = function (user) {
    users = users.filter(function (notremoved) { return notremoved.userId !== user._id; });
    takenUsers = takenUsers.filter(function (notremoved) { return notremoved.userId !== user._id; });
};
var removeUserFromUsersOnly = function (user) {
    users = users.filter(function (notremoved) { return notremoved.userId !== user._id; });
};
var declineUser = function (user) {
    users = users.filter(function (notremoved) { return notremoved.userId !== user._id; });
    takenUsers = takenUsers.filter(function (notremoved) { return notremoved.userId !== user._id; });
};
var getUser = function (userId) {
    return users.find(function (user) { return user.userId == userId; });
};
var getUserBySocketId = function (socketId) {
    return users.find(function (user) { return user.socketId == socketId; });
};
var addAgent = function (_a) {
    var userId = _a.userId, socketId = _a.socketId, data = __rest(_a, ["userId", "socketId"]);
    !agents.some(function (user) { return user.userId === userId; }) &&
        agents.push(__assign({ userId: userId, socketId: socketId }, data));
};
var removeAgent = function (user) {
    agents = agents.filter(function (notremoved) { return notremoved.userId !== user._id; });
};
var getAgent = function (userId) {
    console.log(userId, "getAgent, userId");
    return agents.find(function (user) { return user.userId == userId; });
};
var removeAgentSocket = function (socketId) {
    agents = agents.filter(function (user) { return user.socketId !== socketId; });
};
var getUsers = function () {
    return users.map(function (user) {
        if (user.role == 'user' && !takenUsers.some(function (takenUser) { return takenUser.userId === user.userId; })) {
            return user;
        }
    }).filter(Boolean);
};
var addActiveChat = function (_a) {
    var userId = _a.userId, agentId = _a.agentId, conversationId = _a.conversationId, isOnline = _a.isOnline, data = __rest(_a, ["userId", "agentId", "conversationId", "isOnline"]);
    !activeChats.some(function (user) { return user.userId === userId; }) &&
        activeChats.push(__assign({ userId: userId, agentId: agentId, conversationId: conversationId, isOnline: isOnline }, data));
};
var getActiveChats = function (agentId) {
    return activeChats.filter(function (activeChat) {
        if (activeChat.agentId == agentId) {
            return activeChat;
        }
    });
};
var getActiveChatUser = function (userId) {
    return activeChats.find(function (activeChat) { return activeChat.userId === userId; });
};
var editActiveChat = function (userId, isOnline) {
    activeChats = activeChats.map(function (chat) {
        if (chat.userId === userId) {
            chat.isOnline = isOnline;
            return chat;
        }
        else {
            return chat;
        }
    });
};
var removeActiveChatUser = function (userId) {
    activeChats = activeChats.filter(function (notremoved) { return notremoved.userId !== userId; });
};
var removeActiveChatagent = function (agentId) {
    activeChats = activeChats.filter(function (notremoved) { return notremoved.agentId !== agentId; });
};
var addActiveCall = function (userId, agentId, type, createdAt, channelName, uid, isDirectVideoCall) {
    if (channelName === void 0) { channelName = 123; }
    if (uid === void 0) { uid = 123; }
    if (isDirectVideoCall === void 0) { isDirectVideoCall = false; }
    !activeCalls.some(function (user) { return user.userId === userId && user.type === type; }) &&
        activeCalls.push({ userId: userId, agentId: agentId, type: type, createdAt: createdAt, channelName: channelName, uid: uid, isDirectVideoCall: isDirectVideoCall });
};
var getActiveCalls = function (agentId) {
    return activeCalls.filter(function (activeCall) {
        if (activeCall.agentId == agentId) {
            return activeCall;
        }
    });
};
var getParticulatCallByBoth = function (userId, agentId) {
    return activeCalls.find(function (activeCall) { return activeCall.userId === userId && activeCall.agentId === agentId; });
};
var getActiveCallUser = function (userId) {
    return activeCalls.find(function (activeCall) { return activeCall.userId === userId; });
};
var getActiveCallsUser = function (userId) {
    return activeCalls.filter(function (activeCall) { return activeCall.userId === userId; });
};
var removeActiveCallUser = function (userId) {
    activeCalls = activeCalls.filter(function (notremoved) { return notremoved.userId !== userId; });
};
var removeActiveCallsUserWithType = function (userId, type) {
    activeCalls = activeCalls.filter(function (notremoved) { return notremoved.userId !== userId && notremoved.type !== type; });
};
var SocketRouter = /** @class */ (function () {
    function SocketRouter() {
        this.getAgents = function () {
            return agents.map(function (user) {
                return user;
            }).filter(Boolean);
        };
        this.ioFunction = this.ioFunction.bind(this);
    }
    SocketRouter.prototype.ioFunction = function (io) {
        var _this = this;
        io.on("connection", function (socket) {
            //when ceonnect
            console.log("a user connected." + socket.id);
            //take userId and socketId from user
            socket.on("addUser", function (user) {
                try {
                    if (!user._id) {
                        io.to(socket.id).emit("error", {
                            text: "Required field is ( _id )",
                        });
                    }
                    else {
                        console.log("add User", user);
                        removeUserFromUsersOnly(user);
                        addUser(__assign({ userId: user._id, socketId: socket.id }, user));
                        console.log(getUsers());
                        io.emit("getUsers", getUsers());
                        var activeChat = getActiveChatUser(user._id);
                        if (activeChat) {
                            editActiveChat(user._id, true);
                            var agentId = activeChat.agentId;
                            var agent = getAgent(agentId);
                            io.to(agent.socketId).emit("getActiveChats", getActiveChats(agentId));
                        }
                        else {
                            agents.forEach(function (agent) {
                            });
                        }
                    }
                }
                catch (error) {
                    console.log(error);
                }
            });
            socket.on("addAgent", function (user) {
                try {
                    if (!user._id) {
                        io.to(socket.id).emit("error", {
                            text: "Required fields are ( _id )",
                        });
                    }
                    else {
                        removeAgent(user);
                        addAgent(__assign({ userId: user._id, socketId: socket.id }, user));
                        var agent = getAgent(user._id);
                        io.emit("getUsers", getUsers());
                        io.to(agent.socketId).emit("getActiveChats", getActiveChats(user._id));
                    }
                }
                catch (e) {
                    console.log(e);
                }
            });
            socket.on("declineUser", function (user, agent) {
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
                }
                catch (error) {
                    console.log(error);
                }
            });
            socket.on("takeUser", function (user, agent) { return __awaiter(_this, void 0, void 0, function () {
                var isAgent, userForTemplate, conversationId, conversation, error_1, sender, sender, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 9, , 10]);
                            // let  = JSON.parse(user)
                            // user = JSON.parse(user)
                            // agent = JSON.parse(agent)
                            console.log(user, agent, "user and agent");
                            console.log(agent._id, "agents");
                            isAgent = getAgent(agent._id);
                            console.log(isAgent, "isAgent");
                            if (!isAgent) return [3 /*break*/, 7];
                            if (!!takenUsers.some(function (takenUser) { return takenUser.userId === user._id; })) return [3 /*break*/, 6];
                            takenUsers.push({ userId: user._id });
                            userForTemplate = getUser(user._id);
                            console.log(userForTemplate, "user for template");
                            if (!userForTemplate) return [3 /*break*/, 5];
                            conversationId = crypto_1.default.randomBytes(20).toString("hex");
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, conversation_controller_1.default._findConversation(user._id)];
                        case 2:
                            conversation = _a.sent();
                            if (!conversation) {
                                conversation_controller_1.default.create({
                                    payload: {
                                        conversationId: user._id,
                                        members: [user._id, agent._id],
                                        agentId: agent._id,
                                        userId: user._id,
                                    }
                                });
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            console.error(error_1);
                            return [3 /*break*/, 4];
                        case 4:
                            addActiveChat(__assign({ userId: user._id, agentId: agent._id, conversationId: user._id, isOnline: true }, user));
                            io.to(userForTemplate.socketId).emit("getMessage", {
                                conversationId: user._id,
                                senderId: agent._id,
                                text: 'Welcome!',
                                name:agent.name,
                                type: 'text',
                                isTemplate: true,
                                createdAt: Date.now(),
                            });
                            io.to(isAgent.socketId).emit("getMessage", __assign({ conversationId: user._id, senderId: user._id, text: 'You have taken a user, Please start the conversation', type: 'text', isTemplate: true, createdAt: Date.now(), userId: userForTemplate.userId }, userForTemplate));
                            io.to(isAgent.socketId).emit("getActiveChats", getActiveChats(agent._id));
                            io.emit("getUsers", getUsers());
                            console.log(getActiveChats(agent._id));
                            return [3 /*break*/, 6];
                        case 5:
                            sender = getAgent(agent._id);
                            if (sender) {
                                io.to(sender.socketId).emit("error", {
                                    text: "Please wait till the user rejoin the chat. Take the user again after that",
                                });
                            }
                            _a.label = 6;
                        case 6: return [3 /*break*/, 8];
                        case 7:
                            sender = getUser(user._id);
                            if (sender) {
                                io.to(sender.socketId).emit("error", {
                                    text: "Please wait till the user rejoin the chat",
                                });
                            }
                            _a.label = 8;
                        case 8: return [3 /*break*/, 10];
                        case 9:
                            error_2 = _a.sent();
                            console.log(error_2);
                            return [3 /*break*/, 10];
                        case 10: return [2 /*return*/];
                    }
                });
            }); });
            //send and get message
            socket.on("sendMessage", function (_a) {
                var conversationId = _a.conversationId, senderId = _a.senderId, receiverId = _a.receiverId, text = _a.text, type = _a.type, mimeType = _a.mimeType, name = _a.name, size = _a.size, role = _a.role;
                try {
                    var user = void 0;
                    if (role === 'user') {
                        user = getAgent(receiverId);
                    }
                    else {
                        user = getUser(receiverId);
                    }
                    if (!user) {
                        if (role === 'user') {
                            var sender = getUser(senderId);
                            if (sender) {
                                io.to(sender.socketId).emit("error", {
                                    text: "Please wait till the user rejoin the chat",
                                });
                            }
                        }
                        else {
                            var sender = getAgent(senderId);
                            if (sender) {
                                io.to(sender.socketId).emit("error", {
                                    text: "Please wait till the user rejoin the chat",
                                });
                            }
                        }
                    }
                    else {
                        try {
                            message_controller_1.default.create({
                                payload: {
                                    conversationId: conversationId,
                                    senderId: senderId,
                                    text: text,
                                    type: type,
                                    mimeType: mimeType,
                                    name: name,
                                    size: size,
                                    createdAt: Date.now(),
                                }
                            });
                        }
                        catch (error) {
                            console.error(error);
                        }
                        io.to(user.socketId).emit("getMessage", {
                            conversationId: conversationId,
                            senderId: senderId,
                            text: text,
                            type: type,
                            createdAt: Date.now(),
                            mimeType: mimeType,
                            name: name,
                            size: size
                        });
                    }
                }
                catch (error) {
                    console.log(error);
                }
            });
            socket.on("removeUser", function (user, agent) {
                try {
                    console.log(user, agent, "user, agent");
                    var userToBeRemoved_1 = getUser(user._id);
                    if (userToBeRemoved_1) {
                        io.to(userToBeRemoved_1.socketId).emit("removedUser", {
                            text: 'User has removed successfully',
                        });
                        if (agent) {
                            console.log(agent, "agent");
                            var chat = getActiveChatUser(user === null || user === void 0 ? void 0 : user._id);
                            if (!chat)
                                return;
                            removeActiveChatUser(user._id);
                            var agentToSend_1 = getAgent(agent._id);
                            io.to(agentToSend_1.socketId).emit("getActiveChats", getActiveChats(agent._id));
                            console.log(getActiveChats(agent._id), "removeUser");
                            var calls = getActiveCallsUser(user._id);
                            if (calls) {
                                calls.forEach(function (call) {
                                    io.to(userToBeRemoved_1.socketId).emit("callEnded", __assign({ senderId: user._id, type: call.type, channelName: call.channelName, uid: call.uid }, userToBeRemoved_1));
                                    io.to(agentToSend_1.socketId).emit("callEnded", __assign({ senderId: agent._id, type: call.type, channelName: call.channelName, uid: call.uid }, userToBeRemoved_1));
                                });
                                removeActiveCallUser(user._id);
                            }
                        }
                        removeUser(user);
                        io.emit("userLeft", {
                            userId: user._id
                        });
                    }
                    else {
                        var chat = getActiveChatUser(user._id);
                        if (chat) {
                            removeActiveChatUser(user._id);
                            var agentToSend_2 = getAgent(chat.agentId);
                            io.to(agentToSend_2.socketId).emit("getActiveChats", getActiveChats(chat.agentId));
                            var calls = getActiveCallsUser(user._id);
                            if (calls) {
                                calls.forEach(function (call) {
                                    io.to(userToBeRemoved_1.socketId).emit("callEnded", __assign({ senderId: user._id, type: call.type, channelName: call.channelName, uid: call.uid }, userToBeRemoved_1));
                                    io.to(agentToSend_2.socketId).emit("callEnded", __assign({ senderId: agent._id, type: call.type, channelName: call.channelName, uid: call.uid }, userToBeRemoved_1));
                                });
                                removeActiveCallUser(user._id);
                            }
                            removeUser(user);
                            io.emit("userLeft", {
                                userId: user._id
                            });
                        }
                    }
                }
                catch (error) {
                    console.log(error);
                }
            });
            socket.on("removeAgent", function (agent) {
                try {
                    var agentToBeRemoved = getAgent(agent._id);
                    if (agentToBeRemoved) {
                        io.to(agentToBeRemoved.socketId).emit("removedagent", {
                            text: 'agent has removed successfully',
                        });
                        var chats = getActiveChats(agent._id);
                        if (chats) {
                            chats.forEach(function (chat) {
                                var userToBeRemoved = getUser(chat.userId);
                                removeActiveChatUser(chat.userId);
                            });
                        }
                        var calls = getActiveCalls(agent._id);
                        if (calls) {
                            calls.forEach(function (call) {
                                removeActiveCallUser(call.userId);
                                var user = getUser(call.userId);
                                if (user) {
                                    io.to(user.socketId).emit("callEnded", __assign({ senderId: call.userId, type: call.type, channelName: call.channelName, uid: call.uid }, user));
                                }
                            });
                        }
                        removeActiveChatagent(agent._id);
                        removeAgent(agent);
                        io.emit("agentLeft", {
                            userId: agent._id
                        });
                    }
                }
                catch (error) {
                    console.log(error);
                }
            });
            socket.on("getAgentActiveChats", function (user) {
                try {
                    var agent = getAgent(user._id);
                    if (agent) {
                        io.to(agent.socketId).emit("getActiveChats", getActiveChats(user._id));
                    }
                }
                catch (error) {
                    console.log(error);
                }
            });
            //Calls
            socket.on("startCall", function (_a) {
                var senderId = _a.senderId, receiverId = _a.receiverId, type = _a.type, role = _a.role, channelName = _a.channelName, uid = _a.uid;
                try {
                    console.log("startCall", senderId, receiverId, type, role, channelName, uid);
                    console.log(typeof (senderId), typeof (receiverId));
                    var agent = void 0;
                    if (role === 'user') {
                        agent = getActiveCalls(receiverId);
                    }
                    else {
                        agent = getActiveCalls(senderId);
                    }
                    var ifBothAreAlreadyInACall = getParticulatCallByBoth(senderId, receiverId);
                    console.log(agent, "agent");
                    console.log(ifBothAreAlreadyInACall, "ifBothAreAlreadyInACall");
                    if (agent.length < 1 || ifBothAreAlreadyInACall) {
                        console.log({ senderId: senderId, receiverId: receiverId, type: type, role: role, channelName: channelName, uid: uid });
                        var user = void 0;
                        var userWhoIsRequesting = void 0;
                        if (role === 'user') {
                            console.log("here in role user");
                            user = getAgent(receiverId);
                            console.log(user);
                            userWhoIsRequesting = getUser(senderId);
                        }
                        else {
                            console.log("here in role agent");
                            user = getUser(receiverId);
                        }
                        console.log(user);
                        if (!user) {
                            if (role === 'user') {
                                var sender = getUser(senderId);
                                if (sender) {
                                    io.to(sender.socketId).emit("error", {
                                        text: "Please wait till the user rejoin the chat",
                                    });
                                }
                            }
                            else {
                                var sender = getAgent(senderId);
                                if (sender) {
                                    io.to(sender.socketId).emit("error", {
                                        text: "Please wait till the user rejoin the chat",
                                    });
                                }
                            }
                        }
                        else {
                            if (role === 'user') {
                                addActiveCall(senderId, receiverId, type, new Date(), channelName, uid);
                            }
                            else {
                                addActiveCall(receiverId, senderId, type, new Date(), channelName, uid);
                            }
                            if (userWhoIsRequesting) {
                                console.log(userWhoIsRequesting, "userWhoIsRequesting");
                                console.log(user, "user");
                                console.log(agents, "agents");
                                console.log(user.socketId, "user.socketId");
                                io.to(user.socketId).emit("callStarted", __assign({ senderId: senderId, type: type, channelName: channelName, uid: uid }, userWhoIsRequesting));
                            }
                            else {
                                console.log("call Started if agent found");
                                console.log("called");
                                console.log(user, "user");
                                io.to(user.socketId).emit("callStarted", __assign({ senderId: senderId, type: type, channelName: channelName, uid: uid }, user));
                            }
                        }
                    }
                    else {
                        console.log("!agent case");
                        var user = void 0;
                        if (role === 'user') {
                            user = getUser(senderId);
                            console.log(user, "user object");
                            io.to(user.socketId).emit("error", {
                                text: "agent is already in a call",
                            });
                        }
                        else {
                            user = getAgent(senderId);
                            io.to(user.socketId).emit("error", {
                                text: "You are already in a call",
                            });
                        }
                    }
                }
                catch (error) {
                    console.log(error);
                }
            });
            socket.on("callOptions", function (_a) {
                var senderId = _a.senderId, receiverId = _a.receiverId, option = _a.option, role = _a.role, channelName = _a.channelName, uid = _a.uid;
                try {
                    var user = void 0;
                    var userWhoIsRequesting = void 0;
                    if (role === 'user') {
                        user = getAgent(receiverId);
                        userWhoIsRequesting = getUser(senderId);
                    }
                    else {
                        user = getUser(receiverId);
                    }
                    if (!user) {
                        if (role === 'user') {
                            var sender = getUser(senderId);
                            if (sender) {
                                io.to(sender.socketId).emit("error", {
                                    text: "Please wait till the user rejoin the chat",
                                });
                            }
                        }
                        else {
                            var sender = getAgent(senderId);
                            if (sender) {
                                io.to(sender.socketId).emit("error", {
                                    text: "Please wait till the user rejoin the chat",
                                });
                            }
                        }
                    }
                    else {
                        // for starting video call log
                        if (role === 'user' && option.type === 'video' && option.action === true) {
                            console.log("active calls users", senderId, receiverId);
                            addActiveCall(senderId, receiverId, option.type, new Date(), channelName, uid);
                            console.log(activeCalls, "activeCalls for video");
                        }
                        // for completing video call log
                        if (option.type === 'video' && option.action === false) {
                            if (role === 'user') {
                                var calls = getActiveCallsUser(senderId);
                                if (calls) {
                                    calls.forEach(function (call) {
                                        console.log(call, "inside call option");
                                        if (call.type === 'video') {
                                            removeActiveCallsUserWithType(call.userId, call.type);
                                        }
                                    });
                                }
                            }
                            else {
                                var calls = getActiveCallsUser(receiverId);
                                if (calls) {
                                    calls.forEach(function (call) {
                                        console.log(call, "inside call option");
                                        if (call.type === 'video') {
                                            removeActiveCallsUserWithType(call.userId, call.type);
                                        }
                                    });
                                }
                            }
                        }
                        if (userWhoIsRequesting) {
                            io.to(user.socketId).emit("callOptions", __assign({ senderId: senderId, option: option, channelName: channelName, uid: uid }, userWhoIsRequesting));
                        }
                        else {
                            io.to(user.socketId).emit("callOptions", __assign({ senderId: senderId, channelName: channelName, option: option, uid: uid }, user));
                        }
                    }
                }
                catch (error) {
                    console.log(error);
                }
            });
            socket.on("endCall", function (_a) {
                var senderId = _a.senderId, receiverId = _a.receiverId, type = _a.type, role = _a.role, channelName = _a.channelName, uid = _a.uid;
                try {
                    console.log(senderId, receiverId, type, role, channelName, uid);
                    var user = void 0;
                    var userWhoIsRequesting = void 0;
                    if (role === 'user') {
                        user = getAgent(receiverId);
                        userWhoIsRequesting = getUser(senderId);
                    }
                    else {
                        user = getUser(receiverId);
                    }
                    console.log(user, "user");
                    console.log(userWhoIsRequesting, "userWhoIsRequesting");
                    console.log(receiverId, "receiverId");
                    console.log(user, "endCall");
                    if (!user) {
                        if (role === 'user') {
                            var sender = getUser(senderId);
                            if (sender) {
                                io.to(sender.socketId).emit("error", {
                                    text: "Please wait till the user rejoin the chat",
                                });
                            }
                        }
                        else {
                            var sender = getAgent(senderId);
                            if (sender) {
                                io.to(sender.socketId).emit("error", {
                                    text: "Please wait till the user rejoin the chat",
                                });
                            }
                        }
                    }
                    else {
                        if (role === 'user') {
                            var calls = getActiveCallsUser(senderId);
                            if (calls) {
                                calls.forEach(function (call) {
                                    console.log(call);
                                    removeActiveCallUser(call.userId);
                                    if (call.type === 'video') {
                                    }
                                    else {
                                    }
                                });
                            }
                        }
                        else {
                            var calls = getActiveCallsUser(receiverId);
                            if (calls) {
                                calls.forEach(function (call) {
                                    console.log(call);
                                    removeActiveCallUser(call.userId);
                                    if (call.type === 'video') {
                                    }
                                    else {
                                    }
                                });
                            }
                        }
                        if (userWhoIsRequesting) {
                            io.to(user.socketId).emit("callEnded", __assign({ senderId: senderId, type: type, channelName: channelName, uid: uid }, userWhoIsRequesting));
                        }
                        else {
                            io.to(user.socketId).emit("callEnded", __assign({ senderId: senderId, type: type, channelName: channelName, uid: uid }, user));
                        }
                    }
                }
                catch (error) {
                    console.log(error);
                }
            });
            socket.on("declineCall", function (_a) {
                var senderId = _a.senderId, receiverId = _a.receiverId, role = _a.role, channelName = _a.channelName, uid = _a.uid;
                try {
                    var user = void 0;
                    var userWhoIsRequesting = void 0;
                    if (role === 'user') {
                        user = getAgent(receiverId);
                        userWhoIsRequesting = getUser(senderId);
                    }
                    else {
                        user = getUser(receiverId);
                    }
                    if (!user) {
                        if (role === 'user') {
                            var sender = getUser(senderId);
                            if (sender) {
                                io.to(sender.socketId).emit("error", {
                                    text: "Please wait till the user rejoin the chat",
                                });
                            }
                        }
                        else {
                            var sender = getAgent(senderId);
                            if (sender) {
                                io.to(sender.socketId).emit("error", {
                                    text: "Please wait till the user rejoin the chat",
                                });
                            }
                        }
                    }
                    else {
                        if (role === 'user') {
                            var call = getActiveCallUser(senderId);
                            if (call) {
                                console.log(receiverId, "receiverId");
                                removeActiveCallUser(call.userId);
                                console.log(activeCalls, "activeCalls");
                            }
                        }
                        else {
                            var call = getActiveCallUser(receiverId);
                            if (call) {
                                console.log(receiverId, "receiverId");
                                removeActiveCallUser(call.userId);
                                console.log(activeCalls, "activeCalls");
                            }
                        }
                        if (userWhoIsRequesting) {
                            io.to(user.socketId).emit("declinedCall", __assign({ senderId: senderId, decline: true, channelName: channelName, uid: uid }, userWhoIsRequesting));
                        }
                        else {
                            io.to(user.socketId).emit("declinedCall", __assign({ senderId: senderId, channelName: channelName, decline: true, uid: uid }, user));
                        }
                    }
                }
                catch (error) {
                    console.log(error);
                }
            });
            //when disconnect
            socket.on("disconnect", function () {
                try {
                    console.log("a user disconnected!", socket.id);
                    var user = getUserBySocketId(socket.id);
                    if (user) {
                        var activeChat = getActiveChatUser(user.userId);
                        if (activeChat) {
                            editActiveChat(user.userId, false);
                            var agentId = activeChat.agentId;
                            var agent = getAgent(agentId);
                            io.to(agent.socketId).emit("getActiveChats", getActiveChats(agentId));
                        }
                    }
                    removeUserSocket(socket.id);
                    removeAgentSocket(socket.id);
                    io.emit("getUsers", getUsers());
                }
                catch (error) {
                    console.log(error);
                }
            });
        });
        return router;
    };
    ;
    return SocketRouter;
}());
module.exports = new SocketRouter().ioFunction;
module.exports.SocketData = /** @class */ (function () {
    function SocketData() {
        this.getAgents = function () {
            return agents;
        };
    }
    return SocketData;
}());
