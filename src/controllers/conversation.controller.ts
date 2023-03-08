import mongoose, { Schema } from 'mongoose';
import { Conversation, IConversation } from '../models/conversation.model';
import { Role, SearchType, Sort, SortValues } from '../models/enums';
import { UnauthorizedError, BadRequestError, InternalServerError, NotFoundError, ForbiddenError, ConflictError } from "../errors";
import moment from 'moment';

interface CreateConversationRequest {
    payload: {
        members: string[],
        agentId: string,
        userId: string,
        conversationId: string,

    }
}

interface CreateOrUpdateConversationRequest {
    query: {
        search?: string
        id?: string
    },
    payload: {
        members?: string[],
        agentId?: string,
        userId?: string,
        conversationId?: string,

    }
}


export class ConversationController {
    constructor() { }

    async get(search: string, type: SearchType, isId: boolean | undefined, sortKey: Sort, pageOptions, date: string | undefined): Promise<IConversation[] | null> {
        let query = {};
        const filter = Conversation.getSearchableFieldsFilter();
        let searchRegExp

        if (search !== undefined && typeof search === 'string') {
            searchRegExp = new RegExp(search, 'ig');
        }
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
        return this.returnGetResponse(query, sortKey, pageOptions, date);
    }

    async getBy(userId: string, maulanaId: string): Promise<IConversation | null> {
        let query = [userId, maulanaId]
        return await this.returnGetByResponse(query);
    }

    async create({ payload }: CreateConversationRequest) {
        if (!payload.members) {
            throw new BadRequestError(`Validate fields members`, {
                Conversation: `Requiered Fields members`,
            });
        }
        const data = new Conversation({
            ...payload
        });
        await data.save();
        return data;
    }

    async edit({ query, payload }: CreateOrUpdateConversationRequest) {
        if (!query.id) {
            throw new BadRequestError('Id required', {
                Conversation: 'Id required',
            });
        }
        var data = await this._findConversation(query.id);
        if (data === null) {
            throw new NotFoundError("Conversation not found", {
                Conversation: 'Conversation not found',
                i18n: 'notFound'
            });
        }
        const updateDoc = {
            ...payload
        };
        const _query = { _id: data._id };
        const result = await Conversation.findOneAndUpdate(_query, updateDoc, {
            upsert: true, new: true, useFindAndModify: false
        }) as unknown as IConversation;
        if (result === null) {
            throw new BadRequestError('Conversation not edited correctly, Try to edit again', {
                Conversation: 'Conversation not edited correctly, Try to edit again',
            });
        } else {
            return result;
        }
    }

    async delete({ query }) {
        if (!query.id) {
            throw new BadRequestError('Id required', {
                Conversation: 'Id required',
            });
        }
        var data = await this._findConversation(query.id);
        if (data === null) {
            throw new NotFoundError("Conversation not found", {
                Conversation: 'Conversation not found',
                i18n: 'notFound'
            });
        }
        const _query = { _id: query.id };
        data = await Conversation.findOneAndUpdate(_query, { 'deleted': true }, { upsert: true, new: true, useFindAndModify: false }) as unknown as IConversation;
        if (data === null) {
            throw new BadRequestError('Conversation not deleted correctly, Try to delete again', {
                Conversation: 'Conversation not deleted correctly, Try to delete again',
            });
        } else {
            return data;
        }
    }

    async _findConversation(search: string) {
        let query = { $or: [{ 'conversationId': search }] };
        query = { $and: [{ 'deleted': false }, query] } as any;
        return await Conversation.findOne(query);
    }

    async returnGetResponse(query, sortKey, pageOptions, date): Promise<IConversation[] | null> {
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
        if (date == 'Day') {
            query = {
                $and: [{
                    createdAt: {
                        $gte: new Date(moment().subtract(1, 'day').toISOString()),
                        $lte: new Date()
                    }
                }, query]

            }
        }
        query = { $and: [{ 'deleted': false }, query] };
        let data = await Conversation.aggregate([{
            $facet: {
                paginatedResult: [
                    { $match: query },
                    { $sort: sort },
                    // { $skip: (pageOptions.limit * pageOptions.page) - pageOptions.limit },
                    // { $limit: pageOptions.limit },


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
        let data: any = await Conversation.find({ members: { $all: query } })
        data = data.length > 0 ? data[0] : null;
        return data;
    }
}
export default new ConversationController();
