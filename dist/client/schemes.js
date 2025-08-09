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

// packages/schemes.ts
var schemes_exports = {};
__export(schemes_exports, {
  HallencardStatus: () => HallencardStatus,
  benefitSchema: () => benefitSchema,
  benefitSchemaObject: () => benefitSchemaObject,
  controlInterfaceSchema: () => controlInterfaceSchema,
  controlInterfaceSchemaObject: () => controlInterfaceSchemaObject,
  courtSchema: () => courtSchema,
  courtSchemaObject: () => courtSchemaObject,
  createHallencardSchema: () => createHallencardSchema,
  createHallencardSchemaObject: () => createHallencardSchemaObject,
  createReservationSchema: () => createReservationSchema,
  createReservationSchemaObject: () => createReservationSchemaObject,
  eventCategoriesSchema: () => eventCategoriesSchema,
  eventCategoriesSchemaObject: () => eventCategoriesSchemaObject,
  eventSchema: () => eventSchema,
  eventSchemaObject: () => eventSchemaObject,
  getPriceSchema: () => getPriceSchema,
  notificationSchema: () => notificationSchema,
  notificationSchemaObject: () => notificationSchemaObject,
  organisationMemberSchema: () => organisationMemberSchema,
  organisationMemberSchemaObject: () => organisationMemberSchemaObject,
  organisationSchema: () => organisationSchema,
  organisationSchemaObject: () => organisationSchemaObject,
  priceSchema: () => priceSchema,
  reservationRuleSchema: () => reservationRuleSchema,
  seasonSchema: () => seasonSchema,
  seasonSchemaObject: () => seasonSchemaObject,
  teamSchema: () => teamSchema,
  teamSchemaObject: () => teamSchemaObject,
  teamSeasonSchema: () => teamSeasonSchema,
  teamSeasonSchemaObject: () => teamSeasonSchemaObject,
  transactionSchema: () => transactionSchema,
  transactionSchemaObject: () => transactionSchemaObject,
  updateReservationSchema: () => updateReservationSchema,
  useHallencardForAnotherPersonSchema: () => useHallencardForAnotherPersonSchema,
  useHallencardSchema: () => useHallencardSchema,
  userRoleSchema: () => userRoleSchema,
  userRoleSchemaObject: () => userRoleSchemaObject,
  userSchema: () => userSchema,
  userSchemaObject: () => userSchemaObject
});
module.exports = __toCommonJS(schemes_exports);

// src/schemes/benefit.ts
var import_zod = require("zod");
var benefitSchema = {
  title: import_zod.z.string(),
  description: import_zod.z.string().nullable(),
  image: import_zod.z.string().optional().nullable(),
  cover: import_zod.z.boolean().optional(),
  link: import_zod.z.string().url().optional().nullable(),
  activeFrom: import_zod.z.date().optional().nullable(),
  activeTo: import_zod.z.date().optional().nullable()
};
var benefitSchemaObject = import_zod.z.object(benefitSchema);

// src/schemes/controlInterface.ts
var import_zod2 = require("zod");
var controlInterfaceSchema = {
  //id           :z.string(),
  title: import_zod2.z.string(),
  description: import_zod2.z.string(),
  preBooking: import_zod2.z.number(),
  postBooking: import_zod2.z.number(),
  connectByAnd: import_zod2.z.boolean().optional(),
  connectByOr: import_zod2.z.boolean().optional(),
  affectedCourts: import_zod2.z.string().array().optional()
};
var controlInterfaceSchemaObject = import_zod2.z.object(controlInterfaceSchema);

// src/schemes/court.ts
var import_zod3 = require("zod");
var courtSchema = {
  name: import_zod3.z.string(),
  shortName: import_zod3.z.string().nullable(),
  description: import_zod3.z.string().nullable().optional(),
  active: import_zod3.z.boolean().optional(),
  activeFrom: import_zod3.z.date().nullable().optional(),
  activeTo: import_zod3.z.date().nullable().optional(),
  areaId: import_zod3.z.number(),
  order: import_zod3.z.number().nullable().optional()
};
var courtSchemaObject = import_zod3.z.object(courtSchema);

// src/schemes/event.ts
var import_zod4 = require("zod");
var eventSchema = {
  id: import_zod4.z.string().optional(),
  title: import_zod4.z.string(),
  description: import_zod4.z.string().nullable().optional(),
  categoryId: import_zod4.z.string(),
  image: import_zod4.z.string().nullable().optional(),
  start: import_zod4.z.date(),
  end: import_zod4.z.date().nullable().optional(),
  canceled: import_zod4.z.boolean().optional(),
  revised: import_zod4.z.boolean().optional(),
  link: import_zod4.z.string().nullable().optional(),
  location: import_zod4.z.string().nullable().optional()
};
var eventSchemaObject = import_zod4.z.object(eventSchema);

// src/schemes/eventCategories.ts
var import_zod5 = require("zod");
var eventCategoriesSchema = {
  id: import_zod5.z.string().optional(),
  slug: import_zod5.z.string(),
  title: import_zod5.z.string()
};
var eventCategoriesSchemaObject = import_zod5.z.object(eventCategoriesSchema);

