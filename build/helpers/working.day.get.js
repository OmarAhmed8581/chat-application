"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.__getWorkingDay = void 0;
var moment_1 = __importDefault(require("moment"));
function __getWorkingDay(date) {
    if ((0, moment_1.default)(date).day() == 0 || (0, moment_1.default)(date).day() == 6) {
        var dayCount = 1;
        while ((0, moment_1.default)(date).day() == 0 || (0, moment_1.default)(date).day() == 6) {
            date = (0, moment_1.default)(date).subtract(dayCount, 'day').format('YYYY-MM-DD');
        }
        return date;
    }
    else {
        return date;
    }
}
exports.__getWorkingDay = __getWorkingDay;
