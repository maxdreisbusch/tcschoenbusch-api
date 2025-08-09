"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/databaseTypes.ts
var databaseTypes_exports = {};
__export(databaseTypes_exports, {
  AbonnementStatus: () => AbonnementStatus,
  NotificationSeverity: () => NotificationSeverity,
  PermissionState: () => PermissionState,
  ReservationRuleCheckOn: () => ReservationRuleCheckOn,
  ReservationStatus: () => ReservationStatus,
  ReservationType: () => ReservationType,
  TeamCategory: () => TeamCategory,
  TransactionReason: () => TransactionReason
});
module.exports = __toCommonJS(databaseTypes_exports);

// src/db/databaseTypes.ts
var ReservationType = /* @__PURE__ */ ((ReservationType2) => {
  ReservationType2["TOURNAMENT"] = "TOURNAMENT";
  ReservationType2["MAINTENANCE"] = "MAINTENANCE";
  ReservationType2["TEAM_PRACTICE"] = "TEAM_PRACTICE";
  ReservationType2["TEAM_COMPETITION"] = "TEAM_COMPETITION";
  return ReservationType2;
})(ReservationType || {});
var ReservationStatus = /* @__PURE__ */ ((ReservationStatus2) => {
  ReservationStatus2["REQUESTED"] = "REQUESTED";
  ReservationStatus2["BILLED"] = "BILLED";
  ReservationStatus2["APPROVED"] = "APPROVED";
  return ReservationStatus2;
})(ReservationStatus || {});
var ReservationRuleCheckOn = /* @__PURE__ */ ((ReservationRuleCheckOn2) => {
  ReservationRuleCheckOn2["CREATE"] = "CREATE";
  ReservationRuleCheckOn2["UPDATE"] = "UPDATE";
  ReservationRuleCheckOn2["DELETE"] = "DELETE";
  return ReservationRuleCheckOn2;
})(ReservationRuleCheckOn || {});
var AbonnementStatus = /* @__PURE__ */ ((AbonnementStatus2) => {
  AbonnementStatus2["REQUESTED"] = "REQUESTED";
  AbonnementStatus2["APPROVED"] = "APPROVED";
  AbonnementStatus2["BILLED"] = "BILLED";
  AbonnementStatus2["PAID"] = "PAID";
  AbonnementStatus2["DELETED"] = "DELETED";
  return AbonnementStatus2;
})(AbonnementStatus || {});
var PermissionState = /* @__PURE__ */ ((PermissionState2) => {
  PermissionState2["NONE"] = "NONE";
  PermissionState2["OWN"] = "OWN";
  PermissionState2["ALL"] = "ALL";
  return PermissionState2;
})(PermissionState || {});
var TransactionReason = /* @__PURE__ */ ((TransactionReason2) => {
  TransactionReason2["HALLENCARD_RECHARGE"] = "HALLENCARD_RECHARGE";
  TransactionReason2["INVOICE"] = "INVOICE";
  TransactionReason2["ONLINE_PAYMENT"] = "ONLINE_PAYMENT";
  TransactionReason2["BANK_TRANSFER"] = "BANK_TRANSFER";
  TransactionReason2["COURT_RESERVATION"] = "COURT_RESERVATION";
  TransactionReason2["COURT_RESERVATION_STORNO"] = "COURT_RESERVATION_STORNO";
  TransactionReason2["REFUND"] = "REFUND";
  TransactionReason2["DONATION"] = "DONATION";
  return TransactionReason2;
})(TransactionReason || {});
var TeamCategory = /* @__PURE__ */ ((TeamCategory2) => {
  TeamCategory2["Men"] = "Men";
  TeamCategory2["Women"] = "Women";
  TeamCategory2["Youth"] = "Youth";
  return TeamCategory2;
})(TeamCategory || {});
var NotificationSeverity = /* @__PURE__ */ ((NotificationSeverity2) => {
  NotificationSeverity2["ERROR"] = "ERROR";
  NotificationSeverity2["WARNING"] = "WARNING";
  NotificationSeverity2["INFO"] = "INFO";
  NotificationSeverity2["SUCCESS"] = "SUCCESS";
  return NotificationSeverity2;
})(NotificationSeverity || {});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AbonnementStatus,
  NotificationSeverity,
  PermissionState,
  ReservationRuleCheckOn,
  ReservationStatus,
  ReservationType,
  TeamCategory,
  TransactionReason
});
//# sourceMappingURL=databaseTypes.js.map