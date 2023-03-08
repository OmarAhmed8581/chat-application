import * as express from 'express';

// middleware
import { sanitizeBody, sanitizeQuery, authentication, authorization, staticAuthentication, trimQueryWhiteSpace, trimBodyWhiteSpace } from '../middleware'
// controllers
import uploadController, { UploadController } from '../controllers/upload.controller';

// model or interfaces
import { IAuthenticatedResponse, IAuthorizedResponse } from '../models/interfaces';

import { Role } from '../models/enums';
import { asyncWrap } from '../shared/async-wrap';
import { BadRequestError, InternalServerError, NotFoundError } from '../errors';

export class UploadRouter {
    public router: express.Router;
    constructor(private uploadController: UploadController
    ) {
        this.router = express.Router();
        this.middleware();
        this.routes();
    }
    private middleware() { }
    private routes() {
        this.router.route("")
            .post(sanitizeBody, trimBodyWhiteSpace, authentication, authorization([Role.SuperAdmin, Role.Doctor, Role.User]),
                asyncWrap<IAuthorizedResponse>(async (req, res) => {
                    try {
                        // if (!req.files) {
                        //     return res.status(400).send(new BadRequestError(`File required`, {
                        //         message: `File required`,
                        //         i18n: 'fileRequired'
                        //     }));
                        // }

                        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
                        console.log(req.files);					
                        const selectedFile = req.files ?.selectedFile;
                        const { type } = req.query as any;
                        const url = await this.uploadController.upload(selectedFile, type);
                        return res.json({
                            url
                        });
                    } catch (error:any) {
                        console.log(error)
                        return res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
                    }
                }));
    }
}

export default new UploadRouter(uploadController);