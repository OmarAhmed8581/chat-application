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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var MessageSchema = new mongoose_1.Schema({
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
;
MessageSchema.statics.getSearchableFields = function () {
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
};
MessageSchema.statics.getClientFields = function () {
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
};
MessageSchema.statics.getClientFieldsFilter = function () {
    return exports.Message.getClientFields().reduce(function (map, el) { map[el] = true; return map; }, {});
};
MessageSchema.statics.getSearchableFieldsFilter = function () {
    return exports.Message.getSearchableFields().reduce(function (map, el) { map[el] = true; return map; }, {});
};
exports.Message = mongoose_1.default.model('Message', MessageSchema);
