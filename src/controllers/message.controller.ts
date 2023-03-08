import mongoose, { Schema } from 'mongoose';
import { Message, IMessage } from '../models/message.model';
import { Role, SearchType, Sort, SortValues } from '../models/enums';
import { UnauthorizedError, BadRequestError, InternalServerError, NotFoundError, ForbiddenError, ConflictError } from "../errors";

interface CreateMessageMessage {
    payload: {
        conversationId: string,
        senderId: string,
        text: string,
        type: string,
        mimeType: string,
        name: string,
        size: number,
        createdAt?: number,
    }
}

interface CreateOrUpdateMessageMessage {
    query: {
        search?: string
        id?: string
    },
    payload: {
        conversationId?: string,
        senderId?: string,
        type?: string,
        text?: string,
        mimeType?: string,
        name?: string,
        size?: number,

    }
}


export class MessageController {
    constructor() { }

    async get(search: string, type: SearchType, isId: boolean | undefined, sortKey: Sort, pageOptions): Promise<IMessage[] | null> {
        let query = {};
        const filter = Message.getSearchableFieldsFilter();
        if (search !== undefined && typeof search === 'string') {
            const searchRegExp = new RegExp(search.split(' ').join('|'), 'ig');
            const searchableFields = Object.keys(filter)
            if (isId) {
                query['$or'] = searchableFields.map(field => {
                    return !type ? { [field]: mongoose.Types.ObjectId(search) } : type === SearchType.Multi ? { [field]: searchRegExp } : { [field]: search };
                })
            } else {
                query['$or'] = searchableFields.map(field => {
                    return !type ? { [field]: search } : type === SearchType.Multi ? { [field]: searchRegExp } : { [field]: search };
                })
            }
        }
        return this.returnGetResponse(query, sortKey, pageOptions);
    }

    async getBy(search: string): Promise<IMessage | null> {
        let query = { _id: mongoose.Types.ObjectId(search) };
        return await this.returnGetByResponse(query);
    }

    async create({ payload }: CreateMessageMessage) {
        if (!payload.senderId || !payload.conversationId) {
            throw new BadRequestError(`Validate fields senderId and conversationId`, {
                message: `Requiered Fields senderId and conversationId`,
            });
        }
        const data = new Message({
            ...payload
        });
        await data.save();
        return data;
    }

    async edit({ query, payload }: CreateOrUpdateMessageMessage) {
        if (!query.id) {
            throw new BadRequestError('Id required', {
                message: 'Id required',
            });
        }
        var data = await this._findMessage(query.id);
        if (data === null) {
            throw new NotFoundError("Message not found", {
                message: 'Message not found',
                i18n: 'notFound'
            });
        }
        const updateDoc = {
            ...payload
        };
        const _query = { _id: data._id };
        const result = await Message.findOneAndUpdate(_query, updateDoc, {
            upsert: true, new: true, useFindAndModify: false
        }) as unknown as IMessage;
        if (result === null) {
            throw new BadRequestError('Message not edited correctly, Try to edit again', {
                message: 'Message not edited correctly, Try to edit again',
            });
        } else {
            return result;
        }
    }

    async delete({ query }) {
        if (!query.id) {
            throw new BadRequestError('Id required', {
                message: 'Id required',
            });
        }
        var data = await this._findMessage(query.id);
        if (data === null) {
            throw new NotFoundError("Message not found", {
                message: 'Message not found',
                i18n: 'notFound'
            });
        }
        const _query = { _id: query.id };
        data = await Message.findOneAndUpdate(_query, { 'deleted': true }, { upsert: true, new: true, useFindAndModify: false }) as unknown as IMessage;
        if (data === null) {
            throw new BadRequestError('Message not deleted correctly, Try to delete again', {
                message: 'Message not deleted correctly, Try to delete again',
            });
        } else {
            return data;
        }
    }

    async _findMessage(search: string) {
        let query = { $or: [{ '_id': mongoose.Types.ObjectId(search) }] };
        query = { $and: [{ 'deleted': false }, query] } as any;
        return await Message.findOne(query);
    }

    async returnGetResponse(query, sortKey, pageOptions): Promise<IMessage[] | null> {
        var sort = { createdAt: -1 } as any;
        if (sortKey) {
            const index = await SortValues.indexOf(sortKey);
            if (index === -1) {
                throw new BadRequestError(`Enter valid sorting options, Should be in ${SortValues}`, {
                    message: `Enter valid sorting options, Should be in ${SortValues}`
                });
            }
            if (sortKey === Sort.ALPHA) {
                sort = { fullName: 1 };
            } else if (sortKey === Sort.DESC) {
                sort = { createdAt: 1 };
            }
        }
        query = { $and: [{ 'deleted': false }, query] };
        let data = await Message.aggregate([{
            $facet: {
                paginatedResult: [
                    { $match: query },
                    { $sort: sort },
                    { $skip: (pageOptions.limit * pageOptions.page) - pageOptions.limit },
                    { $limit: pageOptions.limit },
                ],
                totalCount: [
                    { $match: query },
                    { $count: 'totalCount' }
                ]
            }
        },
        {
            $project: {
                "result": "$paginatedResult",
                "totalCount": { $ifNull: [{ $arrayElemAt: ["$totalCount.totalCount", 0] }, 0] },
            }
        }]);
        data = data.length > 0 ? data[0] : null;
        return data;
    }

    async returnGetByResponse(query): Promise<any | null> {
        query = { $and: [{ 'deleted': false }, query] };
        let data = await Message.aggregate([{
            $facet: {
                Message: [
                    { $match: query }
                ]
            }
        },
        {
            $project: {
                "Message": { $ifNull: [{ $arrayElemAt: ["$Message", 0] }, null] }
            }
        }]);
        data = data.length > 0 ? data[0] : null;
        return data;
    }
}
export default new MessageController();
