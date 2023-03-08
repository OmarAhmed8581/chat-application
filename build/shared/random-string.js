"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genRand = exports.randomString = void 0;
function randomString() {
    var s = (Math.floor(1000 + Math.random() * 9000));
    return s;
}
exports.randomString = randomString;
var genRand = function (len) {
    return Math.random().toString(36).substring(2, len + 2);
};
exports.genRand = genRand;
