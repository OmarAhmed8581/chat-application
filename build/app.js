"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var express_http_context_1 = __importDefault(require("express-http-context"));
var cors_1 = __importDefault(require("cors"));
var request_ip_1 = __importDefault(require("request-ip"));
var express_fileupload_1 = __importDefault(require("express-fileupload"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
// Routes
var database_1 = __importDefault(require("./config/database"));
var upload_router_1 = __importDefault(require("./routes/upload.router"));
var message_router_1 = __importDefault(require("./routes/message.router"));
var conversation_router_1 = __importDefault(require("./routes/conversation.router"));
var agora_router_1 = __importDefault(require("./routes/agora.router"));
var constants_1 = require("./models/constants");
// const logger = createLogger('app.ts');
// _ is used as a variable name to ignore the fact that it's not read
// import loadEnvs from './shared/load-envs';
// const envs = loadEnvs([''], false);
var version;
try {
    version = require('../package.json').version;
}
catch (e) {
    console.error("Failed to load Version from package.json", e);
}
var App = /** @class */ (function () {
    function App(dbConnection) {
        this.dbConnection = dbConnection;
        this.app = (0, express_1.default)();
        this.app.io = require('socket.io')({
            cors: {
                origin: '*',
            }
        });
        dbConnection.connect();
        this.app.set('trust proxy', 1); // needed for rate limiter
        this.middleware();
        this.routes();
        this.createFolder();
    }
    App.prototype.createFolder = function () {
        // Create folder for uploading files.
        if (require.main) {
            var filesDir = path_1.default.join(path_1.default.dirname(require.main.filename), "uploads");
            if (!fs_1.default.existsSync(filesDir)) {
                fs_1.default.mkdirSync(filesDir);
            }
        }
    };
    App.prototype.middleware = function () {
        this.app.use(body_parser_1.default.json());
        this.app.use((0, cors_1.default)());
        this.app.use(express_http_context_1.default.middleware);
        this.app.use(request_ip_1.default.mw());
        this.app.use(constants_1.CONFIG.IMAGEURLNAME, express_1.default.static(constants_1.CONFIG.IMAGEDIR));
        this.app.use(constants_1.CONFIG.IMAGEURLNAME, express_1.default.static(constants_1.CONFIG.VIDEODIR));
        this.app.use(constants_1.CONFIG.IMAGEURLNAME, express_1.default.static(constants_1.CONFIG.FILEDIR));
        this.app.use(constants_1.CONFIG.IMAGEURLNAME, express_1.default.static(constants_1.CONFIG.UNTAGAUDIODIR));
        this.app.use(constants_1.CONFIG.IMAGEURLNAME, express_1.default.static(constants_1.CONFIG.TAGAUDIODIR));
        // default options
        this.app.use((0, express_fileupload_1.default)({
        // useTempFiles: true,
        // tempFileDir : path.basename('/profile-image'),
        // mimetype: "image/jpeg"
        }));
        this.app.use(function (error, req, res, next) {
            console.error('error.stack', error.stack);
            res.status(500).send('Something Broke!');
        });
        this.app.use(function (error, req, res, next) {
            res.status(error.status || 500).send({
                error: {
                    status: error.status || 500,
                    message: error.message || 'Something Broke!',
                },
            });
        });
    };
    App.prototype.routes = function () {
        var routes = require('./routes/socket.router')(this.app.io);
        this.app.use('/', routes);
        this.app.use('/v1/upload', upload_router_1.default.router);
        this.app.use('/v1/message', message_router_1.default.router);
        this.app.use('/v1/conversation', conversation_router_1.default.router);
        this.app.use('/v1/agora', agora_router_1.default.router);
    };
    return App;
}());
exports.App = App;
exports.default = new App(database_1.default).app;
