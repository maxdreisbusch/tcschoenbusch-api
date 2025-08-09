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

// packages/frontendUtils.ts
var frontendUtils_exports = {};
__export(frontendUtils_exports, {
  ApplicationDialogPermission: () => ApplicationDialogPermission,
  AvailableRuleCheckPlugins: () => AvailableRuleCheckPlugins,
  addDays: () => addDays,
  addHours: () => addHours,
  addMinutes: () => addMinutes,
  compareAsc: () => compareAsc,
  currencyFormatter: () => currencyFormatter,
  differenceInMinutes: () => differenceInMinutes,
  endOfDay: () => endOfDay,
  format: () => format,
  formatDate: () => formatDate,
  formatTime: () => formatTime,
  getAvailableTimeSlots: () => getAvailableTimeSlots,
  getHighestPermissionState: () => getHighestPermissionState,
  getHours: () => getHours,
  getIntervalFromJsDate: () => getIntervalFromJsDate,
  getNetFromGross: () => getNetFromGross,
  getTaxValueFromGross: () => getTaxValueFromGross,
  getZeroBasedWeekdayInteger: () => getZeroBasedWeekdayInteger,
  isActivePeriod: () => isActivePeriod,
  isAfter: () => isAfter,
  isBefore: () => isBefore,
  startOfDay: () => startOfDay,
  subDays: () => subDays,
  subHours: () => subHours,
  subMinutes: () => subMinutes
});
module.exports = __toCommonJS(frontendUtils_exports);

// src/utils/logic/permissions.ts
var import_client = require("@prisma/client");
var getHighestPermissionState = (states) => {
  let result = import_client.PermissionState.NONE;
  for (const permission of states) {
    if (permission.allowed === import_client.PermissionState.ALL) return import_client.PermissionState.ALL;
    if (permission.allowed === import_client.PermissionState.OWN) result = import_client.PermissionState.OWN;
    if (permission.allowed === import_client.PermissionState.NONE) continue;
  }
  return result;
};

// src/utils/logic/date.ts
var import_luxon = require("luxon");
import_luxon.Settings.defaultLocale = "de";
import_luxon.Settings.defaultZone = "Europe/Berlin";
var addDays = (date, amount) => import_luxon.DateTime.fromJSDate(date).plus({ day: amount }).toJSDate();
var subDays = (date, amount) => import_luxon.DateTime.fromJSDate(date).minus({ day: amount }).toJSDate();
var addHours = (date, amount) => import_luxon.DateTime.fromJSDate(date).plus({ hour: amount }).toJSDate();
var subHours = (date, amount) => import_luxon.DateTime.fromJSDate(date).minus({ hour: amount }).toJSDate();
var addMinutes = (date, amount) => import_luxon.DateTime.fromJSDate(date).plus({ minute: amount }).toJSDate();
var subMinutes = (date, amount) => import_luxon.DateTime.fromJSDate(date).minus({ minute: amount }).toJSDate();
var differenceInMinutes = (end, start) => import_luxon.DateTime.fromJSDate(start).diff(import_luxon.DateTime.fromJSDate(end), ["minutes", "seconds", "milliseconds"]).minutes;
var format = (date, format2) => import_luxon.DateTime.fromJSDate(date).toFormat(format2);
var formatDate = (date) => format(date, "dd.MM.yyyy");
var formatTime = (date) => format(date, "H:mm");
var getHours = (date) => format(date, "Hmm");
var isActivePeriod = (date, data) => {
  if (!data || !data.activeFrom || !data.activeTo) return false;
  if (isBefore(date, data.activeFrom) || isAfter(date, data.activeTo)) return true;
  return false;
};
var getIntervalFromJsDate = (firstDate, secondDate) => {
  const fd = import_luxon.DateTime.fromJSDate(firstDate);
  const sd = import_luxon.DateTime.fromJSDate(secondDate);
  return import_luxon.Interval.fromDateTimes(fd, sd);
};
var isBefore = (firstDate, secondDate) => import_luxon.DateTime.fromJSDate(firstDate) < import_luxon.DateTime.fromJSDate(secondDate);
var isAfter = (firstDate, secondDate) => import_luxon.DateTime.fromJSDate(firstDate) > import_luxon.DateTime.fromJSDate(secondDate);
var compareAsc = (firstDate, secondDate) => {
  const result = import_luxon.DateTime.fromJSDate(firstDate).toSeconds() - import_luxon.DateTime.fromJSDate(secondDate).toSeconds();
  return result < 0 ? -1 : result > 0 ? 1 : 0;
};
var startOfDay = (date) => import_luxon.DateTime.fromJSDate(date).startOf("day").toJSDate();
var endOfDay = (date) => import_luxon.DateTime.fromJSDate(date).endOf("day").toJSDate();
var zeroBasedWeekDayIntegers = [1, 2, 3, 4, 5, 6, 0];
var getZeroBasedWeekdayInteger = (date) => zeroBasedWeekDayIntegers[import_luxon.DateTime.fromJSDate(date).get("weekday") - 1] ?? 1;

