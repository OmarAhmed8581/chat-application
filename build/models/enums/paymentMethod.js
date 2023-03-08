"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethodStatusValues = exports.PaymentMethodStatus = void 0;
var PaymentMethodStatus;
(function (PaymentMethodStatus) {
    PaymentMethodStatus["CC"] = "credit_card";
    PaymentMethodStatus["CD"] = "cash_on_delivery";
})(PaymentMethodStatus = exports.PaymentMethodStatus || (exports.PaymentMethodStatus = {}));
;
exports.PaymentMethodStatusValues = Object.keys(PaymentMethodStatus).map(function (k) { return PaymentMethodStatus[k]; });
