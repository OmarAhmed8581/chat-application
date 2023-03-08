import mongoose, { Schema } from 'mongoose';


const MessageSchema = new Schema({
    conversationId: { type: String },
    senderId: { type: String },
    text: { type: String },
    type: { type: String, enum: ['text', 'file', 'image'], default: 'text' },
    mimeType: { type: String },
    name: { type: String },
    size: { type: Number },


    deleted: { type: Boolean, default: false },
    deactivated: { type: Boolean, default: false },
    createdAt: { type: Number },
    updatedAt: { type: Date }
});

export interface IMessage extends mongoose.Document {
    conversationId: string,
    senderId: string,
    text: string,
    type: string,
    mimeType: string,
    name: string,
    size: number,

    deleted: boolean,
    deactivated: boolean,
    createdAt: number,
    updatedAt: Date
};

export interface IMessageModel extends mongoose.Model<IMessage> {
    getClientFields: () => string[];
    getClientFieldsFilter: () => { [field: string]: boolean };
    getSearchableFields: () => string[];
    getSearchableFieldsFilter: () => { [field: string]: boolean };
}

MessageSchema.statics.getSearchableFields = function (): string[] {
    return [
        "_id",
        "conversationId",
        "senderId",
        "text",
        "type",
        "mimeType",
        "name",
        "size"
    ];
}

MessageSchema.statics.getClientFields = function (): string[] {
    return [
        "_id",
        "conversationId",
        "senderId",
        "text",
        "type",
        "mimeType",
        "name",
        "size",
        "deleted",
        "createdAt"
    ];
}
MessageSchema.statics.getClientFieldsFilter = function (): { [field: string]: true } {
    return Message.getClientFields().reduce((map, el) => { map[el] = true; return map }, {});
}
MessageSchema.statics.getSearchableFieldsFilter = function (): { [field: string]: true } {
    return Message.getSearchableFields().reduce((map: any, el) => { map[el] = true; return map }, {});
}

export const Message = mongoose.model<IMessage, IMessageModel>('Message', MessageSchema);