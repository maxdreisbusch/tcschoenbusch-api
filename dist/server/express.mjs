// src/utils/env.ts
import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();
var envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PAYPAL_ID: z.string(),
  PAYPAL_SECRET: z.string(),
  PAYPAL_URL: z.string().url(),
  TOKEN_AUDIENCE: z.string(),
  TOKEN_ISSUER: z.string(),
  NODE_ENV: z.string().optional().default("PROD"),
  PORT: z.string().default("3000")
});
var parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("\u274C Invalid environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}
var env = {
  ...parsed.data
};

// src/db/index.ts
import { PrismaClient } from "@prisma/client";
var prisma = new PrismaClient({
  //log: [],
  log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
});

// src/servers/express.ts
import * as trpcExpress from "@trpc/server/adapters/express";

// src/router/index.ts
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

// src/utils/logic/date.ts
import { DateTime, Interval, Settings } from "luxon";
Settings.defaultLocale = "de";
Settings.defaultZone = "Europe/Berlin";
var addDays = (date, amount) => DateTime.fromJSDate(date).plus({ day: amount }).toJSDate();
var addHours = (date, amount) => DateTime.fromJSDate(date).plus({ hour: amount }).toJSDate();
var subHours = (date, amount) => DateTime.fromJSDate(date).minus({ hour: amount }).toJSDate();
var addMinutes = (date, amount) => DateTime.fromJSDate(date).plus({ minute: amount }).toJSDate();
var subMinutes = (date, amount) => DateTime.fromJSDate(date).minus({ minute: amount }).toJSDate();
var differenceInMinutes = (end, start) => DateTime.fromJSDate(start).diff(DateTime.fromJSDate(end), ["minutes", "seconds", "milliseconds"]).minutes;
var format = (date, format2) => DateTime.fromJSDate(date).toFormat(format2);
var formatDate = (date) => format(date, "dd.MM.yyyy");
var getHours = (date) => format(date, "Hmm");
var isBefore = (firstDate, secondDate) => DateTime.fromJSDate(firstDate) < DateTime.fromJSDate(secondDate);
var isAfter = (firstDate, secondDate) => DateTime.fromJSDate(firstDate) > DateTime.fromJSDate(secondDate);
var startOfDay = (date) => DateTime.fromJSDate(date).startOf("day").toJSDate();
var endOfDay = (date) => DateTime.fromJSDate(date).endOf("day").toJSDate();
var zeroBasedWeekDayIntegers = [1, 2, 3, 4, 5, 6, 0];
var getZeroBasedWeekdayInteger = (date) => zeroBasedWeekDayIntegers[DateTime.fromJSDate(date).get("weekday") - 1] ?? 1;

// src/utils/logic/hallencard.ts
var createHallencardCode = () => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 15) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    if (counter === 4 || counter === 9) result += "-";
    counter++;
  }
  return result;
};
var createHallencardPin = () => Math.floor(1e5 + Math.random() * 9e5);

// src/utils/logic/price.ts
var calculateReservationPrice = (start, end, prices) => {
  let total = 0;
  let taxRate = 0;
  let currentTimeFrame = start;
  const finalEnd = subMinutes(end, 2);
  while (isBefore(currentTimeFrame, finalEnd)) {
    const hours = parseInt(getHours(currentTimeFrame));
    let bestPrice = void 0;
    const fittingPrices = prices.filter((price) => price.from <= hours && price.to > hours);
    for (const fittingPrice of fittingPrices) {
      if (bestPrice === void 0 || bestPrice > fittingPrice.value) bestPrice = fittingPrice.value;
      if (taxRate === 0 || taxRate > fittingPrice.taxes) taxRate = fittingPrice.taxes;
    }
    total += (bestPrice ?? 0) / 4;
    currentTimeFrame = addMinutes(currentTimeFrame, 15);
  }
  return { total, taxRate };
};
var getCourtPrice = async (start, end, userRoles, courtId) => {
  const startHours = parseInt(getHours(start));
  const endHours = parseInt(getHours(end));
  const prices = await prisma.price.findMany({
    select: { from: true, to: true, value: true, currency: true, taxes: true },
    where: {
      roles: { some: { OR: userRoles.map((i) => ({ id: i })) ?? [] } },
      [getWeekday(start)]: true,
      validFrom: { lte: start },
      validTo: { gte: end },
      areas: { some: { courts: { some: { id: courtId } } } },
      OR: [
        //Start and End with price time bzw. in between a price section
        { from: { lte: startHours }, to: { gte: endHours } },
        //Start and end in different price sections
        { from: { lte: startHours }, to: { gte: startHours } },
        { from: { lte: endHours }, to: { gte: endHours } }
      ]
    },
    orderBy: {
      value: "asc"
    }
  });
  if (prices.length === 1) {
    const hours = differenceInMinutes(start, end) / 60;
    if (prices[0]?.value) {
      return { total: prices[0]?.value * hours, taxRate: prices[0]?.taxes };
    }
  } else if (prices.length > 0) {
    return calculateReservationPrice(start, end, prices);
  }
  return { total: 0, taxRate: 0 };
};
var weekDays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
var getWeekday = (date) => weekDays[getZeroBasedWeekdayInteger(date)] ?? "mon";

// src/utils/logic/permissions.ts
import { PermissionState } from "@prisma/client";
var getHighestPermissionState = (states) => {
  let result = PermissionState.NONE;
  for (const permission of states) {
    if (permission.allowed === PermissionState.ALL) return PermissionState.ALL;
    if (permission.allowed === PermissionState.OWN) result = PermissionState.OWN;
    if (permission.allowed === PermissionState.NONE) continue;
  }
  return result;
};

// src/utils/logic/taxes.ts
var getTaxValueFromGross = (gross, taxRate = 19) => {
  const vat = taxRate / 100;
  return +(gross * vat / (1 + vat)).toFixed(2);
};

// src/utils/logic/applicationDialogPermissions.ts
var ApplicationDialogPermission = /* @__PURE__ */ ((ApplicationDialogPermission2) => {
  ApplicationDialogPermission2["REPEATED_RESERVATIONS"] = "repeatedReservations";
  ApplicationDialogPermission2["MULTIPLE_COURT_RESERVATIONS"] = "multipleCourtReservations";
  ApplicationDialogPermission2["RESERVATION_SETTINGS"] = "reservationSettings";
  ApplicationDialogPermission2["DELETE_BOOKING"] = "deleteBooking";
  return ApplicationDialogPermission2;
})(ApplicationDialogPermission || {});

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
var PermissionState2 = /* @__PURE__ */ ((PermissionState3) => {
  PermissionState3["NONE"] = "NONE";
  PermissionState3["OWN"] = "OWN";
  PermissionState3["ALL"] = "ALL";
  return PermissionState3;
})(PermissionState2 || {});
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

// src/authentication/jwt.ts
import jwt from "jsonwebtoken";

// src/authentication/index.ts
var tokenAudience = env.TOKEN_AUDIENCE;
var tokenIssuer = env.TOKEN_ISSUER;
var generateAppSessionUser = (user) => {
  const { id, name, email, roles } = user;
  return {
    id,
    name,
    email,
    roles: roles.sort((prev, next) => prev.priority - next.priority).map((i) => i.id)
  };
};

// src/authentication/jwks.ts
import jwksClient from "jwks-rsa";
var jwksUri = "https://login.tc-schoenbusch.de/.well-known/jwks.json";
var jsonWebKeyClient = jwksClient({
  cache: true,
  rateLimit: true,
  jwksUri,
  timeout: 1e3
});
var getPublicSigningKey = (header, callback) => {
  jsonWebKeyClient.getSigningKey(header.kid).then((data) => {
    callback(null, data.getPublicKey());
  }).catch((e) => {
    callback(e, null);
  });
};

// src/authentication/jwt.ts
var jsonWebTokenOptions = {
  audience: tokenAudience,
  issuer: tokenIssuer,
  algorithms: ["RS256"]
};
var verifyTokenAsync = async (token, getPublicSigningKey2, options) => new Promise((resolve, reject) => {
  jwt.verify(token, getPublicSigningKey2, options, (err, decoded) => {
    if (err) {
      reject(err);
    } else {
      resolve(decoded);
    }
  });
});
var isJwtToken = (data) => data.header && data.payload && data.signature;
var isJwtPayload = (data) => data.iss && data.sub && data.aud;
var getServerAuthSession = async (authorizationHeader) => {
  try {
    if (!authorizationHeader || authorizationHeader.length === 0) return;
    const token = authorizationHeader.split(" ")[1];
    if (!token) return;
    const decoded = await verifyTokenAsync(token, getPublicSigningKey, jsonWebTokenOptions);
    if (typeof decoded === "string") return;
    if (isJwtToken(decoded) && isJwtPayload(decoded.payload)) return getAppSessionUser(decoded.payload);
    else if (isJwtPayload(decoded)) return getAppSessionUser(decoded);
    return;
  } catch (ex) {
    console.error(ex);
  }
  return;
};
var getAppSessionUser = async (payload) => {
  const email = payload["https://tc-schoenbusch.de/mail"];
  const [auth0User, emailUser] = await Promise.all([
    prisma.user.findUnique({
      where: { auth0Id: payload.sub },
      include: { roles: true }
    }),
    prisma.user.findUnique({
      where: { email },
      include: { roles: true }
    })
  ]);
  if (auth0User && emailUser) {
    return generateAppSessionUser(auth0User);
  } else if (auth0User && !emailUser) {
    await prisma.user.update({ data: { email }, where: { id: auth0User.id } });
    return generateAppSessionUser(auth0User);
  } else if (!auth0User && emailUser) {
    await prisma.user.update({ data: { auth0Id: payload.sub }, where: { id: emailUser.id } });
    return generateAppSessionUser(emailUser);
  }
  const role = await prisma.userRole.findFirst({ where: { isDefault: true }, select: { id: true } });
  const user = await prisma.user.create({
    data: {
      email,
      auth0Id: payload.sub,
      roles: role ? { connect: { id: role?.id } } : void 0
    },
    include: { roles: true }
  });
  return generateAppSessionUser(user);
};
var generateMembershipToken = (payload) => jwt.sign(payload, "AbTcSMemBership#Card#2025!", { expiresIn: "30d" });

// src/router/index.ts
var createContext = async ({ req }) => {
  const authorizationHeader = req.headers.authorization;
  const session = await getServerAuthSession(authorizationHeader);
  return {
    session: session ?? null,
    prisma
  };
};
var t = initTRPC.context().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  }
});
var createTRPCRouter = t.router;
var middleware = t.middleware;
var publicProcedure = t.procedure;
var enforceUserIsAuthenticated = middleware(({ ctx, next }) => {
  if (!ctx.session) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: ctx.session
    }
  });
});
var protectedProcedure = t.procedure.use(enforceUserIsAuthenticated);
var roleCheck = (router, action) => middleware(async ({ ctx, next }) => {
  if (!ctx.session?.roles || ctx.session.roles.length === 0) throw new TRPCError({ code: "UNAUTHORIZED" });
  const permissions = await ctx.prisma.permission.findMany({
    where: {
      OR: [
        { router, action, userRoleId: { in: ctx.session?.roles } },
        { router: "*", action: "*", userRoleId: { in: ctx.session?.roles } }
      ]
    }
  });
  const permissionState = getHighestPermissionState(permissions);
  if (permissionState === "NONE" /* NONE */) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({
    ctx: {
      permission: permissionState
    }
  });
});
var roleCheckProcedure = (router, action) => t.procedure.use(roleCheck(router, action));

