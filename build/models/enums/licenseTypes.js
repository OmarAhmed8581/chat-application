"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.licenseValues = exports.licenseTypes = void 0;
var licenseTypes;
(function (licenseTypes) {
    licenseTypes["free"] = "free";
    licenseTypes["basic"] = "basic";
    licenseTypes["premium"] = "premium";
    licenseTypes["premiumStem"] = "premiumStem";
})(licenseTypes = exports.licenseTypes || (exports.licenseTypes = {}));
;
exports.licenseValues = Object.keys(licenseTypes).map(function (k) { return licenseTypes[k]; });
