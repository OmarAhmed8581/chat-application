import * as express from "express";

// middleware
import {
    sanitizeBody,
    sanitizeQuery,
    authentication,
    authorization,
    staticAuthentication,
    trimQueryWhiteSpace,
    trimBodyWhiteSpace,
} from "../middleware";
// controllers
import messageController, { MessageController } from "../controllers/message.controller";
// model or interfaces
import {
    IAuthenticatedResponse,
    IAuthorizedResponse,
} from "../models/interfaces";

import { asyncWrap } from "../shared/async-wrap";
import { BadRequestError, InternalServerError, NotFoundError } from "../errors";
import { Role } from "../models/enums";
import { Pagination } from "../models/shared";

export class MessageRouter {
    public router: express.Router;
    constructor(private messageController: MessageController) {
        this.router = express.Router();
        this.middleware();
        this.routes();
    }
    private middleware() { }

    private async get(req, res) {
        try {
            const { search, type, sortKey, isId } = req.query as any;
            const contacts = await this.messageController.get(search, type, isId, sortKey, await Pagination.pagination(req));
            contacts === null
                ? res.status(404).send(
                    new NotFoundError(`No record found`, {
                        message: `No record found`,
                        i18n: "notExist",
                    })
                )
                : res.json(contacts);
        } catch (error: any) {
            res
                .status(error.status || 500)
                .send(
                    !error.status ? new InternalServerError("Something wrong") : error
                );
        }
    }

    private async getBy(req, res) {
        try {
            const { search } = req.query as any;
            const contact = await this.messageController.getBy(search);
            contact === null
                ? res.status(404).send(
                    new NotFoundError(`No record found`, {
                        message: `No record found`,
                        i18n: "notExist",
                    })
                )
                : res.json(contact);
        } catch (error: any) {
            res
                .status(error.status || 500)
                .send(
                    !error.status ? new InternalServerError("Something wrong") : error
                );
        }
    }

    private async create(req, res) {
        try {
            const result = await this.messageController.create({ payload: req.body });
            res.json(result);
        } catch (error: any) {
            res
                .status(error.status || 500)
                .send(
                    !error.status ? new InternalServerError("Something wrong") : error
                );
        }
    }

    private async edit(req, res) {
        try {
            var { search } = req.query as any;
            const result = await this.messageController.edit({
                query: { id: search },
                payload: req.body,
            });
            res.json(result);
        } catch (error: any) {
            res
                .status(error.status || 500)
                .send(
                    !error.status ? new InternalServerError("Something wrong") : error
                );
        }
    }

    private async delete(req, res) {
        try {
            const query = req.query as any;
            const result = await this.messageController.delete({ query: query });
            res.json(result);
        } catch (error: any) {
            res
                .status(error.status || 500)
                .send(
                    !error.status ? new InternalServerError("Something wrong") : error
                );
        }
    }

    private routes() {
        this.router.route("/get").get(
            sanitizeQuery,
            trimQueryWhiteSpace,
            authentication,
            authorization([Role.User, Role.Doctor]),
            asyncWrap<IAuthorizedResponse>(async (req, res) => {
                await this.get(req, res);
            })
        );

        this.router.route("/get-by").get(
            sanitizeQuery,
            trimQueryWhiteSpace,
            authentication,
            authorization([Role.User, Role.Doctor]),
            asyncWrap<IAuthorizedResponse>(async (req, res) => {
                await this.getBy(req, res);
            })
        );

        this.router.route("/create").post(
            sanitizeBody,
            trimBodyWhiteSpace,
            authentication,
            authorization([Role.User, Role.Doctor]),
            asyncWrap<IAuthorizedResponse>(async (req, res) => {
                await this.create(req, res);
            })
        );

        this.router.route("/edit").post(
            sanitizeBody,
            trimBodyWhiteSpace,
            authentication,
            authorization([Role.User, Role.Doctor]),
            asyncWrap<IAuthorizedResponse>(async (req, res) => {
                await this.edit(req, res);
            })
        );

        this.router.route("/delete").get(
            sanitizeQuery,
            trimQueryWhiteSpace,
            sanitizeBody,
            trimBodyWhiteSpace,
            authentication,
            authorization([Role.User, Role.Doctor]),
            asyncWrap<IAuthorizedResponse>(async (req, res) => {
                await this.delete(req, res);
            })
        );
    }
}

export default new MessageRouter(messageController);