// src/router/routers/area.ts
import { z as z2 } from "zod";
var dataCheck = {
  name: z2.string(),
  shortName: z2.string(),
  activeFrom: z2.date().nullable().optional(),
  activeTo: z2.date().nullable().optional(),
  bookableFrom: z2.date().nullable().optional(),
  order: z2.number().nullable().optional()
};
var selectList = {
  id: true,
  name: true,
  shortName: true,
  _count: true
};
var activeWhere = (date = /* @__PURE__ */ new Date()) => ({
  OR: [
    { activeFrom: { lt: date }, activeTo: { gt: date } },
    { activeFrom: null, activeTo: null }
  ]
});
var routerName = "area";
var areaRouter = createTRPCRouter({
  list: roleCheckProcedure(routerName, "list").query(
    ({ ctx }) => ctx.prisma.area.findMany({
      select: selectList,
      orderBy: [{ order: "asc" }, { name: "asc" }]
    })
  ),
  listActive: roleCheckProcedure(routerName, "listActive").query(
    ({ ctx }) => ctx.prisma.area.findMany({
      select: selectList,
      where: ctx.permission === "ALL" /* ALL */ ? void 0 : activeWhere(),
      orderBy: [{ order: "asc" }, { name: "asc" }]
    })
  ),
  get: roleCheckProcedure(routerName, "get").input(z2.number()).query(
    ({ ctx, input }) => ctx.prisma.area.findUnique({
      where: { id: input },
      select: {
        id: true,
        name: true,
        shortName: true,
        activeFrom: true,
        activeTo: true,
        bookableFrom: true,
        order: true
      }
    })
  ),
  getWithAllCourts: roleCheckProcedure(routerName, "getWithAllCourts").input(z2.number()).query(
    ({ ctx, input }) => ctx.prisma.area.findUnique({
      where: { id: input },
      select: {
        id: true,
        name: true,
        shortName: true,
        activeFrom: true,
        activeTo: true,
        order: true,
        courts: {
          select: {
            id: true,
            name: true,
            shortName: true,
            description: true,
            order: true,
            active: true,
            activeFrom: true,
            activeTo: true,
            _count: true
          },
          orderBy: [{ order: "asc" }, { name: "asc" }]
        }
      }
    })
  ),
  getWithActiveCourts: roleCheckProcedure(routerName, "getWithActiveCourts").input(z2.object({ areaId: z2.number().optional(), date: z2.date() })).query(
    ({ ctx, input }) => ctx.prisma.area.findFirst({
      where: { id: input.areaId },
      select: {
        id: true,
        name: true,
        courts: {
          select: { id: true, name: true, description: true },
          where: { AND: [{ active: true }, activeWhere(input.date)] },
          orderBy: [{ order: "asc" }, { name: "asc" }]
        }
      }
    })
  ),
  upsert: roleCheckProcedure(routerName, "upsert").input(z2.object({ id: z2.number().optional(), ...dataCheck })).mutation(({ input, ctx }) => {
    const { id, ...data } = input;
    if (id) {
      return ctx.prisma.area.update({
        where: { id },
        data
      });
    }
    return ctx.prisma.area.create({ data });
  }),
  delete: roleCheckProcedure(routerName, "delete").input(z2.number()).mutation(
    ({ input, ctx }) => ctx.prisma.area.delete({
      where: { id: input }
    })
  )
});

// src/router/routers/benefit.ts
import { TRPCError as TRPCError2 } from "@trpc/server";
import { z as z4 } from "zod";

// src/schemes/benefit.ts
import { z as z3 } from "zod";
var benefitSchema = {
  title: z3.string(),
  description: z3.string().nullable(),
  image: z3.string().optional().nullable(),
  cover: z3.boolean().optional(),
  link: z3.string().url().optional().nullable(),
  activeFrom: z3.date().optional().nullable(),
  activeTo: z3.date().optional().nullable()
};
var benefitSchemaObject = z3.object(benefitSchema);

// src/router/routers/benefit.ts
var routerName2 = "benefit";
var benefitRouter = createTRPCRouter({
  create: roleCheckProcedure(routerName2, "create").input(z4.object(benefitSchema)).mutation(({ input, ctx }) => {
    return ctx.prisma.benefit.create({
      data: input
    });
  }),
  get: roleCheckProcedure(routerName2, "get").input(z4.string()).query(
    async ({ ctx, input }) => ctx.prisma.benefit.findUnique({
      where: { id: input }
    })
  ),
  list: roleCheckProcedure(routerName2, "list").query(
    async ({ ctx }) => ctx.prisma.benefit.findMany({
      orderBy: [{ title: "asc" }]
    })
  ),
  update: roleCheckProcedure(routerName2, "update").input(z4.object({ id: z4.string().optional(), ...benefitSchema })).mutation(({ input, ctx }) => {
    const { id, ...data } = input;
    if (!id) throw new TRPCError2({ code: "BAD_REQUEST" });
    return ctx.prisma.benefit.update({
      where: { id },
      data
    });
  }),
  delete: roleCheckProcedure(routerName2, "delete").input(z4.string()).mutation(
    ({ input, ctx }) => ctx.prisma.benefit.delete({
      where: { id: input }
    })
  )
});

// src/router/routers/controlInterfaces.ts
import { z as z10 } from "zod";

// src/schemes/controlInterface.ts
import { z as z5 } from "zod";
var controlInterfaceSchema = {
  //id           :z.string(),
  title: z5.string(),
  description: z5.string(),
  preBooking: z5.number(),
  postBooking: z5.number(),
  connectByAnd: z5.boolean().optional(),
  connectByOr: z5.boolean().optional(),
  affectedCourts: z5.string().array().optional()
};
var controlInterfaceSchemaObject = z5.object(controlInterfaceSchema);

// src/router/routers/reservation.ts
import { TRPCError as TRPCError4 } from "@trpc/server";
import { DateTime as DateTime2 } from "luxon";
import { z as z9 } from "zod";

// src/schemes/reservation.ts
import { z as z6 } from "zod";
var createReservationSchema = {
  title: z6.string().optional(),
  start: z6.date(),
  duration: z6.string(),
  courtId: z6.string(),
  type: z6.nativeEnum(ReservationType).optional(),
  ownerId: z6.string().optional(),
  fellows: z6.object({ id: z6.string(), name: z6.string() }).array().optional(),
  //admin special things
  courts: z6.string().array().optional(),
  repeatInterval: z6.number().optional(),
  repeatUntil: z6.date().optional(),
  repeatApproved: z6.boolean().optional()
};
var createReservationSchemaObject = z6.object(createReservationSchema);
var getPriceSchema = {
  start: z6.date(),
  end: z6.date(),
  courtId: z6.string()
};
var updateReservationSchema = {
  id: z6.string(),
  title: z6.string().optional(),
  start: z6.date().optional(),
  end: z6.date().optional(),
  courtId: z6.string().optional(),
  type: z6.nativeEnum(ReservationType).optional(),
  ownerId: z6.string().optional(),
  fellows: z6.string().array().optional(),
  light: z6.boolean().optional(),
  radiator: z6.boolean().optional()
};

