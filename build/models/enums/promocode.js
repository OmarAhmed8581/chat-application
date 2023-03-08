"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promocodeValues = exports.promocodeTypes = void 0;
var promocodeTypes;
(function (promocodeTypes) {
    promocodeTypes["Percentage"] = "percentage";
    promocodeTypes["Amount"] = "amount";
})(promocodeTypes = exports.promocodeTypes || (exports.promocodeTypes = {}));
;
exports.promocodeValues = Object.keys(promocodeTypes).map(function (k) { return promocodeTypes[k]; });