// src/schemes/hallencard.ts
var import_zod6 = require("zod");
var createHallencardSchema = {
  value: import_zod6.z.number()
};
var createHallencardSchemaObject = import_zod6.z.object(createHallencardSchema);
var useHallencardSchema = {
  code: import_zod6.z.string(),
  pin: import_zod6.z.string().length(6)
};
var useHallencardForAnotherPersonSchema = {
  code: import_zod6.z.string(),
  userId: import_zod6.z.string()
};
var HallencardStatus = /* @__PURE__ */ ((HallencardStatus2) => {
  HallencardStatus2["CREATED"] = "CREATED";
  HallencardStatus2["PRINTED"] = "PRINTED";
  HallencardStatus2["USED"] = "USED";
  return HallencardStatus2;
})(HallencardStatus || {});

// src/db/databaseTypes.ts
var ReservationType = /* @__PURE__ */ ((ReservationType2) => {
  ReservationType2["TOURNAMENT"] = "TOURNAMENT";
  ReservationType2["MAINTENANCE"] = "MAINTENANCE";
  ReservationType2["TEAM_PRACTICE"] = "TEAM_PRACTICE";
  ReservationType2["TEAM_COMPETITION"] = "TEAM_COMPETITION";
  return ReservationType2;
})(ReservationType || {});
var ReservationRuleCheckOn = /* @__PURE__ */ ((ReservationRuleCheckOn2) => {
  ReservationRuleCheckOn2["CREATE"] = "CREATE";
  ReservationRuleCheckOn2["UPDATE"] = "UPDATE";
  ReservationRuleCheckOn2["DELETE"] = "DELETE";
  return ReservationRuleCheckOn2;
})(ReservationRuleCheckOn || {});
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

// src/schemes/notification.ts
var import_zod7 = require("zod");
var notificationSchema = {
  title: import_zod7.z.string(),
  message: import_zod7.z.string().nullable().optional(),
  severity: import_zod7.z.nativeEnum(NotificationSeverity),
  showFrom: import_zod7.z.date(),
  showTo: import_zod7.z.date()
};
var notificationSchemaObject = import_zod7.z.object(notificationSchema);

// src/schemes/organisation.ts
var import_zod8 = require("zod");
var organisationSchema = {
  id: import_zod8.z.string().optional(),
  slug: import_zod8.z.string(),
  title: import_zod8.z.string()
};
var organisationSchemaObject = import_zod8.z.object(organisationSchema);

// src/schemes/organisationMember.ts
var import_zod9 = require("zod");
var organisationMemberSchema = {
  id: import_zod9.z.string().optional(),
  fullName: import_zod9.z.string(),
  function: import_zod9.z.string().optional().nullable(),
  image: import_zod9.z.string().optional().nullable(),
  email: import_zod9.z.string().optional().nullable(),
  phone: import_zod9.z.string().optional().nullable(),
  orderID: import_zod9.z.number().optional().nullable(),
  organisationId: import_zod9.z.string(),
  parentMemberId: import_zod9.z.string().optional().nullable(),
  childMembers: import_zod9.z.string().array().optional().nullable()
};
var organisationMemberSchemaObject = import_zod9.z.object(organisationMemberSchema);

// src/schemes/price.ts
var import_zod10 = require("zod");
var priceSchema = {
  validFrom: import_zod10.z.date().optional(),
  validTo: import_zod10.z.date().optional(),
  isDefault: import_zod10.z.boolean().optional(),
  mon: import_zod10.z.boolean().optional(),
  tue: import_zod10.z.boolean().optional(),
  wed: import_zod10.z.boolean().optional(),
  thu: import_zod10.z.boolean().optional(),
  fri: import_zod10.z.boolean().optional(),
  sat: import_zod10.z.boolean().optional(),
  sun: import_zod10.z.boolean().optional(),
  from: import_zod10.z.string(),
  to: import_zod10.z.string(),
  value: import_zod10.z.number(),
  taxes: import_zod10.z.number(),
  currency: import_zod10.z.string(),
  roles: import_zod10.z.string().array(),
  areas: import_zod10.z.string().array()
};

// src/schemes/reservation.ts
var import_zod11 = require("zod");
var createReservationSchema = {
  title: import_zod11.z.string().optional(),
  start: import_zod11.z.date(),
  duration: import_zod11.z.string(),
  courtId: import_zod11.z.string(),
  type: import_zod11.z.nativeEnum(ReservationType).optional(),
  ownerId: import_zod11.z.string().optional(),
  fellows: import_zod11.z.object({ id: import_zod11.z.string(), name: import_zod11.z.string() }).array().optional(),
  //admin special things
  courts: import_zod11.z.string().array().optional(),
  repeatInterval: import_zod11.z.number().optional(),
  repeatUntil: import_zod11.z.date().optional(),
  repeatApproved: import_zod11.z.boolean().optional()
};
var createReservationSchemaObject = import_zod11.z.object(createReservationSchema);
var getPriceSchema = {
  start: import_zod11.z.date(),
  end: import_zod11.z.date(),
  courtId: import_zod11.z.string()
};
var updateReservationSchema = {
  id: import_zod11.z.string(),
  title: import_zod11.z.string().optional(),
  start: import_zod11.z.date().optional(),
  end: import_zod11.z.date().optional(),
  courtId: import_zod11.z.string().optional(),
  type: import_zod11.z.nativeEnum(ReservationType).optional(),
  ownerId: import_zod11.z.string().optional(),
  fellows: import_zod11.z.string().array().optional(),
  light: import_zod11.z.boolean().optional(),
  radiator: import_zod11.z.boolean().optional()
};

