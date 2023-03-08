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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
var path = __importStar(require("path"));
var fs_1 = __importDefault(require("fs"));
var constants_1 = require("../models/constants");
var shared_1 = require("../shared");
var errors_1 = require("../errors");
var enums_1 = require("../models/enums");
var UploadController = /** @class */ (function () {
    function UploadController() {
    }
    UploadController.prototype.upload = function (selectedFile, type) {
        return __awaiter(this, void 0, void 0, function () {
            var index, ext, extensions, dir, f_name, file_name, uploaded, url, thumbUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        index = enums_1.FileTypeValues.indexOf(type);
                        if (index === -1) {
                            throw new errors_1.BadRequestError("Invalid type, should be in ".concat(enums_1.FileTypeValues), {
                                message: "Invalid type, should be in ".concat(enums_1.FileTypeValues)
                            });
                        }
                        ext = path.extname(selectedFile.name);
                        extensions = constants_1.CONFIG.imageExtensions;
                        dir = constants_1.CONFIG.IMAGEDIR;
                        if (type === enums_1.FileType.video) {
                            extensions = constants_1.CONFIG.videoExtensions;
                            dir = constants_1.CONFIG.VIDEODIR;
                        }
                        else if (type === enums_1.FileType.untaggedAudio) {
                            extensions = constants_1.CONFIG.audioExtensions;
                            dir = constants_1.CONFIG.UNTAGAUDIODIR;
                        }
                        else if (type === enums_1.FileType.taggedAudio) {
                            extensions = constants_1.CONFIG.audioExtensions;
                            dir = constants_1.CONFIG.TAGAUDIODIR;
                        }
                        else if (type === enums_1.FileType.file) {
                            extensions = constants_1.CONFIG.fileExtensions;
                            dir = constants_1.CONFIG.FILEDIR;
                        }
                        if (extensions.indexOf(ext.toLowerCase()) === -1) {
                            throw new errors_1.BadRequestError("Invalid type, should be ".concat(extensions), {
                                message: "Invalid type, should be ".concat(extensions)
                            });
                        }
                        f_name = "".concat(Date.now(), "_").concat((0, shared_1.randomString)());
                        file_name = "".concat(f_name).concat(ext);
                        if (!fs_1.default.existsSync("./".concat(dir))) {
                            fs_1.default.mkdirSync("./".concat(dir));
                        }
                        return [4 /*yield*/, selectedFile.mv("./".concat(dir, "/").concat(file_name))];
                    case 1:
                        uploaded = _a.sent();
                        url = "".concat(constants_1.CONFIG.IMAGEBASEURL).concat(constants_1.CONFIG.IMAGEURLNAME, "/").concat(file_name);
                        thumbUrl = "".concat(constants_1.CONFIG.IMAGEBASEURL).concat(constants_1.CONFIG.IMAGEURLNAME, "/").concat(f_name, ".jpg");
                        // if (type === FileType.video) {
                        //     try {
                        //         await genThumbnail(url, `./${dir}/${f_name}.jpg`, '40%', {
                        //             path: ffmpeg.path
                        //         });
                        //         console.log('Done!');
                        //         return `${thumbUrl},${url}`;
                        //     } catch (err) {
                        //         console.log('thumbfile err', err)
                        //         throw new BadRequestError(`Thumb file not created`, {
                        //             message: `Thumb file not created`
                        //         });
                        //     }
                        // } else {
                        return [2 /*return*/, url];
                }
            });
        });
    };
    return UploadController;
}());
exports.UploadController = UploadController;
exports.default = new UploadController();
