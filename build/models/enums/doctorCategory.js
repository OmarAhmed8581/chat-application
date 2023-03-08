"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryValues = exports.categoryTypes = void 0;
var categoryTypes;
(function (categoryTypes) {
    categoryTypes["GPInHouse"] = "GP_In_House";
    categoryTypes["GPOutBound"] = "GP_Out_Bound";
    categoryTypes["Consultant"] = "Consultant";
})(categoryTypes = exports.categoryTypes || (exports.categoryTypes = {}));
;
exports.categoryValues = Object.keys(categoryTypes).map(function (k) { return categoryTypes[k]; });