// src/utils/logic/reservation.ts
var import_luxon2 = require("luxon");
var getAvailableTimeSlots = (startTime, maxEndTime, nextBookingStart) => {
  let theTime = import_luxon2.DateTime.fromJSDate(maxEndTime).set({
    year: startTime.getFullYear(),
    month: startTime.getMonth() + 1,
    day: startTime.getDate()
  }).toJSDate();
  if (nextBookingStart && isAfter(theTime, nextBookingStart)) {
    theTime = nextBookingStart;
  }
  const timeslots = [];
  let currentDifference = 0.5;
  for (let addTime = addMinutes(startTime, 30); differenceInMinutes(addTime, theTime) >= 0; addTime = addMinutes(addTime, 30)) {
    timeslots.push({
      label: `${format(addTime, "HH:mm")} (${currentDifference.toString().replace(".", ",")} Stunden)`,
      value: currentDifference.toString()
    });
    currentDifference = currentDifference + 0.5;
  }
  return timeslots;
};

// src/utils/logic/applicationDialogPermissions.ts
var ApplicationDialogPermission = /* @__PURE__ */ ((ApplicationDialogPermission2) => {
  ApplicationDialogPermission2["REPEATED_RESERVATIONS"] = "repeatedReservations";
  ApplicationDialogPermission2["MULTIPLE_COURT_RESERVATIONS"] = "multipleCourtReservations";
  ApplicationDialogPermission2["RESERVATION_SETTINGS"] = "reservationSettings";
  ApplicationDialogPermission2["DELETE_BOOKING"] = "deleteBooking";
  return ApplicationDialogPermission2;
})(ApplicationDialogPermission || {});

// src/utils/ruleCheckPlugins/type.ts
var AvailableRuleCheckPlugins = /* @__PURE__ */ ((AvailableRuleCheckPlugins2) => {
  AvailableRuleCheckPlugins2["maxTimeBefore"] = "maxTimeBefore";
  AvailableRuleCheckPlugins2["minTimeBefore"] = "minTimeBefore";
  AvailableRuleCheckPlugins2["minDuration"] = "minDuration";
  AvailableRuleCheckPlugins2["maxDuration"] = "maxDuration";
  AvailableRuleCheckPlugins2["maxBookingsAtSameTime"] = "maxBookingsAtSameTime";
  return AvailableRuleCheckPlugins2;
})(AvailableRuleCheckPlugins || {});

// src/utils/logic/currency.ts
var currencyFormatter = new Intl.NumberFormat("de-DE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

// src/utils/logic/taxes.ts
var getNetFromGross = (grossPrice, taxRate = 19) => {
  const vat = taxRate / 100;
  return +(grossPrice / (1 + vat)).toFixed(2);
};
var getTaxValueFromGross = (gross, taxRate = 19) => {
  const vat = taxRate / 100;
  return +(gross * vat / (1 + vat)).toFixed(2);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ApplicationDialogPermission,
  AvailableRuleCheckPlugins,
  addDays,
  addHours,
  addMinutes,
  compareAsc,
  currencyFormatter,
  differenceInMinutes,
  endOfDay,
  format,
  formatDate,
  formatTime,
  getAvailableTimeSlots,
  getHighestPermissionState,
  getHours,
  getIntervalFromJsDate,
  getNetFromGross,
  getTaxValueFromGross,
  getZeroBasedWeekdayInteger,
  isActivePeriod,
  isAfter,
  isBefore,
  startOfDay,
  subDays,
  subHours,
  subMinutes
});
//# sourceMappingURL=frontendUtils.js.map