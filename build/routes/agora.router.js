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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgoraRouter = void 0;
var express = __importStar(require("express"));
// middleware
var middleware_1 = require("../middleware");
var agora_access_token_1 = require("agora-access-token");
var async_wrap_1 = require("../shared/async-wrap");
var errors_1 = require("../errors");
var constants_1 = require("../models/constants");
var AgoraRouter = /** @class */ (function () {
    function AgoraRouter() {
        this.router = express.Router();
        this.middleware();
        this.routes();
    }
    AgoraRouter.prototype.middleware = function () { };
    AgoraRouter.prototype.create = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, channelName, userId, appID, appCertificate, account, role, expirationTimeInSeconds, currentTimestamp, privilegeExpiredTs, tokenB;
            return __generator(this, function (_b) {
                try {
                    _a = req.query, channelName = _a.channelName, userId = _a.userId;
                    appID = constants_1.CONFIG.AGORAAPPID;
                    appCertificate = constants_1.CONFIG.AGORACERTIFICATE;
                    account = userId;
                    role = agora_access_token_1.RtcRole.PUBLISHER;
                    expirationTimeInSeconds = 3600;
                    currentTimestamp = Math.floor(Date.now() / 1000);
                    privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
                    tokenB = agora_access_token_1.RtcTokenBuilder.buildTokenWithAccount(appID, appCertificate, channelName, account, role, privilegeExpiredTs);
                    return [2 /*return*/, res.json({ token: tokenB })];
                }
                catch (error) {
                    res
                        .status(error.status || 500)
                        .send(!error.status ? new errors_1.InternalServerError("Something wrong") : error);
                }
                return [2 /*return*/];
            });
        });
    };
    AgoraRouter.prototype.routes = function () {
        var _this = this;
        this.router.route("/create").get(middleware_1.sanitizeBody, middleware_1.trimBodyWhiteSpace, middleware_1.authentication, (0, middleware_1.authorization)(), (0, async_wrap_1.asyncWrap)(function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.create(req, res)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }));
    };
    return AgoraRouter;
}());
exports.AgoraRouter = AgoraRouter;
exports.default = new AgoraRouter();