// src/schemes/reservationRule.ts
var import_zod12 = require("zod");
var reservationRuleSchema = {
  name: import_zod12.z.string(),
  errorDescription: import_zod12.z.string().optional(),
  validFor: import_zod12.z.string().array().optional(),
  affectedAreas: import_zod12.z.string().array().optional(),
  affectedCourts: import_zod12.z.string().array().optional(),
  checkOn: import_zod12.z.nativeEnum(ReservationRuleCheckOn),
  ruleCheckPluginName: import_zod12.z.string().optional(),
  value: import_zod12.z.string()
};

// src/schemes/season.ts
var import_zod13 = require("zod");
var seasonSchema = {
  id: import_zod13.z.number().optional(),
  name: import_zod13.z.string(),
  shortName: import_zod13.z.string(),
  starting: import_zod13.z.date(),
  ending: import_zod13.z.date()
};
var seasonSchemaObject = import_zod13.z.object(seasonSchema);

// src/schemes/team.ts
var import_zod14 = require("zod");
var teamSchema = {
  id: import_zod14.z.number().optional(),
  name: import_zod14.z.string(),
  shortName: import_zod14.z.string(),
  category: import_zod14.z.nativeEnum(TeamCategory),
  orderNumber: import_zod14.z.number()
};
var teamSchemaObject = import_zod14.z.object(teamSchema);

// src/schemes/teamSeason.ts
var import_zod15 = require("zod");
var teamSeasonSchema = {
  teamId: import_zod15.z.number(),
  seasonId: import_zod15.z.number(),
  teamLeaderId: import_zod15.z.string().nullable().optional(),
  nuGroupId: import_zod15.z.string(),
  nuTeamId: import_zod15.z.string(),
  leagueName: import_zod15.z.string()
};
var teamSeasonSchemaObject = import_zod15.z.object(teamSeasonSchema);

// src/schemes/transaction.ts
var import_zod16 = require("zod");
var transactionSchema = {
  userId: import_zod16.z.string(),
  reason: import_zod16.z.nativeEnum(TransactionReason),
  value: import_zod16.z.number(),
  currency: import_zod16.z.string(),
  reservationId: import_zod16.z.string().nullable().optional()
};
var transactionSchemaObject = import_zod16.z.object(transactionSchema);

// src/schemes/user.ts
var import_zod17 = require("zod");
var userSchema = {
  id: import_zod17.z.string().optional(),
  name: import_zod17.z.string().min(6),
  email: import_zod17.z.string().optional().nullable(),
  password: import_zod17.z.string().optional(),
  image: import_zod17.z.string().optional().nullable(),
  phoneNumber: import_zod17.z.string().min(5),
  address: import_zod17.z.string().min(2),
  cityCode: import_zod17.z.string().min(5),
  cityName: import_zod17.z.string().min(2),
  countryCode: import_zod17.z.string().optional().nullable(),
  roles: import_zod17.z.string().array().optional(),
  publicName: import_zod17.z.boolean().optional()
};
var userSchemaObject = import_zod17.z.object(userSchema);

// src/schemes/userRole.ts
var import_zod18 = require("zod");
var userRoleSchema = {
  title: import_zod18.z.string(),
  description: import_zod18.z.string().optional().nullable(),
  priority: import_zod18.z.number(),
  isDefault: import_zod18.z.boolean()
};
var userRoleSchemaObject = import_zod18.z.object(userRoleSchema);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HallencardStatus,
  benefitSchema,
  benefitSchemaObject,
  controlInterfaceSchema,
  controlInterfaceSchemaObject,
  courtSchema,
  courtSchemaObject,
  createHallencardSchema,
  createHallencardSchemaObject,
  createReservationSchema,
  createReservationSchemaObject,
  eventCategoriesSchema,
  eventCategoriesSchemaObject,
  eventSchema,
  eventSchemaObject,
  getPriceSchema,
  notificationSchema,
  notificationSchemaObject,
  organisationMemberSchema,
  organisationMemberSchemaObject,
  organisationSchema,
  organisationSchemaObject,
  priceSchema,
  reservationRuleSchema,
  seasonSchema,
  seasonSchemaObject,
  teamSchema,
  teamSchemaObject,
  teamSeasonSchema,
  teamSeasonSchemaObject,
  transactionSchema,
  transactionSchemaObject,
  updateReservationSchema,
  useHallencardForAnotherPersonSchema,
  useHallencardSchema,
  userRoleSchema,
  userRoleSchemaObject,
  userSchema,
  userSchemaObject
});
//# sourceMappingURL=schemes.js.map