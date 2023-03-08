"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genreValues = exports.genreTypes = void 0;
var genreTypes;
(function (genreTypes) {
    genreTypes["hiphop"] = "hiphop";
    genreTypes["pop"] = "pop";
    genreTypes["trap"] = "trap";
})(genreTypes = exports.genreTypes || (exports.genreTypes = {}));
;
exports.genreValues = Object.keys(genreTypes).map(function (k) { return genreTypes[k]; });
