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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.basePath = void 0;
var dotenv = __importStar(require("dotenv"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
dotenv.config();
var app_1 = __importDefault(require("./app"));
// import { logger } from './shared/winston-logger';
var PORT = process.env.PORT || 3005;
// import http from 'http'
var https_1 = __importDefault(require("https"));
var options = {
    cert: fs_1.default.readFileSync(path_1.default.resolve('/home/agora-dev', 'certificate', '__itecknologi_com.crt')),
    //ca: fs.readFileSync(path.resolve('/home/agora-dev', 'certificate', '__itecknologi_com.ca-bundle')),
    key: fs_1.default.readFileSync(path_1.default.resolve('/home/agora-dev', 'certificate', '__itecknologi_com.key'))
    //requestCert: true,
    //rejectUnauthorized: true
};
var server = https_1.default.createServer(options, app_1.default);
app_1.default.io.attach(server, {
    cors: {
        origin: '*',
    }
});
server.listen(443, function () {
    console.log("HTTPS Server running on port 443");
});
// server.listen(PORT, () => {
//     console.log(`Server Listing Port ${PORT}`);
// });
exports.basePath = __dirname;
