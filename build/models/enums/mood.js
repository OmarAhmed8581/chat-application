"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moodValues = exports.moodTypes = void 0;
var moodTypes;
(function (moodTypes) {
    moodTypes["bouncy"] = "bouncy";
    moodTypes["dark"] = "dark";
    moodTypes["energetic"] = "energetic";
})(moodTypes = exports.moodTypes || (exports.moodTypes = {}));
;
exports.moodValues = Object.keys(moodTypes).map(function (k) { return moodTypes[k]; });