// src/plugins/paypal.ts
import axios from "axios";
var { PAYPAL_URL, PAYPAL_ID, PAYPAL_SECRET } = env;
var paypalClient = axios.create({ baseURL: PAYPAL_URL });
var generatePaypalToken = async () => {
  const auth = Buffer.from(`${PAYPAL_ID}:${PAYPAL_SECRET}`).toString("base64");
  const res = await paypalClient.post("/v1/oauth2/token", "grant_type=client_credentials", {
    headers: { Authorization: `Basic ${auth}` }
  });
  return res.data.access_token;
};
var createPurchaseItem = (title, value, taxRate, currency_code = "eur", quantity = "1") => {
  const taxValue = getTaxValueFromGross(value, taxRate);
  return {
    name: title,
    quantity,
    unit_amount: {
      currency_code,
      value: (value - taxValue).toFixed(2).toString()
    },
    tax: {
      currency_code,
      value: taxValue.toFixed(2).toString()
    },
    category: "DIGITAL_GOODS"
  };
};
var createAmount = (items, currency_code = "eur", discount = 0) => {
  let netTotal = 0;
  let taxTotal = 0;
  for (const i of items) {
    netTotal += parseFloat(i.unit_amount.value) * parseFloat(i.quantity);
    taxTotal += i.tax ? parseFloat(i.tax.value) * parseFloat(i.quantity) : 0;
  }
  return {
    currency_code,
    value: (netTotal + taxTotal - discount).toFixed(2),
    breakdown: {
      item_total: { currency_code, value: netTotal.toFixed(2) },
      tax_total: { currency_code, value: taxTotal.toFixed(2) },
      discount: { currency_code, value: discount.toFixed(2) }
    }
  };
};
var createOrder = async (purchaseItems, currency_code = "eur", discount = 0) => {
  console.log("I am here 1");
  const token = await generatePaypalToken();
  console.log("I am here 2");
  const body = {
    intent: "CAPTURE",
    purchase_units: [
      {
        description: "Platzbuchung beim TC Sch\xF6nbusch",
        items: purchaseItems,
        amount: createAmount(purchaseItems, currency_code, discount)
      }
    ]
  };
  console.log("I am here 100");
  const res = await paypalClient.post("/v2/checkout/orders", body, {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
  });
  return res.data;
};
var capturePayment = async (orderId) => {
  const accessToken = await generatePaypalToken();
  const res = await paypalClient.post(`/v2/checkout/orders/${orderId}/capture`, void 0, {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` }
  });
  return res.data;
};

// src/utils/ruleCheckPlugins/maxBookingsAtSameTime.ts
var checkMaxBookingsAtSameTime = async (reservation, values) => {
  const [hoursAround, maxBookings] = values.split(";");
  if (!hoursAround || !maxBookings) throw new Error("Wrong configuration, need to configure hoursAround;maxBookings");
  const startBefore = subHours(reservation.start, parseInt(hoursAround));
  const endAfter = addHours(reservation.end, parseInt(hoursAround));
  const reservations = await prisma.reservation.count({
    where: {
      start: { gte: startBefore },
      end: { lte: endAfter },
      OR: [{ ownerId: reservation.ownerId }, { fellows: { some: { id: reservation.ownerId } } }],
      status: "APPROVED" /* APPROVED */
    }
  });
  return reservations < parseInt(maxBookings);
};

// src/utils/ruleCheckPlugins/maxDuration.ts
var checkMaxDuration = (reservation, value) => {
  const val = parseInt(value);
  const duration = differenceInMinutes(reservation.end, reservation.start);
  return val >= duration;
};

// src/utils/ruleCheckPlugins/maxTimeBefore.ts
var checkMaxTimeBefore = (reservation, value) => {
  const earliestBookableTime = subMinutes(reservation.start, parseInt(value));
  return isBefore(earliestBookableTime, /* @__PURE__ */ new Date());
};

// src/utils/ruleCheckPlugins/minDuration.ts
var checkMinDuration = (reservation, value) => {
  const val = parseInt(value);
  const duration = differenceInMinutes(reservation.end, reservation.start);
  return val <= duration;
};

// src/utils/ruleCheckPlugins/minTimeBefore.ts
var checkMinTimeBefore = (reservation, value) => {
  const latestBookableTime = subMinutes(reservation.start, parseInt(value));
  return isBefore(/* @__PURE__ */ new Date(), latestBookableTime);
};

// src/utils/ruleCheckPlugins/index.ts
var ruleCheckPlugins = {
  maxTimeBefore: checkMaxTimeBefore,
  minTimeBefore: checkMinTimeBefore,
  minDuration: checkMinDuration,
  maxDuration: checkMaxDuration,
  maxBookingsAtSameTime: checkMaxBookingsAtSameTime
};

// src/router/routers/transaction.ts
import { TRPCError as TRPCError3 } from "@trpc/server";
import { z as z8 } from "zod";

// src/schemes/transaction.ts
import { z as z7 } from "zod";
var transactionSchema = {
  userId: z7.string(),
  reason: z7.nativeEnum(TransactionReason),
  value: z7.number(),
  currency: z7.string(),
  reservationId: z7.string().nullable().optional()
};
var transactionSchemaObject = z7.object(transactionSchema);

// src/router/routers/transaction.ts
var routerName3 = "transaction";
var transactionRouter = createTRPCRouter({
  create: roleCheckProcedure(routerName3, "create").input(z8.object(transactionSchema)).mutation(
    ({ input, ctx }) => ctx.prisma.transaction.create({
      data: {
        userId: input.userId,
        reason: input.reason,
        value: input.value,
        currency: input.currency,
        reservationId: input.reservationId
      }
    })
  ),
  balance: roleCheckProcedure(routerName3, "balance").input(z8.string().optional()).query(async ({ ctx, input }) => {
    const userId = input ?? ctx.session.id;
    if (ctx.permission !== "ALL" /* ALL */ && ctx.permission === "OWN" /* OWN */ && userId !== ctx.session.id)
      throw new TRPCError3({ code: "UNAUTHORIZED" });
    return ctx.prisma.transaction.groupBy({
      by: ["userId"],
      where: { userId, deleted: false },
      _sum: { value: true }
    });
  }),
  list: roleCheckProcedure(routerName3, "list").input(z8.string().optional()).query(async ({ ctx, input }) => {
    const userId = input ?? ctx.session.id;
    if (ctx.permission !== "ALL" /* ALL */ && ctx.permission === "OWN" /* OWN */ && userId !== ctx.session.id)
      throw new TRPCError3({ code: "UNAUTHORIZED" });
    return ctx.prisma.transaction.findMany({
      where: { userId, deleted: false },
      orderBy: [{ createdAt: "desc" }],
      take: 50
    });
  }),
  refund: roleCheckProcedure(routerName3, "refund").input(z8.string()).mutation(async ({ input, ctx }) => {
    const transaction = await ctx.prisma.transaction.findUnique({ where: { id: input } });
    if (transaction === null) throw new TRPCError3({ code: "BAD_REQUEST" });
    return ctx.prisma.transaction.create({
      data: {
        ...transaction,
        id: void 0,
        value: transaction.value * -1,
        reason: "REFUND" /* REFUND */,
        createdAt: void 0
      }
    });
  })
});

// src/router/routers/reservation.ts
var normalizeTime = (date) => DateTime2.fromJSDate(date).set({ second: 0, millisecond: 0 }).toJSDate();
var isAvailable = async (start, end, courtId) => (await prisma.reservation.findMany({
  where: {
    OR: getBookingWhereClause(start, end),
    courtId,
    deletedAt: null
  }
})).length === 0;
var isCourtAvailable = isAvailable;
var getMaxDate = (maximumRepeatableTo, repeatUntil) => {
  if (maximumRepeatableTo && repeatUntil) {
    return isBefore(maximumRepeatableTo, repeatUntil) ? maximumRepeatableTo : repeatUntil;
  }
  return repeatUntil ?? maximumRepeatableTo;
};
var routerName4 = "reservation";
var reservationRouter = createTRPCRouter({
  getPrice: roleCheckProcedure(routerName4, "getPrice").input(z9.object(getPriceSchema)).query(async ({ input, ctx }) => getCourtPrice(normalizeTime(input.start), input.end, ctx.session?.roles ?? [], input.courtId)),
  getNextReservationStart: roleCheckProcedure(routerName4, "getNextReservationStart").input(z9.object({ courtId: z9.string(), startTime: z9.date() })).query(
    async ({ input, ctx }) => ctx.prisma.reservation.findFirst({
      where: { courtId: input.courtId, start: { gte: normalizeTime(input.startTime) }, deletedAt: null },
      orderBy: { start: "asc" },
      select: { start: true }
    })
  ),
  get: roleCheckProcedure(routerName4, "get").input(z9.string()).query(async ({ input, ctx }) => {
    const reservation = await ctx.prisma.reservation.findUnique({
      where: { id: input },
      include: {
        court: { select: { name: true, area: { select: { name: true } } } },
        fellows: { select: { name: true } }
      }
    });
    if (ctx.permission !== "ALL" /* ALL */ && ctx.permission === "OWN" /* OWN */ && reservation?.ownerId !== ctx.session.id)
      throw new TRPCError4({ code: "UNAUTHORIZED", message: "Du darfst diese Buchung nicht anschauen." });
    return reservation;
  }),
  getReservationsByRessource: roleCheckProcedure(routerName4, "getReservationsByRessource").input(z9.object({ courtId: z9.string(), date: z9.date() })).query(async ({ input, ctx }) => {
    const reservations = await ctx.prisma.reservation.findMany({
      where: {
        courtId: input.courtId,
        start: { gte: startOfDay(input.date), lte: endOfDay(input.date) },
        deletedAt: null
      },
      orderBy: { start: "asc" },
      select: {
        id: true,
        title: true,
        start: true,
        end: true,
        status: true,
        type: true,
        abonnementId: true,
        owner: { select: { id: true, publicName: true } }
      }
    });
    return reservations.map((i) => ({
      ...i,
      owner: void 0,
      title: i.owner?.publicName || i.owner?.id === ctx.session.id || ctx.permission === "ALL" /* ALL */ || i.type !== null ? i.title : "gebucht"
    }));
  }),
  create: roleCheckProcedure(routerName4, "create").input(z9.object(createReservationSchema)).mutation(async ({ input, ctx }) => {
    const data = input;
    const start = normalizeTime(data.start);
    const duration = parseFloat(data.duration);
    const end = addMinutes(start, duration * 60);
    if (!await isAvailable(start, end, data.courtId))
      throw new TRPCError4({
        code: "CONFLICT",
        message: "W\xE4hrend deiner Buchung findet bereits eine andere Reservierung statt."
      });
    const ownerId = ctx.permission === "ALL" /* ALL */ && data.ownerId ? data.ownerId : ctx.session.id;
    const fellows = data.fellows?.map((i) => ({ id: i.id })) ?? [];
    const [courtSpecifications, price, bookingOwner] = await Promise.all([
      prisma.court.findUnique({
        where: { id: data.courtId },
        select: {
          activeFrom: true,
          activeTo: true,
          area: { select: { id: true, activeFrom: true, activeTo: true, bookableFrom: true } }
        }
      }),
      getCourtPrice(start, end, ctx.session?.roles ?? [], data.courtId),
      ctx.prisma.user.findUnique({ where: { id: ownerId }, select: { name: true } })
    ]);
    const reservationData = {
      title: data.title && data.title.trim().length > 0 ? data.title : bookingOwner?.name ?? "",
      start,
      end: addMinutes(start, parseFloat(data.duration) * 60),
      courtId: data.courtId,
      status: price.total === 0 ? "APPROVED" /* APPROVED */ : "REQUESTED" /* REQUESTED */,
      type: data.type,
      ownerId,
      light: true,
      radiator: true,
      fellows: fellows.length > 0 ? { connect: fellows } : void 0,
      price: price.total,
      taxRate: price.taxRate
    };
    if (courtSpecifications) {
      checkReservation(reservationData, courtSpecifications);
      await checkReservationRules("CREATE" /* CREATE */, reservationData, courtSpecifications, ctx.session?.roles);
    }
    if (data.courts && data.courts.length > 0) {
      if (price.total !== 0)
        throw new TRPCError4({
          code: "METHOD_NOT_SUPPORTED",
          message: "Mehrere Pl\xE4tze k\xF6nnen nur gebucht werden, wenn keine Geb\xFChr f\xE4llig ist."
        });
      return ctx.prisma.reservation.createMany({
        data: await getMultiCourtReservations(reservationData, data.courts, start, end)
      });
    } else if (data.repeatInterval && data.repeatInterval > 0) {
      if (price.total !== 0)
        throw new TRPCError4({
          code: "METHOD_NOT_SUPPORTED",
          message: "Abonnements k\xF6nnen nur gebucht werden, wenn keine Geb\xFChr f\xE4llig ist."
        });
      const courtData = await ctx.prisma.court.findUnique({
        where: { id: data.courtId },
        select: { activeTo: true, area: { select: { activeTo: true } } }
      });
      const maximumRepeatableTo = courtData?.activeTo ?? courtData?.area.activeTo;
      const maxDate = getMaxDate(maximumRepeatableTo, data.repeatUntil);
      if (!maxDate)
        throw new TRPCError4({
          code: "METHOD_NOT_SUPPORTED",
          message: "Es wurde kein maximales Buchungsdatum gefunden."
        });
      const abo = await ctx.prisma.abonnement.create({
        data: {
          name: data.title ?? "Abonnement",
          weekday: getZeroBasedWeekdayInteger(start),
          start,
          duration,
          status: data.repeatApproved ? "APPROVED" /* APPROVED */ : "REQUESTED" /* REQUESTED */,
          courtId: data.courtId,
          ownerId
        }
      });
      const repeatReservationData = {
        ...reservationData,
        status: data.repeatApproved ? "APPROVED" /* APPROVED */ : "REQUESTED" /* REQUESTED */,
        transactions: void 0,
        abonnementId: abo.id
      };
      const reservations = [];
      for (let currentDate = start; isBefore(currentDate, maxDate); currentDate = addDays(currentDate, data.repeatInterval)) {
        const endDate = addMinutes(currentDate, parseFloat(data.duration) * 60);
        if (!reservationData.courtId || !await isAvailable(currentDate, endDate, reservationData.courtId)) continue;
        reservations.push({
          ...repeatReservationData,
          start: currentDate,
          end: endDate
        });
      }
      return ctx.prisma.reservation.createMany({
        data: reservations
      });
    } else {
      return await ctx.prisma.reservation.create({ data: reservationData });
    }
  }),
  payForReservation: roleCheckProcedure(routerName4, "payForReservation").input(z9.object({ reservationId: z9.string(), useHallencard: z9.boolean() })).mutation(async ({ input, ctx }) => {
    const reservation = await ctx.prisma.reservation.findUnique({
      where: { id: input.reservationId },
      include: { court: { select: { name: true } } }
    });
    if (!reservation || !reservation.courtId)
      throw new TRPCError4({
        code: "METHOD_NOT_SUPPORTED",
        message: "Die Reservierung ist bereits abgelaufen. Bitte versuchen Sie es erneut."
      });
    if (!reservation.price || !reservation.taxRate) {
      void ctx.prisma.reservation.delete({ where: { id: reservation.id } });
      throw new TRPCError4({
        code: "METHOD_NOT_SUPPORTED",
        message: "Die Transaktion konnte nicht durchgef\xFChrt werden. Bitte versuchen Sie es erneut."
      });
    }
    let discount = 0;
    if (input.useHallencard && ctx.session) {
      const transactions = transactionRouter.createCaller(ctx);
      const balance = await transactions.balance(ctx.session.id);
      if (balance.length === 1) discount = balance[0]?._sum.value ?? 0;
      if (discount >= reservation.price) {
        return {
          reservation: await ctx.prisma.reservation.update({
            where: { id: reservation.id },
            data: {
              status: "APPROVED" /* APPROVED */,
              transactions: {
                create: {
                  userId: reservation.ownerId ?? ctx.session.id,
                  value: reservation.price * -1,
                  currency: "EUR",
                  reason: "COURT_RESERVATION" /* COURT_RESERVATION */
                }
              }
            }
          }),
          paypalTransaction: void 0
        };
      }
    }
    const currencyCode = "EUR";
    const purchaseItems = [];
    purchaseItems.push(
      createPurchaseItem(
        `${reservation.court?.name ?? ""} am ${format(reservation.start, "dd.MM.yyyy")} um ${format(reservation.start, "HH:mm")} - ${format(
          reservation.end,
          "HH:mm"
        )}`,
        reservation.price,
        reservation.taxRate,
        currencyCode,
        "1"
      )
    );
    const paypalTransaction = await createOrder(purchaseItems, currencyCode, discount);
    await ctx.prisma.reservation.update({
      where: { id: reservation.id },
      data: {
        paypalTransactionId: paypalTransaction.id
      }
    });
    return { reservation: void 0, paypalTransaction };
  }),
  checkPaymentStatus: roleCheckProcedure(routerName4, "checkPaymentStatus").input(z9.string()).mutation(async ({ input, ctx }) => {
    const reservation = (await ctx.prisma.reservation.findMany({ where: { paypalTransactionId: input } }))[0];
    if (!reservation)
      throw new TRPCError4({
        code: "INTERNAL_SERVER_ERROR",
        message: "Ihre Reservierung konnte nicht gefunden werden"
      });
    try {
      const order = await capturePayment(input);
      if (order.status !== "COMPLETED" || !order.purchase_units || order.purchase_units.length === 0 || order.purchase_units[0] == void 0)
        throw new Error();
      const captures = order.purchase_units[0].payments?.captures;
      if (!captures || captures[0]?.status !== "COMPLETED") throw new Error();
      const amount = captures[0].amount;
      await ctx.prisma.reservation.update({
        where: { id: reservation.id },
        data: {
          status: "APPROVED" /* APPROVED */,
          deletedAt: null,
          transactions: {
            create: [
              {
                userId: reservation.ownerId,
                value: (reservation.price ?? 0) * -1,
                currency: amount.currency_code,
                reason: "COURT_RESERVATION" /* COURT_RESERVATION */,
                createdAt: reservation.createdAt
              },
              {
                userId: reservation.ownerId,
                value: parseFloat(amount.value),
                currency: amount.currency_code,
                reason: "ONLINE_PAYMENT" /* ONLINE_PAYMENT */,
                paymentInformation: `paypal:${input}`
              }
            ]
          }
        }
      });
      return {};
    } catch (e) {
      console.log(e);
      await invalidateReservation(reservation.id);
      throw new TRPCError4({
        code: "INTERNAL_SERVER_ERROR",
        message: "Die Transaktion wurde nicht erfolgreich abgeschlossen. Die Platzbuchung wird gel\xF6scht."
      });
    }
  }),
  paymentCanceled: roleCheckProcedure(routerName4, "checkPaymentStatus").input(z9.string()).mutation(async ({ input, ctx }) => {
    const reservation = (await ctx.prisma.reservation.findMany({ where: { paypalTransactionId: input } }))[0];
    if (!reservation)
      throw new TRPCError4({
        code: "INTERNAL_SERVER_ERROR",
        message: "Ihre Reservierung konnte nicht gefunden werden"
      });
    await invalidateReservation(reservation.id);
  }),
  cancelReservation: roleCheckProcedure(routerName4, "cancelReservation").input(z9.string()).mutation(async ({ input, ctx }) => {
    const reservation = (await ctx.prisma.reservation.findMany({ where: { id: input } }))[0];
    if (!reservation)
      throw new TRPCError4({
        code: "INTERNAL_SERVER_ERROR",
        message: "Ihre Reservierung konnte nicht gefunden werden"
      });
    if (ctx.permission !== "ALL" /* ALL */ && ctx.session.id !== reservation.ownerId) throw new TRPCError4({ code: "UNAUTHORIZED" });
    await invalidateReservation(reservation.id);
  }),
  delete: roleCheckProcedure(routerName4, "delete").input(z9.string()).mutation(async ({ input, ctx }) => {
    const reservationData = await ctx.prisma.reservation.findUnique({
      where: { id: input },
      select: {
        id: true,
        title: true,
        courtId: true,
        start: true,
        end: true,
        ownerId: true,
        status: true,
        light: true,
        radiator: true,
        fellows: true,
        price: true,
        taxRate: true,
        court: {
          select: {
            area: { select: { id: true, activeFrom: true, activeTo: true, bookableFrom: true } },
            activeFrom: true,
            activeTo: true
          }
        },
        transactions: {
          select: {
            id: true,
            value: true,
            currency: true
          },
          where: {
            reason: "COURT_RESERVATION" /* COURT_RESERVATION */
          }
        }
      }
    });
    if (!reservationData || ctx.permission !== "ALL" /* ALL */ && ctx.session.id !== reservationData.ownerId)
      throw new TRPCError4({ code: "UNAUTHORIZED" });
    const courtSpecifications = reservationData.court;
    if (courtSpecifications)
      await checkReservationRules(
        "DELETE" /* DELETE */,
        reservationData,
        courtSpecifications,
        ctx.session?.roles
      );
    const courtReservationTransaction = reservationData.transactions[0];
    await ctx.prisma.reservation.update({
      where: { id: input },
      data: {
        deletedAt: /* @__PURE__ */ new Date(),
        transactions: courtReservationTransaction ? {
          create: {
            value: courtReservationTransaction.value * -1,
            //give back the money for the whole reservation
            currency: courtReservationTransaction.currency,
            reason: "COURT_RESERVATION_STORNO" /* COURT_RESERVATION_STORNO */
          }
        } : void 0
      }
    });
    return {};
  }),
  deleteAbo: roleCheckProcedure(routerName4, "deleteAbo").input(z9.string()).mutation(async ({ input, ctx }) => {
    const abonnementData = await ctx.prisma.abonnement.findUnique({
      where: { id: input },
      select: {
        id: true,
        ownerId: true
      }
    });
    if (!abonnementData || ctx.permission !== "ALL" /* ALL */ && ctx.session.id !== abonnementData.ownerId)
      throw new TRPCError4({ code: "UNAUTHORIZED" });
    await Promise.all([
      ctx.prisma.abonnement.update({
        where: { id: input },
        data: {
          status: "DELETED" /* DELETED */
        }
      }),
      ctx.prisma.reservation.updateMany({
        where: { abonnementId: input, start: { gt: /* @__PURE__ */ new Date() } },
        data: { deletedAt: /* @__PURE__ */ new Date() }
      })
    ]);
    return {};
  }),
  deleteUnapproved: publicProcedure.query(async ({ ctx }) => {
    await ctx.prisma.reservation.updateMany({
      where: { createdAt: { lt: subMinutes(/* @__PURE__ */ new Date(), 15) }, status: "REQUESTED" /* REQUESTED */, abonnementId: null },
      data: { deletedAt: /* @__PURE__ */ new Date() }
    });
    return true;
  }),
  getEmptyCourts: roleCheckProcedure(routerName4, "get").input(
    z9.object({
      areaId: z9.number().optional().nullable(),
      start: z9.date().min(/* @__PURE__ */ new Date()).optional().nullable(),
      end: z9.date().min(/* @__PURE__ */ new Date()).optional().nullable()
    })
  ).query(async ({ input, ctx }) => {
    const { areaId, start, end } = input;
    if (!areaId || !start || !end) return [];
    const availableCourts = await ctx.prisma.court.findMany({
      select: { id: true, name: true, shortName: true, order: true },
      orderBy: { order: "asc" },
      where: {
        //court needs to be active
        active: true,
        OR: [
          { activeFrom: { lt: start }, activeTo: { gt: start } },
          { activeFrom: null, activeTo: null }
        ],
        //and also area needs to be active
        area: {
          id: areaId,
          OR: [
            { activeFrom: { lt: start }, activeTo: { gt: start } },
            { activeFrom: null, activeTo: null }
          ]
        },
        reservations: {
          none: { OR: getBookingWhereClause(start, end) }
        }
      }
    });
    return availableCourts;
  })
});
var getBookingWhereClause = (startTime, endTime) => [
  {
    //Fall 1 + 2
    // neue Buchung beginnt vor alter Buchung, endet währenddessen oder gleichzeitig
    start: { gte: startTime, lt: endTime },
    end: { gte: endTime }
  },
  {
    //Fall 3 + 4
    // Buchung beginnt während alter Buchung und Endet danach
    start: { lte: startTime },
    end: { gt: startTime, lte: endTime }
  },
  {
    //Fall 5
    // Buchung beginnt und endet während alter
    start: { equals: startTime },
    end: { equals: endTime }
  },
  {
    //Fall 6
    // Buchung beginnt nach oder während alter und endet vor alter
    start: { lte: startTime },
    end: { gt: endTime }
  },
  {
    //Fall 7
    // Buchung beginnt vor alter und endet nach alter
    start: { gt: startTime },
    end: { lt: endTime }
  }
];
var getMultiCourtReservations = async (reservationData, courts, start, end) => {
  const reservations = [];
  for (const court of courts) {
    if (!await isAvailable(start, end, court)) continue;
    reservations.push({
      ...reservationData,
      courtId: court
    });
  }
  return reservations;
};
var getReservationNotPossibleMessage = (checkBookable) => {
  return `Es sind noch keine Buchungen m\xF6glich. ${checkBookable.area.bookableFrom ? `Buchungen k\xF6nnen erst ab dem ${formatDate(checkBookable.area.bookableFrom)} erstellt werden.` : checkBookable.activeFrom && checkBookable.activeTo ? `Buchungen k\xF6nnen vom ${formatDate(checkBookable.activeFrom)} - ${formatDate(checkBookable.activeTo)} erstellt werden.` : checkBookable.area.activeFrom && checkBookable.area.activeTo ? `Buchungen k\xF6nnen vom ${formatDate(checkBookable.area.activeFrom)} - ${formatDate(checkBookable.area.activeTo)} erstellt werden.` : "Es k\xF6nnen aktuell keine Buchungen get\xE4tigt werden."}`;
};
var checkReservation = (reservationData, courtSpecifications) => {
  const { start } = reservationData;
  if (start && (courtSpecifications.activeFrom && isBefore(start, courtSpecifications.activeFrom) || courtSpecifications.activeTo && isAfter(start, courtSpecifications.activeTo) || courtSpecifications.area.activeFrom && isBefore(start, courtSpecifications.area.activeFrom) || courtSpecifications.area.activeTo && isAfter(start, courtSpecifications.area.activeTo)) || courtSpecifications.area.bookableFrom && isBefore(/* @__PURE__ */ new Date(), courtSpecifications.area.bookableFrom)) {
    throw new TRPCError4({
      code: "CONFLICT",
      message: getReservationNotPossibleMessage(courtSpecifications)
    });
  }
};
var checkReservationRules = async (action, reservationData, courtSpecifications, roles) => {
  const { courtId } = reservationData;
  const reservationRules = await prisma.reservationRule.findMany({
    where: {
      checkOn: action,
      OR: [{ affectedCourts: courtId ? { some: { id: courtId } } : void 0 }, { affectedAreas: { some: { id: courtSpecifications.area.id } } }],
      validFor: roles ? {
        some: {
          id: roles[0]
        }
      } : void 0
    }
  });
  for (const reservationRule of reservationRules) {
    let canBook = true;
    if (reservationRule.ruleCheckPluginName && ruleCheckPlugins.hasOwnProperty(reservationRule.ruleCheckPluginName)) {
      const res = ruleCheckPlugins[reservationRule.ruleCheckPluginName](reservationData, reservationRule.value);
      if (typeof res === "boolean") canBook = res;
      else canBook = await res;
      if (!canBook)
        throw new TRPCError4({
          code: "CONFLICT",
          message: reservationRule.errorDescription ?? "Eine Buchungsregel verhindert deine Buchung."
        });
    }
  }
};
var invalidateReservation = (reservationId) => prisma.reservation.update({
  where: { id: reservationId },
  data: {
    deletedAt: /* @__PURE__ */ new Date()
  }
});

// src/router/routers/controlInterfaces.ts
var routerName5 = "controlInterface";
var controlInterfaceRouter = createTRPCRouter({
  create: roleCheckProcedure(routerName5, "create").input(controlInterfaceSchemaObject).mutation(({ input, ctx }) => {
    const { affectedCourts, ...data } = input;
    const modifiedAffectedCourts = affectedCourts?.map((id) => ({ id }));
    return ctx.prisma.controlInterface.create({
      data: { ...data, affectedCourts: { connect: modifiedAffectedCourts } }
    });
  }),
  get: roleCheckProcedure(routerName5, "get").input(z10.string()).query(
    async ({ ctx, input: id }) => ctx.prisma.controlInterface.findUnique({ where: { id }, include: { affectedCourts: { select: { id: true } } } })
  ),
  list: roleCheckProcedure(routerName5, "list").query(async ({ ctx }) => ctx.prisma.controlInterface.findMany({ orderBy: [{ title: "asc" }] })),
  update: roleCheckProcedure(routerName5, "update").input(z10.object({ id: z10.string(), ...controlInterfaceSchema })).mutation(({ input, ctx }) => {
    const { id, affectedCourts, ...data } = input;
    const modifiedAffectedCourts = affectedCourts?.map((id2) => ({ id: id2 }));
    return ctx.prisma.controlInterface.update({
      where: { id },
      data: {
        ...data,
        affectedCourts: { connect: modifiedAffectedCourts }
      }
    });
  }),
  delete: roleCheckProcedure(routerName5, "delete").input(z10.string()).mutation(({ input, ctx }) => ctx.prisma.controlInterface.delete({ where: { id: input } })),
  execute: publicProcedure.input(z10.string()).query(async ({ ctx, input: id }) => {
    const controlInterface = await ctx.prisma.controlInterface.findUnique({
      where: { id },
      include: { affectedCourts: { select: { id: true } } }
    });
    if (controlInterface) {
      const now = /* @__PURE__ */ new Date();
      const result = [];
      for (const court of controlInterface.affectedCourts) {
        const [isAvailablePre, isAvailablePost] = await Promise.all([
          isCourtAvailable(now, addMinutes(now, controlInterface.preBooking + 1), court.id),
          isCourtAvailable(subMinutes(now, controlInterface.postBooking + 1), now, court.id)
        ]);
        result.push(!(isAvailablePre && isAvailablePost));
      }
      if (controlInterface.connectByAnd) return result.every((v) => v);
      if (controlInterface.connectByOr) return result.some((v) => v);
      return result;
    }
    return null;
  })
});

// src/router/routers/court.ts
import { z as z12 } from "zod";

// src/schemes/court.ts
import { z as z11 } from "zod";
var courtSchema = {
  name: z11.string(),
  shortName: z11.string().nullable(),
  description: z11.string().nullable().optional(),
  active: z11.boolean().optional(),
  activeFrom: z11.date().nullable().optional(),
  activeTo: z11.date().nullable().optional(),
  areaId: z11.number(),
  order: z11.number().nullable().optional()
};
var courtSchemaObject = z11.object(courtSchema);

// src/router/routers/court.ts
var selectList2 = {
  id: true,
  name: true,
  shortName: true,
  active: true,
  activeFrom: true,
  activeTo: true,
  order: true,
  area: {
    select: { id: true, shortName: true }
  },
  _count: true
};
var routerName6 = "court";
var courtRouter = createTRPCRouter({
  create: roleCheckProcedure(routerName6, "create").input(courtSchemaObject).mutation(
    ({ input, ctx }) => ctx.prisma.court.create({
      data: input
    })
  ),
  list: roleCheckProcedure(routerName6, "list").query(
    ({ ctx }) => ctx.prisma.court.findMany({
      select: selectList2,
      orderBy: [{ order: "asc" }, { name: "asc" }]
    })
  ),
  get: roleCheckProcedure(routerName6, "get").input(z12.string()).query(
    ({ ctx, input }) => ctx.prisma.court.findUnique({
      where: { id: input },
      select: {
        id: true,
        name: true,
        shortName: true,
        description: true,
        active: true,
        activeFrom: true,
        activeTo: true,
        areaId: true,
        order: true
      }
    })
  ),
  update: roleCheckProcedure(routerName6, "update").input(z12.object({ id: z12.string(), ...courtSchema })).mutation(({ input, ctx }) => {
    const { id, ...data } = input;
    return ctx.prisma.court.update({
      where: { id },
      data
    });
  }),
  delete: roleCheckProcedure(routerName6, "delete").input(z12.string()).mutation(
    ({ input, ctx }) => ctx.prisma.court.delete({
      where: { id: input }
    })
  )
});

// src/router/routers/dashboard.ts
var routerName7 = "dashboard";
var dashboardRouter = createTRPCRouter({
  getMyNextReservations: roleCheckProcedure(routerName7, "getMyNextReservations").query(({ ctx }) => {
    return ctx.prisma.reservation.findMany({
      where: {
        OR: [{ ownerId: ctx.session.id }, { fellows: { some: { id: ctx.session.id } } }],
        end: { gt: /* @__PURE__ */ new Date() },
        deletedAt: null
      },
      select: {
        id: true,
        title: true,
        start: true,
        end: true,
        court: { select: { name: true } },
        abonnementId: true,
        fellows: { select: { name: true } }
      },
      orderBy: { start: "asc" },
      take: 4
    });
  }),
  needsSetup: roleCheckProcedure(routerName7, "needsSetup").query(
    ({ ctx }) => ctx.prisma.user.findUnique({ where: { id: ctx.session.id }, select: { needsSetup: true } })
  )
});

// src/router/routers/eventCategories.ts
import { z as z14 } from "zod";

// src/schemes/eventCategories.ts
import { z as z13 } from "zod";
var eventCategoriesSchema = {
  id: z13.string().optional(),
  slug: z13.string(),
  title: z13.string()
};
var eventCategoriesSchemaObject = z13.object(eventCategoriesSchema);

// src/router/routers/eventCategories.ts
var routerName8 = "eventCategories";
var eventCategoriesRouter = createTRPCRouter({
  upsert: roleCheckProcedure(routerName8, "upsert").input(eventCategoriesSchemaObject).mutation(({ input, ctx }) => {
    const { id, ...data } = input;
    return ctx.prisma.eventCategory.upsert({
      where: { id: id ?? "" },
      create: data,
      update: data
    });
  }),
  list: publicProcedure.query(
    ({ ctx }) => ctx.prisma.eventCategory.findMany({
      orderBy: [{ title: "asc" }],
      include: { _count: true }
    })
  ),
  get: publicProcedure.input(z14.string()).query(
    async ({ input, ctx }) => ctx.prisma.eventCategory.findUnique({
      where: { id: input },
      include: { _count: true }
    })
  ),
  delete: roleCheckProcedure(routerName8, "delete").input(z14.string()).mutation(
    ({ input, ctx }) => ctx.prisma.eventCategory.delete({
      where: { id: input }
    })
  )
});

// src/router/routers/events.ts
import { z as z16 } from "zod";

// src/schemes/event.ts
import { z as z15 } from "zod";
var eventSchema = {
  id: z15.string().optional(),
  title: z15.string(),
  description: z15.string().nullable().optional(),
  categoryId: z15.string(),
  image: z15.string().nullable().optional(),
  start: z15.date(),
  end: z15.date().nullable().optional(),
  canceled: z15.boolean().optional(),
  revised: z15.boolean().optional(),
  link: z15.string().nullable().optional(),
  location: z15.string().nullable().optional()
};
var eventSchemaObject = z15.object(eventSchema);

// src/router/routers/events.ts
var include = { _count: true, category: { select: { title: true } } };
var routerName9 = "events";
var eventsRouter = createTRPCRouter({
  upsert: roleCheckProcedure(routerName9, "upsert").input(eventSchemaObject).mutation(({ input, ctx }) => {
    const { id, ...data } = input;
    return ctx.prisma.event.upsert({
      where: { id: id ?? "" },
      create: data,
      update: data
    });
  }),
  list: publicProcedure.input(
    z16.object({
      limit: z16.number().min(1).max(100).nullish(),
      cursor: z16.string().nullish(),
      filterByCategory: z16.string().optional()
    })
  ).query(async ({ ctx, input }) => {
    const limit = input.limit ?? 50;
    const { cursor } = input;
    const items = await ctx.prisma.event.findMany({
      take: limit + 1,
      // get an extra item at the end which we'll use as next cursor
      where: input.filterByCategory ? { categoryId: input.filterByCategory } : void 0,
      cursor: cursor ? { id: cursor } : void 0,
      orderBy: [{ start: "asc" }],
      include
    });
    let nextCursor = null;
    if (items.length > limit) {
      const nextItem = items.pop();
      if (nextItem) nextCursor = nextItem.id;
    }
    return {
      items,
      nextCursor
    };
  }),
  listUpcoming: publicProcedure.input(
    z16.object({
      limit: z16.number().min(1).max(100).nullish(),
      cursor: z16.string().nullish(),
      filterByCategorySlug: z16.string().optional()
    })
  ).query(async ({ ctx, input }) => {
    const limit = input.limit ?? 5;
    const { cursor } = input;
    const items = await ctx.prisma.event.findMany({
      take: limit + 1,
      // get an extra item at the end which we'll use as next cursor
      where: {
        category: input.filterByCategorySlug ? { slug: input.filterByCategorySlug } : void 0,
        end: { gte: /* @__PURE__ */ new Date() }
      },
      cursor: cursor ? { id: cursor } : void 0,
      orderBy: [{ start: "asc" }],
      include
    });
    let nextCursor = null;
    if (items.length > limit) {
      const nextItem = items.pop();
      if (nextItem) nextCursor = nextItem.id;
    }
    return {
      items,
      nextCursor
    };
  }),
  get: publicProcedure.input(z16.string()).query(
    async ({ input, ctx }) => ctx.prisma.event.findUnique({
      where: { id: input },
      include
    })
  ),
  delete: roleCheckProcedure(routerName9, "delete").input(z16.string()).mutation(
    ({ input, ctx }) => ctx.prisma.event.delete({
      where: { id: input }
    })
  ),
  listEventLocations: publicProcedure.query(async ({ ctx }) => {
    const result = [];
    const locations = await ctx.prisma.event.findMany({
      select: { location: true },
      where: { location: { not: null } },
      distinct: ["location"]
    });
    for (const location of locations) {
      if (location.location) result.push(location.location);
    }
    return result;
  })
});

// src/router/routers/hallencard.ts
import { z as z18 } from "zod";

// src/schemes/hallencard.ts
import { z as z17 } from "zod";
var createHallencardSchema = {
  value: z17.number()
};
var createHallencardSchemaObject = z17.object(createHallencardSchema);
var useHallencardSchema = {
  code: z17.string(),
  pin: z17.string().length(6)
};
var useHallencardForAnotherPersonSchema = {
  code: z17.string(),
  userId: z17.string()
};
var HallencardStatus = /* @__PURE__ */ ((HallencardStatus2) => {
  HallencardStatus2["CREATED"] = "CREATED";
  HallencardStatus2["PRINTED"] = "PRINTED";
  HallencardStatus2["USED"] = "USED";
  return HallencardStatus2;
})(HallencardStatus || {});

// src/router/routers/hallencard.ts
var routerName10 = "hallencard";
var hallencardRouter = createTRPCRouter({
  create: roleCheckProcedure(routerName10, "create").input(z18.object(createHallencardSchema)).mutation(
    ({ input, ctx }) => ctx.prisma.hallencard.create({
      data: {
        code: createHallencardCode(),
        pin: createHallencardPin().toString(),
        value: input.value,
        printed: false
      }
    })
  ),
  list: roleCheckProcedure(routerName10, "list").input(
    z18.object({
      limit: z18.number().min(1).max(100).nullish(),
      cursor: z18.string().nullish(),
      status: z18.nativeEnum(HallencardStatus).nullish()
    })
  ).query(async ({ ctx, input }) => {
    const limit = input.limit ?? 50;
    const { cursor, status } = input;
    let whereClause = {
      printed: true,
      transactionId: { not: null }
    };
    if (status === "CREATED" /* CREATED */) whereClause = { printed: false, transactionId: null };
    if (status === "PRINTED" /* PRINTED */) whereClause = { printed: true, transactionId: null };
    const items = await ctx.prisma.hallencard.findMany({
      select: {
        code: true,
        printed: true,
        value: true,
        transaction: { select: { user: { select: { name: true, image: true } } } }
      },
      cursor: cursor ? { code: cursor } : void 0,
      where: whereClause,
      orderBy: [{ code: "asc" }],
      take: limit + 1
    });
    let nextCursor = null;
    if (items.length > limit) {
      const nextItem = items.pop();
      if (nextItem) nextCursor = nextItem.code;
    }
    return {
      items,
      nextCursor
    };
  }),
  print: roleCheckProcedure(routerName10, "print").input(z18.string()).query(async ({ ctx, input }) => {
    const card = await ctx.prisma.hallencard.findUnique({
      where: { code: input }
    });
    return ctx.prisma.hallencard.update({ where: { code: card?.code }, data: { printed: true } });
  }),
  overview: roleCheckProcedure(routerName10, "overview").query(async ({ ctx }) => {
    const [myHallencards, myCurrentValue] = await Promise.all([
      ctx.prisma.hallencard.findMany({
        select: { code: true, value: true, transaction: { select: { createdAt: true } } },
        where: { transaction: { userId: ctx.session.id } },
        orderBy: { transaction: { createdAt: "desc" } },
        take: 10
      }),
      ctx.prisma.transaction.groupBy({
        by: ["userId"],
        where: { userId: ctx.session.id, deleted: false },
        _sum: { value: true }
      })
    ]);
    return { myHallencards, myCurrentValue };
  }),
  use: roleCheckProcedure(routerName10, "use").input(z18.object(useHallencardSchema)).mutation(async ({ input, ctx }) => {
    const hallencard = await ctx.prisma.hallencard.findFirstOrThrow({
      where: { code: input.code, pin: input.pin, transactionId: null }
    });
    return ctx.prisma.transaction.create({
      data: {
        value: hallencard.value,
        currency: "EUR",
        reason: "HALLENCARD_RECHARGE" /* HALLENCARD_RECHARGE */,
        hallencard: { connect: { code: hallencard.code } },
        user: { connect: { id: ctx.session.id } }
      }
    });
  }),
  useForAnotherPerson: roleCheckProcedure(routerName10, "useForAnotherPerson").input(z18.object(useHallencardForAnotherPersonSchema)).mutation(async ({ input, ctx }) => {
    const hallencard = await ctx.prisma.hallencard.findFirstOrThrow({
      where: { code: input.code, transactionId: null }
    });
    await ctx.prisma.hallencard.update({ where: { code: input.code }, data: { printed: true } });
    return ctx.prisma.transaction.create({
      data: {
        value: hallencard.value,
        currency: "EUR",
        reason: "HALLENCARD_RECHARGE" /* HALLENCARD_RECHARGE */,
        hallencard: { connect: { code: hallencard.code } },
        user: { connect: { id: input.userId } }
      }
    });
  })
});

// src/router/routers/notification.ts
import { TRPCError as TRPCError5 } from "@trpc/server";
import { z as z20 } from "zod";

// src/schemes/notification.ts
import { z as z19 } from "zod";
var notificationSchema = {
  title: z19.string(),
  message: z19.string().nullable().optional(),
  severity: z19.nativeEnum(NotificationSeverity),
  showFrom: z19.date(),
  showTo: z19.date()
};
var notificationSchemaObject = z19.object(notificationSchema);

// src/router/routers/notification.ts
var routerName11 = "notification";
var notificationRouter = createTRPCRouter({
  create: roleCheckProcedure(routerName11, "create").input(z20.object(notificationSchema)).mutation(
    ({ input, ctx }) => ctx.prisma.notification.create({
      data: input
    })
  ),
  get: roleCheckProcedure(routerName11, "get").input(z20.string()).query(
    async ({ ctx, input }) => ctx.prisma.notification.findUnique({
      where: { id: input }
    })
  ),
  list: roleCheckProcedure(routerName11, "list").input(
    z20.object({
      limit: z20.number().min(1).max(100).nullish(),
      cursor: z20.string().nullish(),
      all: z20.boolean().optional()
    })
  ).query(async ({ ctx, input }) => {
    const limit = input.limit ?? 50;
    const { cursor } = input;
    const today = /* @__PURE__ */ new Date();
    if (input.all && ctx.permission !== "ALL" /* ALL */) throw new TRPCError5({ code: "UNAUTHORIZED" });
    const items = await ctx.prisma.notification.findMany({
      select: { id: true, title: true, message: true, severity: true, showFrom: !!input.all, showTo: !!input.all },
      where: input.all ? void 0 : { showFrom: { lte: today }, showTo: { gte: today } },
      orderBy: [{ showFrom: "asc" }],
      take: input.all ? limit + 1 : void 0,
      cursor: cursor ? { id: cursor } : void 0
    });
    let nextCursor = null;
    if (items.length > limit) {
      const nextItem = items.pop();
      nextCursor = nextItem?.id;
    }
    return {
      items,
      nextCursor
    };
  }),
  update: roleCheckProcedure(routerName11, "update").input(z20.object({ id: z20.string(), ...notificationSchema })).mutation(({ input, ctx }) => {
    const { id, ...data } = input;
    return ctx.prisma.notification.update({
      where: { id },
      data
    });
  }),
  delete: roleCheckProcedure(routerName11, "delete").input(z20.string()).mutation(
    ({ input, ctx }) => ctx.prisma.notification.delete({
      where: { id: input }
    })
  )
});

// src/router/routers/organisationMembers.ts
import { z as z22 } from "zod";

// src/schemes/organisationMember.ts
import { z as z21 } from "zod";
var organisationMemberSchema = {
  id: z21.string().optional(),
  fullName: z21.string(),
  function: z21.string().optional().nullable(),
  image: z21.string().optional().nullable(),
  email: z21.string().optional().nullable(),
  phone: z21.string().optional().nullable(),
  orderID: z21.number().optional().nullable(),
  organisationId: z21.string(),
  parentMemberId: z21.string().optional().nullable(),
  childMembers: z21.string().array().optional().nullable()
};
var organisationMemberSchemaObject = z21.object(organisationMemberSchema);

// src/router/routers/organisationMembers.ts
var routerName12 = "organisationMembers";
var organisationMembersRouter = createTRPCRouter({
  upsert: roleCheckProcedure(routerName12, "upsert").input(organisationMemberSchemaObject).mutation(({ input, ctx }) => {
    const { id, childMembers, ...data } = input;
    const children = childMembers?.map((value) => ({ id: value }));
    return ctx.prisma.organisationMember.upsert({
      where: { id: id ?? "" },
      create: { ...data, childMembers: { connect: children } },
      update: { ...data, childMembers: { set: children } }
    });
  }),
  list: publicProcedure.input(
    z22.object({
      limit: z22.number().min(1).max(100).nullish(),
      cursor: z22.string().nullish(),
      organisation: z22.string()
    })
  ).query(async ({ ctx, input }) => {
    const limit = input.limit ?? 50;
    const { cursor } = input;
    const items = await ctx.prisma.organisationMember.findMany({
      take: limit + 1,
      // get an extra item at the end which we'll use as next cursor
      cursor: cursor ? { id: cursor } : void 0,
      orderBy: { orderID: "asc" },
      where: { OR: [{ organisationId: input.organisation }, { organisation: { slug: input.organisation } }] }
    });
    let nextCursor = null;
    if (items.length > limit) {
      const nextItem = items.pop();
      if (nextItem) nextCursor = nextItem.id;
    }
    return {
      items,
      nextCursor
    };
  }),
  get: publicProcedure.input(z22.string()).query(
    async ({ input, ctx }) => ctx.prisma.organisationMember.findUnique({
      where: { id: input },
      include: {
        childMembers: { select: { id: true } }
      }
    })
  ),
  delete: roleCheckProcedure(routerName12, "delete").input(z22.string()).mutation(
    ({ input, ctx }) => ctx.prisma.organisationMember.delete({
      where: { id: input }
    })
  )
});

// src/router/routers/organisations.ts
import { z as z24 } from "zod";

// src/schemes/organisation.ts
import { z as z23 } from "zod";
var organisationSchema = {
  id: z23.string().optional(),
  slug: z23.string(),
  title: z23.string()
};
var organisationSchemaObject = z23.object(organisationSchema);

// src/router/routers/organisations.ts
var routerName13 = "organisations";
var organisationsRouter = createTRPCRouter({
  upsert: roleCheckProcedure(routerName13, "upsert").input(organisationSchemaObject).mutation(({ input, ctx }) => {
    const { id, ...data } = input;
    return ctx.prisma.organisation.upsert({
      where: { id: id ?? "" },
      create: data,
      update: data
    });
  }),
  list: publicProcedure.input(
    z24.object({
      limit: z24.number().min(1).max(100).nullish(),
      cursor: z24.string().nullish()
    })
  ).query(async ({ ctx, input }) => {
    const limit = input.limit ?? 50;
    const { cursor } = input;
    const items = await ctx.prisma.organisation.findMany({
      take: limit + 1,
      // get an extra item at the end which we'll use as next cursor
      cursor: cursor ? { id: cursor } : void 0,
      orderBy: [{ title: "asc" }],
      include: { _count: true }
    });
    let nextCursor = null;
    if (items.length > limit) {
      const nextItem = items.pop();
      if (nextItem) nextCursor = nextItem.id;
    }
    return {
      items,
      nextCursor
    };
  }),
  get: publicProcedure.input(z24.string().optional()).query(
    async ({ input, ctx }) => input ? ctx.prisma.organisation.findFirst({
      where: { OR: [{ slug: input }, { id: input }] },
      include: { members: { orderBy: { orderID: "asc" } } }
    }) : null
  ),
  delete: roleCheckProcedure(routerName13, "delete").input(z24.string()).mutation(
    ({ input, ctx }) => ctx.prisma.organisation.delete({
      where: { id: input }
    })
  )
});

// src/router/routers/permission.ts
import { TRPCError as TRPCError6 } from "@trpc/server";
import { z as z25 } from "zod";
var primaryCheck = {
  router: z25.string(),
  action: z25.string(),
  userRoleId: z25.number()
};
var allowedCheck = z25.nativeEnum(PermissionState2);
var routerName14 = "permission";
var permissionRouter = createTRPCRouter({
  create: roleCheckProcedure(routerName14, "create").input(
    z25.object({
      ...primaryCheck,
      allowed: allowedCheck
    })
  ).mutation(
    ({ input, ctx }) => ctx.prisma.permission.create({
      data: input
    })
  ),
  createMany: roleCheckProcedure(routerName14, "createMany").input(
    z25.object({
      userRoleId: z25.number(),
      router: z25.string(),
      actions: z25.string().array(),
      allowed: allowedCheck
    })
  ).mutation(({ input, ctx }) => {
    const { userRoleId, router, allowed } = input;
    const newPermissions = input.actions.map((action) => ({ userRoleId, router, allowed, action }));
    return ctx.prisma.permission.createMany({
      data: newPermissions
    });
  }),
  list: roleCheckProcedure(routerName14, "list").input(
    z25.object({
      limit: z25.number().min(1).max(100).nullish(),
      cursor: z25.object(primaryCheck).nullish(),
      filterByRoleId: z25.number().optional()
    })
  ).query(async ({ ctx, input }) => {
    if (ctx.permission !== "ALL" /* ALL */) throw new TRPCError6({ code: "UNAUTHORIZED" });
    const limit = input.limit ?? 50;
    const { cursor } = input;
    const items = await ctx.prisma.permission.findMany({
      take: limit + 1,
      // get an extra item at the end which we'll use as next cursor
      where: { userRoleId: input.filterByRoleId },
      cursor: cursor ? { router_action_userRoleId: cursor } : void 0,
      orderBy: [{ router: "asc" }, { action: "asc" }]
    });
    let nextCursor = null;
    if (items.length > limit) {
      const nextItem = items.pop();
      if (nextItem) {
        nextCursor = {
          router: nextItem.router,
          action: nextItem.action,
          userRoleId: nextItem.userRoleId
        };
      }
    }
    return {
      items,
      nextCursor
    };
  }),
  getByRouterAndRoleId: roleCheckProcedure(routerName14, "getByRouterAndRoleId").input(
    z25.object({
      router: z25.string(),
      userRoleId: z25.number()
    })
  ).query(async ({ input, ctx }) => {
    const { router, userRoleId } = input;
    const permissions = await ctx.prisma.permission.findMany({
      where: { router, userRoleId },
      select: { action: true }
    });
    return permissions.map((item) => item.action);
  }),
  getApplicationDialogPermission: roleCheckProcedure(routerName14, "getApplicationDialogPermission").input(z25.nativeEnum(ApplicationDialogPermission)).query(async ({ input, ctx }) => {
    const permissions = await ctx.prisma.permission.findMany({
      where: {
        userRoleId: { in: ctx.session?.roles ?? [] },
        router: "applicationDialogPermissions",
        action: input
      },
      select: { allowed: true }
    });
    let highestPermission = "NONE" /* NONE */;
    for (const permission of permissions) {
      if (permission.allowed === "OWN" /* OWN */) highestPermission = "OWN" /* OWN */;
      if (permission.allowed === "ALL" /* ALL */) return "ALL" /* ALL */;
    }
    return highestPermission;
  }),
  getMenuPermissions: roleCheckProcedure(routerName14, "getMenuPermissions").query(async ({ ctx }) => {
    if (ctx.session) {
      const permissions = await ctx.prisma.permission.findMany({
        where: {
          userRoleId: { in: ctx.session?.roles ?? [] },
          router: "menuPermissions",
          allowed: "ALL" /* ALL */
        },
        select: { action: true }
      });
      const result = [];
      for (const permission of permissions) {
        if (!result.includes(permission.action)) result.push(permission.action);
      }
      return result;
    }
  }),
  update: roleCheckProcedure(routerName14, "update").input(
    z25.object({
      ...primaryCheck,
      allowed: allowedCheck
    })
  ).mutation(({ input, ctx }) => {
    const { router, action, userRoleId, allowed } = input;
    return ctx.prisma.permission.update({
      where: { router_action_userRoleId: { router, action, userRoleId } },
      data: { allowed }
    });
  }),
  delete: roleCheckProcedure(routerName14, "delete").input(z25.object(primaryCheck)).mutation(({ input, ctx }) => {
    return ctx.prisma.permission.delete({
      where: { router_action_userRoleId: input }
    });
  })
});

// src/router/routers/price.ts
import { z as z27 } from "zod";

// src/schemes/price.ts
import { z as z26 } from "zod";
var priceSchema = {
  validFrom: z26.date().optional(),
  validTo: z26.date().optional(),
  isDefault: z26.boolean().optional(),
  mon: z26.boolean().optional(),
  tue: z26.boolean().optional(),
  wed: z26.boolean().optional(),
  thu: z26.boolean().optional(),
  fri: z26.boolean().optional(),
  sat: z26.boolean().optional(),
  sun: z26.boolean().optional(),
  from: z26.string(),
  to: z26.string(),
  value: z26.number(),
  taxes: z26.number(),
  currency: z26.string(),
  roles: z26.string().array(),
  areas: z26.string().array()
};

// src/router/routers/price.ts
var routerName15 = "price";
var priceRouter = createTRPCRouter({
  create: roleCheckProcedure(routerName15, "create").input(z27.object(priceSchema)).mutation(({ input, ctx }) => {
    const { roles, areas, from, to, ...rest } = input;
    const rolesToAdd = roles.map((item) => ({ id: parseInt(item) }));
    const areasToAdd = areas.map((item) => ({ id: parseInt(item) }));
    return ctx.prisma.price.create({
      data: {
        ...rest,
        from: parseInt(from.replace(":", "")),
        to: parseInt(to.replace(":", "")),
        roles: { connect: rolesToAdd },
        areas: { connect: areasToAdd }
      }
    });
  }),
  get: roleCheckProcedure(routerName15, "get").input(z27.string()).query(
    async ({ ctx, input }) => ctx.prisma.price.findUnique({
      where: { id: input },
      select: {
        id: true,
        validFrom: true,
        validTo: true,
        roles: { select: { id: true, title: true } },
        areas: { select: { id: true, name: true } },
        isDefault: true,
        mon: true,
        tue: true,
        wed: true,
        thu: true,
        fri: true,
        sat: true,
        sun: true,
        from: true,
        to: true,
        value: true,
        taxes: true,
        currency: true
      }
    })
  ),
  list: roleCheckProcedure(routerName15, "list").input(
    z27.object({
      limit: z27.number().min(1).max(100).nullish(),
      cursor: z27.string().nullish(),
      filterByRoleId: z27.number().optional()
    })
  ).query(async ({ ctx, input }) => {
    const limit = input.limit ?? 50;
    const { cursor } = input;
    const items = await ctx.prisma.price.findMany({
      select: {
        id: true,
        validFrom: true,
        validTo: true,
        roles: { select: { id: true, title: true } },
        areas: { select: { id: true, name: true } },
        isDefault: true,
        mon: true,
        tue: true,
        wed: true,
        thu: true,
        fri: true,
        sat: true,
        sun: true,
        from: true,
        to: true,
        value: true,
        currency: true
      },
      where: { roles: { some: input.filterByRoleId ? { id: input.filterByRoleId } : void 0 } },
      orderBy: [{ validFrom: "asc" }, { validTo: "asc" }],
      cursor
    });
    let nextCursor = null;
    if (items.length > limit) {
      const nextItem = items.pop();
      nextCursor = nextItem?.id;
    }
    return {
      items,
      nextCursor
    };
  }),
  update: roleCheckProcedure(routerName15, "update").input(z27.object({ id: z27.string(), ...priceSchema })).mutation(({ input, ctx }) => {
    const { id, roles, areas, from, to, ...rest } = input;
    const rolesToAdd = roles.map((item) => ({ id: parseInt(item) }));
    const areasToAdd = areas.map((item) => ({ id: parseInt(item) }));
    return ctx.prisma.price.update({
      where: { id },
      data: {
        ...rest,
        from: parseInt(from.replace(":", "")),
        to: parseInt(to.replace(":", "")),
        roles: { set: rolesToAdd },
        areas: { set: areasToAdd }
      }
    });
  }),
  delete: roleCheckProcedure(routerName15, "delete").input(z27.string()).mutation(
    ({ input, ctx }) => ctx.prisma.price.delete({
      where: { id: input }
    })
  )
});

// src/router/routers/reservationRule.ts
import { z as z29 } from "zod";

// src/schemes/reservationRule.ts
import { z as z28 } from "zod";
var reservationRuleSchema = {
  name: z28.string(),
  errorDescription: z28.string().optional(),
  validFor: z28.string().array().optional(),
  affectedAreas: z28.string().array().optional(),
  affectedCourts: z28.string().array().optional(),
  checkOn: z28.nativeEnum(ReservationRuleCheckOn),
  ruleCheckPluginName: z28.string().optional(),
  value: z28.string()
};

// src/router/routers/reservationRule.ts
var routerName16 = "reservationRule";
var reservationRuleRouter = createTRPCRouter({
  create: roleCheckProcedure(routerName16, "create").input(z29.object(reservationRuleSchema)).mutation(
    ({ ctx, input }) => ctx.prisma.reservationRule.create({
      data: {
        ...input,
        validFor: { connect: input.validFor?.map((i) => ({ id: parseInt(i) })) },
        affectedAreas: { connect: input.affectedAreas?.map((i) => ({ id: parseInt(i) })) },
        affectedCourts: { connect: input.affectedCourts?.map((i) => ({ id: i })) }
      }
    })
  ),
  list: roleCheckProcedure(routerName16, "list").query(
    ({ ctx }) => ctx.prisma.reservationRule.findMany({
      select: {
        id: true,
        name: true,
        checkOn: true,
        validFor: { select: { title: true } },
        affectedAreas: { select: { name: true } },
        affectedCourts: { select: { name: true } }
      }
    })
  ),
  get: roleCheckProcedure(routerName16, "get").input(z29.string()).query(
    ({ ctx, input }) => ctx.prisma.reservationRule.findUnique({
      where: { id: input },
      select: {
        id: true,
        name: true,
        errorDescription: true,
        checkOn: true,
        ruleCheckPluginName: true,
        value: true,
        validFor: { select: { id: true, title: true } },
        affectedAreas: { select: { id: true, name: true } },
        affectedCourts: { select: { id: true, name: true } }
      }
    })
  ),
  update: roleCheckProcedure(routerName16, "update").input(z29.object({ id: z29.string(), ...reservationRuleSchema })).mutation(({ ctx, input }) => {
    const { id, ...data } = input;
    return ctx.prisma.reservationRule.update({
      where: { id },
      data: {
        ...data,
        validFor: { set: data.validFor?.map((i) => ({ id: parseInt(i) })) },
        affectedAreas: { set: data.affectedAreas?.map((i) => ({ id: parseInt(i) })) },
        affectedCourts: { set: data.affectedCourts?.map((i) => ({ id: i })) }
      }
    });
  }),
  delete: roleCheckProcedure(routerName16, "delete").input(z29.string()).mutation(({ ctx, input }) => ctx.prisma.reservationRule.delete({ where: { id: input } }))
});

// src/router/routers/season.ts
import { z as z31 } from "zod";

// src/schemes/season.ts
import { z as z30 } from "zod";
var seasonSchema = {
  id: z30.number().optional(),
  name: z30.string(),
  shortName: z30.string(),
  starting: z30.date(),
  ending: z30.date()
};
var seasonSchemaObject = z30.object(seasonSchema);

// src/router/routers/season.ts
var routerName17 = "season";
var seasonRouter = createTRPCRouter({
  upsert: roleCheckProcedure(routerName17, "upsert").input(seasonSchemaObject).mutation(({ input, ctx }) => {
    const { id, ...data } = input;
    return ctx.prisma.season.upsert({
      where: { id: id ?? 0 },
      create: data,
      update: data
    });
  }),
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.season.findMany({
      orderBy: [{ starting: "desc" }],
      include: { _count: true }
    });
  }),
  get: publicProcedure.input(z31.number()).query(
    async ({ input, ctx }) => ctx.prisma.season.findUnique({
      where: { id: input },
      include: { _count: true }
    })
  ),
  getCurrentSeason: publicProcedure.query(
    async ({ ctx }) => ctx.prisma.season.findFirst({
      where: { current: true }
    })
  ),
  setCurrentSeason: roleCheckProcedure(routerName17, "setCurrentSeason").input(z31.number()).mutation(
    async ({ input, ctx }) => ctx.prisma.$transaction([
      ctx.prisma.season.update({
        where: { id: input },
        data: { current: true }
      }),
      ctx.prisma.season.updateMany({
        where: { id: { not: input } },
        data: { current: false }
      })
    ])
  ),
  listActiveAndFuture: publicProcedure.input(z31.object({ teamFilter: z31.number().optional(), invertTeamFilter: z31.boolean().optional() })).query(
    async ({ input, ctx }) => ctx.prisma.season.findMany({
      where: {
        ending: { gte: /* @__PURE__ */ new Date() },
        teams: input.teamFilter ? {
          none: input.invertTeamFilter ? { teamId: input.teamFilter } : void 0,
          some: !input.invertTeamFilter ? { teamId: input.teamFilter } : void 0
        } : void 0
      }
    })
  ),
  delete: roleCheckProcedure(routerName17, "delete").input(z31.number()).mutation(({ input, ctx }) => ctx.prisma.season.delete({ where: { id: input } }))
});

// src/router/routers/team.ts
import { z as z33 } from "zod";

// src/schemes/team.ts
import { z as z32 } from "zod";
var teamSchema = {
  id: z32.number().optional(),
  name: z32.string(),
  shortName: z32.string(),
  category: z32.nativeEnum(TeamCategory),
  orderNumber: z32.number()
};
var teamSchemaObject = z32.object(teamSchema);

// src/router/routers/team.ts
var routerName18 = "team";
var teamRouter = createTRPCRouter({
  upsert: roleCheckProcedure(routerName18, "upsert").input(teamSchemaObject).mutation(({ input, ctx }) => {
    const { id, ...data } = input;
    if (id) {
      return ctx.prisma.team.update({
        where: { id },
        data
      });
    }
    return ctx.prisma.team.create({
      data
    });
  }),
  list: publicProcedure.query(
    async ({ ctx }) => ctx.prisma.team.findMany({
      orderBy: [{ orderNumber: "asc" }]
    })
  ),
  get: publicProcedure.input(z33.number().optional()).query(
    async ({ input, ctx }) => input ? ctx.prisma.team.findUnique({
      where: { id: input },
      include: { _count: true }
    }) : {}
  ),
  delete: roleCheckProcedure(routerName18, "delete").input(z33.number()).mutation(({ input, ctx }) => ctx.prisma.team.delete({ where: { id: input } }))
});

// src/router/routers/teamSeason.ts
import { z as z35 } from "zod";

// src/schemes/teamSeason.ts
import { z as z34 } from "zod";
var teamSeasonSchema = {
  teamId: z34.number(),
  seasonId: z34.number(),
  teamLeaderId: z34.string().nullable().optional(),
  nuGroupId: z34.string(),
  nuTeamId: z34.string(),
  leagueName: z34.string()
};
var teamSeasonSchemaObject = z34.object(teamSeasonSchema);

// src/router/routers/teamSeason.ts
var routerName19 = "teamSeason";
var teamSeasonRouter = createTRPCRouter({
  get: publicProcedure.input(z35.object({ seasonId: z35.number(), teamId: z35.number() })).query(
    async ({ ctx, input }) => ctx.prisma.teamSeason.findUnique({
      where: { teamId_seasonId: { teamId: input.teamId, seasonId: input.seasonId } }
    })
  ),
  upsert: roleCheckProcedure(routerName19, "upsert").input(teamSeasonSchemaObject).mutation(({ input, ctx }) => {
    const { teamId, seasonId, ...data } = input;
    return ctx.prisma.teamSeason.upsert({
      where: { teamId_seasonId: { teamId, seasonId } },
      create: { teamId, seasonId, ...data },
      update: data
    });
  }),
  listBySeasonId: publicProcedure.input(z35.number()).query(async ({ ctx, input }) => {
    return ctx.prisma.teamSeason.findMany({
      orderBy: [{ team: { name: "asc" } }],
      include: { team: { select: { name: true } } },
      where: { seasonId: input }
    });
  }),
  listByTeamId: publicProcedure.input(z35.number()).query(async ({ ctx, input }) => {
    return ctx.prisma.teamSeason.findMany({
      orderBy: [{ season: { starting: "desc" } }],
      include: { season: { select: { name: true } } },
      where: { teamId: input }
    });
  }),
  listByCategory: publicProcedure.input(z35.object({ category: z35.nativeEnum(TeamCategory), season: z35.number().optional() })).query(async ({ ctx, input }) => {
    let seasonId = input.season;
    if (!seasonId) {
      const currentSeason = await ctx.prisma.season.findFirst({
        where: { current: true }
      });
      if (!currentSeason) return [];
      seasonId = currentSeason.id;
    }
    return ctx.prisma.teamSeason.findMany({
      select: { leagueName: true, nuGroupId: true, nuTeamId: true, team: { select: { name: true } } },
      orderBy: [{ team: { orderNumber: "asc" } }],
      where: { team: { category: input.category }, seasonId }
    });
  }),
  listLeagueNames: publicProcedure.query(async ({ ctx }) => {
    const result = [];
    const teamSeasons = await ctx.prisma.teamSeason.findMany({
      select: { leagueName: true },
      distinct: ["leagueName"]
    });
    for (const { leagueName } of teamSeasons) {
      if (leagueName && leagueName !== null) result.push(leagueName);
    }
    return result;
  }),
  delete: roleCheckProcedure(routerName19, "delete").input(z35.object({ teamId: z35.number(), seasonId: z35.number() })).mutation(({ input, ctx }) => ctx.prisma.teamSeason.delete({ where: { teamId_seasonId: input } }))
});

// src/router/routers/user.ts
import { TRPCError as TRPCError7 } from "@trpc/server";
import { z as z37 } from "zod";

// src/schemes/user.ts
import { z as z36 } from "zod";
var userSchema = {
  id: z36.string().optional(),
  name: z36.string().min(6),
  email: z36.string().optional().nullable(),
  password: z36.string().optional(),
  image: z36.string().optional().nullable(),
  phoneNumber: z36.string().min(5),
  address: z36.string().min(2),
  cityCode: z36.string().min(5),
  cityName: z36.string().min(2),
  countryCode: z36.string().optional().nullable(),
  roles: z36.string().array().optional(),
  publicName: z36.boolean().optional()
};
var userSchemaObject = z36.object(userSchema);

// src/router/routers/user.ts
var routerName20 = "user";
var userRouter = createTRPCRouter({
  get: roleCheckProcedure(routerName20, "get").input(z37.string().optional()).query(async ({ ctx, input }) => {
    if (ctx.permission !== "ALL" /* ALL */ && ctx.permission === "OWN" /* OWN */ && input !== void 0 && input !== ctx.session.id)
      throw new TRPCError7({ code: "UNAUTHORIZED" });
    const userId = input ?? ctx.session.id;
    return ctx.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        address: true,
        cityCode: true,
        cityName: true,
        countryCode: true,
        phoneNumber: true,
        publicName: true,
        roles: { select: { id: true, title: true, description: true } }
      }
    });
  }),
  update: roleCheckProcedure(routerName20, "update").input(userSchemaObject).mutation(async ({ ctx, input }) => {
    if (ctx.permission !== "ALL" /* ALL */ && ctx.permission === "OWN" /* OWN */ && input.id !== ctx.session.id)
      throw new TRPCError7({ code: "UNAUTHORIZED" });
    const { id, roles, ...data } = input;
    const setRoles = roles?.map((i) => ({ id: parseInt(i) }));
    return ctx.prisma.user.update({
      where: { id },
      data: {
        ...data,
        roles: setRoles ? { set: setRoles } : void 0,
        needsSetup: false
      }
    });
  }),
  updateRoles: roleCheckProcedure(routerName20, "updateRoles").input(z37.object({ id: z37.string(), roles: z37.string().array() })).mutation(async ({ ctx, input }) => {
    if (ctx.permission !== "ALL" /* ALL */ && ctx.permission === "OWN" /* OWN */ && input.id !== ctx.session.id)
      throw new TRPCError7({ code: "UNAUTHORIZED" });
    const { id, roles } = input;
    const setRoles = roles.map((i) => ({ id: parseInt(i) }));
    return ctx.prisma.user.update({
      where: { id },
      data: {
        roles: setRoles ? { set: setRoles } : void 0
      }
    });
  }),
  delete: roleCheckProcedure(routerName20, "delete").input(z37.string()).query(async ({ ctx, input }) => ctx.prisma.user.delete({ where: { id: input } })),
  getAutosuggestOptions: roleCheckProcedure(routerName20, "getAutosuggestOptions").input(z37.string()).query(async ({ ctx, input }) => {
    return ctx.prisma.user.findMany({
      where: {
        OR: [{ name: { contains: input } }, { email: { contains: input } }],
        id: { not: ctx.session.id }
      },
      select: {
        id: true,
        name: true,
        image: true,
        email: true
      },
      orderBy: { name: "asc" },
      take: 5
    });
  })
});

// src/router/routers/userRole.ts
import { z as z39 } from "zod";

// src/schemes/userRole.ts
import { z as z38 } from "zod";
var userRoleSchema = {
  title: z38.string(),
  description: z38.string().optional().nullable(),
  priority: z38.number(),
  isDefault: z38.boolean()
};
var userRoleSchemaObject = z38.object(userRoleSchema);

// src/router/routers/userRole.ts
var routerName21 = "userRole";
var userRoleRouter = createTRPCRouter({
  create: roleCheckProcedure(routerName21, "create").input(userRoleSchemaObject).mutation(
    ({ input, ctx }) => ctx.prisma.userRole.create({
      data: input
    })
  ),
  list: roleCheckProcedure(routerName21, "list").query(({ ctx }) => {
    let where;
    if (ctx.permission !== "ALL" /* ALL */) where = { users: { some: { id: ctx.session.id } } };
    return ctx.prisma.userRole.findMany({
      select: { id: true, title: true, description: true, _count: true },
      where
    });
  }),
  get: roleCheckProcedure(routerName21, "get").input(z39.number()).query(({ ctx, input }) => {
    let additionalWhere;
    if (ctx.permission !== "ALL" /* ALL */) additionalWhere = { users: { some: { id: ctx.session.id } } };
    return ctx.prisma.userRole.findFirstOrThrow({
      where: { id: input, ...additionalWhere },
      select: {
        id: true,
        title: true,
        description: true,
        isDefault: true,
        _count: true
      }
    });
  }),
  getUsersByRole: roleCheckProcedure(routerName21, "getUsersByRole").input(z39.number()).query(({ ctx, input }) => {
    return ctx.prisma.user.findMany({
      where: { roles: { some: { id: input } } },
      select: {
        id: true,
        name: true,
        email: true,
        image: true
      }
    });
  }),
  getAddableUsers: roleCheckProcedure(routerName21, "getAddableUsers").input(z39.number()).query(({ ctx, input }) => {
    return ctx.prisma.user.findMany({
      where: { roles: { none: { id: input } } },
      select: {
        id: true,
        name: true,
        email: true,
        image: true
      }
    });
  }),
  update: roleCheckProcedure(routerName21, "update").input(z39.object({ id: z39.number(), ...userRoleSchema })).mutation(
    ({ input, ctx }) => ctx.prisma.userRole.update({
      where: { id: input.id },
      data: { title: input.title, description: input.description, isDefault: input.isDefault }
    })
  ),
  delete: roleCheckProcedure(routerName21, "delete").input(z39.number()).mutation(
    ({ input, ctx }) => ctx.prisma.userRole.delete({
      where: { id: input }
    })
  ),
  removeUserFromRole: roleCheckProcedure(routerName21, "removeUserFromRole").input(z39.object({ userId: z39.string(), roleId: z39.number() })).mutation(
    ({ input, ctx }) => ctx.prisma.userRole.update({
      where: { id: input.roleId },
      data: { users: { disconnect: { id: input.userId } } }
    })
  ),
  addUsersToRole: roleCheckProcedure(routerName21, "addUsersToRole").input(z39.object({ userIds: z39.string().array(), roleId: z39.number() })).mutation(({ input, ctx }) => {
    const usersToAdd = input.userIds.map((item) => ({ id: item }));
    return ctx.prisma.userRole.update({
      where: { id: input.roleId },
      data: { users: { connect: usersToAdd } }
    });
  })
});

// src/router/routers/membership.ts
var routerName22 = "membership";
var membershipRouter = createTRPCRouter({
  getMembershipCardData: roleCheckProcedure(routerName22, "get").query(({ ctx }) => {
    try {
      const membershipToken = generateMembershipToken({ id: ctx.session.id, name: ctx.session.name, email: ctx.session.email });
      return { id: ctx.session.id, name: ctx.session.name, email: ctx.session.email, membershipToken };
    } catch (error) {
      console.error("Error generating membership token:", error);
    }
  })
});

// src/router/routers/index.ts
var appRouter = createTRPCRouter({
  area: areaRouter,
  benefit: benefitRouter,
  controlInterface: controlInterfaceRouter,
  court: courtRouter,
  dashboard: dashboardRouter,
  events: eventsRouter,
  eventCategories: eventCategoriesRouter,
  hallencard: hallencardRouter,
  membership: membershipRouter,
  notification: notificationRouter,
  organisations: organisationsRouter,
  organisationMembers: organisationMembersRouter,
  permission: permissionRouter,
  price: priceRouter,
  reservation: reservationRouter,
  reservationRule: reservationRuleRouter,
  season: seasonRouter,
  team: teamRouter,
  teamSeason: teamSeasonRouter,
  transaction: transactionRouter,
  user: userRouter,
  userRole: userRoleRouter
});

// src/servers/express.ts
import express from "express";
import cors from "cors";
var createTRPCMiddleware = trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext,
  onError: env.NODE_ENV === "development" ? ({ path, error }) => {
    console.log(`\u274C tRPC failed on ${path ?? "<no-path>"}: ${JSON.stringify(error)}`);
  } : void 0
});
var app = express();
app.use(cors());
app.use("/trpc", createTRPCMiddleware);
app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: "ok", db: "connected" });
  } catch (error) {
    console.error("DB check failed:", error);
    res.status(500).json({ status: "error", db: "disconnected" });
  }
});
app.listen(parseInt(env.PORT), () => console.log(`Server is running on http://localhost:${env.PORT}/trpc`));
export {
  createTRPCMiddleware
};
//# sourceMappingURL=express.mjs.map