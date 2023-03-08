import mongoose, { Schema } from 'mongoose';


const ConversationSchema = new Schema({
    members: [{ type: String }],
    conversationId: { type: String },
    agentId: { type: String },
    userId: { type: String },

    deleted: { type: Boolean, default: false },
    deactivated: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

export interface IConversation extends mongoose.Document {
    members: string[],
    agentId: string,
    userId: string,
    conversationId: string,

    deleted: boolean,
    deactivated: boolean,
    createdAt: Date,
    updatedAt: Date
};

export interface IConversationModel extends mongoose.Model<IConversation> {
    getClientFields: () => string[];
    getClientFieldsFilter: () => { [field: string]: boolean };
    getSearchableFields: () => string[];
    getSearchableFieldsFilter: () => { [field: string]: boolean };
}

ConversationSchema.statics.getSearchableFields = function (): string[] {
    return [
        "_id",
        "members",
        "agentId",
        "userId",
        "conversationId",
        "doctor.userName",
        "doctor.fullName",
        "user.userName",
        "user.fullName",
    ];
}

ConversationSchema.statics.getClientFields = function (): string[] {
    return [
        "_id",
        "members",
        "agentId",
        "userId",
        "deleted",
        "createdAt",
        "conversationId",
        "doctor.userName",
        "doctor.fullName",
        "user.userName",
        "user.fullName",
    ];
}
ConversationSchema.statics.getClientFieldsFilter = function (): { [field: string]: true } {
    return Conversation.getClientFields().reduce((map, el) => { map[el] = true; return map }, {});
}
ConversationSchema.statics.getSearchableFieldsFilter = function (): { [field: string]: true } {
    return Conversation.getSearchableFields().reduce((map: any, el) => { map[el] = true; return map }, {});
}

export const Conversation = mongoose.model<IConversation, IConversationModel>('Conversation', ConversationSchema);