import express from 'express';
import body_parser from 'body-parser';
import httpContext from 'express-http-context';
import cors from 'cors';
import requestIp from 'request-ip';
import fileUpload from 'express-fileupload';
import path from 'path';
import fs from 'fs';

// Routes
import dbConnection, { DBConnection } from './config/database';
import UploadRouter from './routes/upload.router';
import MessageRouter from './routes/message.router';
import ConversationRouter from './routes/conversation.router';
import AgoraRouter from './routes/agora.router';

import { CONFIG } from './models/constants';

// const logger = createLogger('app.ts');

// _ is used as a variable name to ignore the fact that it's not read

// import loadEnvs from './shared/load-envs';
// const envs = loadEnvs([''], false);
let version: string;
try {
    version = require('../package.json').version;
} catch (e) {
    console.error("Failed to load Version from package.json", e);
}

export class App {

    public app: any;
    public io: any;
    constructor(private dbConnection: DBConnection) {
        this.app = express();
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

    private createFolder(): void {
        // Create folder for uploading files.
        if (require.main) {
            const filesDir = path.join(path.dirname(require.main.filename), "uploads");
            if (!fs.existsSync(filesDir)) {
                fs.mkdirSync(filesDir);
            }
        }
    }

    private middleware(): void {
        this.app.use(body_parser.json());
        this.app.use(cors());
        this.app.use(httpContext.middleware);
        this.app.use(requestIp.mw());
        this.app.use(CONFIG.IMAGEURLNAME, express.static(CONFIG.IMAGEDIR));
        this.app.use(CONFIG.IMAGEURLNAME, express.static(CONFIG.VIDEODIR));
        this.app.use(CONFIG.IMAGEURLNAME, express.static(CONFIG.FILEDIR));
        this.app.use(CONFIG.IMAGEURLNAME, express.static(CONFIG.UNTAGAUDIODIR));
        this.app.use(CONFIG.IMAGEURLNAME, express.static(CONFIG.TAGAUDIODIR));

        // default options
        this.app.use(fileUpload({
            // useTempFiles: true,
            // tempFileDir : path.basename('/profile-image'),
            // mimetype: "image/jpeg"
        }));
        this.app.use((error: any, req: any, res: any, next: any) => {
            console.error('error.stack', error.stack);
            res.status(500).send('Something Broke!');
        });
        this.app.use((error: any, req: any, res: any, next: any) => {
            res.status(error.status || 500).send({
                error: {
                    status: error.status || 500,
                    message: error.message || 'Something Broke!',
                },
            });
        });
    }

    private routes(): void {
        var routes = require('./routes/socket.router')(this.app.io);
        this.app.use('/', routes);
        this.app.use('/v1/upload', UploadRouter.router);
        this.app.use('/v1/message', MessageRouter.router);
        this.app.use('/v1/conversation', ConversationRouter.router);
        this.app.use('/v1/agora', AgoraRouter.router);

    }
}

export default new App(dbConnection).app;
