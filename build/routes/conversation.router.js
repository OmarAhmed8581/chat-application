"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationRouter = void 0;
var express = __importStar(require("express"));
// middleware
var middleware_1 = require("../middleware");
// controllers
var conversation_controller_1 = __importDefault(require("../controllers/conversation.controller"));
var async_wrap_1 = require("../shared/async-wrap");
var errors_1 = require("../errors");
var enums_1 = require("../models/enums");
var shared_1 = require("../models/shared");
var ConversationRouter = /** @class */ (function () {
    function ConversationRouter(conversationController) {
        this.conversationController = conversationController;
        this.router = express.Router();
        this.middleware();
        this.routes();
    }
    ConversationRouter.prototype.middleware = function () { };
    ConversationRouter.prototype.get = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, search, type, sortKey, isId, date, contacts, _b, _c, _d, error_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 3, , 4]);
                        _a = req.query, search = _a.search, type = _a.type, sortKey = _a.sortKey, isId = _a.isId, date = _a.date;
                        _c = (_b = this.conversationController).get;
                        _d = [search, type, isId, sortKey];
                        return [4 /*yield*/, shared_1.Pagination.pagination(req)];
                    case 1: return [4 /*yield*/, _c.apply(_b, _d.concat([_e.sent(), date]))];
                    case 2:
                        contacts = _e.sent();
                        contacts === null
                            ? res.status(404).send(new errors_1.NotFoundError("No record found", {
                                message: "No record found",
                                i18n: "notExist",
                            }))
                            : res.json(contacts);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _e.sent();
                        res
                            .status(error_1.status || 500)
                            .send(!error_1.status ? new errors_1.InternalServerError("Something wrong") : error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ConversationRouter.prototype.getBy = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, userId, agentId, contact, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.query, userId = _a.userId, agentId = _a.agentId;
                        return [4 /*yield*/, this.conversationController.getBy(userId, agentId)];
                    case 1:
                        contact = _b.sent();
                        contact === null
                            ? res.status(404).send(new errors_1.NotFoundError("No record found", {
                                message: "No record found",
                                i18n: "notExist",
                            }))
                            : res.json(contact);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _b.sent();
                        res
                            .status(error_2.status || 500)
                            .send(!error_2.status ? new errors_1.InternalServerError("Something wrong") : error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ConversationRouter.prototype.create = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.conversationController.create({ payload: req.body })];
                    case 1:
                        result = _a.sent();
                        res.json(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        res
                            .status(error_3.status || 500)
                            .send(!error_3.status ? new errors_1.InternalServerError("Something wrong") : error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ConversationRouter.prototype.edit = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var search, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        search = req.query.search;
                        return [4 /*yield*/, this.conversationController.edit({
                                query: { id: search },
                                payload: req.body,
                            })];
                    case 1:
                        result = _a.sent();
                        res.json(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        res
                            .status(error_4.status || 500)
                            .send(!error_4.status ? new errors_1.InternalServerError("Something wrong") : error_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ConversationRouter.prototype.delete = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = req.query;
                        return [4 /*yield*/, this.conversationController.delete({ query: query })];
                    case 1:
                        result = _a.sent();
                        res.json(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        res
                            .status(error_5.status || 500)
                            .send(!error_5.status ? new errors_1.InternalServerError("Something wrong") : error_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ConversationRouter.prototype.routes = function () {
        var _this = this;
        this.router.route("/get").get(middleware_1.sanitizeQuery, middleware_1.trimQueryWhiteSpace, middleware_1.authentication, (0, middleware_1.authorization)([enums_1.Role.User, enums_1.Role.Doctor]), (0, async_wrap_1.asyncWrap)(function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get(req, res)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }));
        this.router.route("/get-by").get(middleware_1.sanitizeQuery, middleware_1.trimQueryWhiteSpace, middleware_1.authentication, (0, middleware_1.authorization)([enums_1.Role.User, enums_1.Role.Doctor]), (0, async_wrap_1.asyncWrap)(function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getBy(req, res)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }));
        this.router.route("/create").post(middleware_1.sanitizeBody, middleware_1.trimBodyWhiteSpace, middleware_1.authentication, (0, middleware_1.authorization)([enums_1.Role.User, enums_1.Role.Doctor]), (0, async_wrap_1.asyncWrap)(function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.create(req, res)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }));
        this.router.route("/edit").post(middleware_1.sanitizeBody, middleware_1.trimBodyWhiteSpace, middleware_1.authentication, (0, middleware_1.authorization)(), (0, async_wrap_1.asyncWrap)(function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.edit(req, res)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }));
        this.router.route("/delete").get(middleware_1.sanitizeQuery, middleware_1.trimQueryWhiteSpace, middleware_1.sanitizeBody, middleware_1.trimBodyWhiteSpace, middleware_1.authentication, (0, middleware_1.authorization)(), (0, async_wrap_1.asyncWrap)(function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.delete(req, res)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }));
    };
    return ConversationRouter;
}());
exports.ConversationRouter = ConversationRouter;
exports.default = new ConversationRouter(conversation_controller_1.default);
