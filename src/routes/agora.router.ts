import * as express from "express";

// middleware
import {
    sanitizeBody,
    authentication,
    authorization,
    trimBodyWhiteSpace,
} from "../middleware";
import { RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole } from 'agora-access-token'
// controllers
// model or interfaces
import {
    IAuthorizedResponse,
} from "../models/interfaces";

import { asyncWrap } from "../shared/async-wrap";
import { InternalServerError } from "../errors";

import { CONFIG } from "../models/constants";

export class AgoraRouter {
    public router: express.Router;
    constructor() {
        this.router = express.Router();
        this.middleware();
        this.routes();
    }
    private middleware() { }

    private async create(req, res) {
        try {
            const { channelName, userId } = req.query as any;
            const appID = CONFIG.AGORAAPPID;
            const appCertificate = CONFIG.AGORACERTIFICATE;
            const account = userId;
            const role = RtcRole.PUBLISHER;

            const expirationTimeInSeconds = 3600

            const currentTimestamp = Math.floor(Date.now() / 1000)

            const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

            const tokenB = RtcTokenBuilder.buildTokenWithAccount(appID, appCertificate, channelName, account, role, privilegeExpiredTs);
            return res.json({ token: tokenB });
        } catch (error: any) {
            res
                .status(error.status || 500)
                .send(
                    !error.status ? new InternalServerError("Something wrong") : error
                );
        }
    }

    private routes() {


        this.router.route("/create").get(
            sanitizeBody,
            trimBodyWhiteSpace,
            authentication,
            authorization(),
            asyncWrap<IAuthorizedResponse>(async (req, res) => {
                await this.create(req, res);
            })
        );
    }
}

export default new AgoraRouter();
