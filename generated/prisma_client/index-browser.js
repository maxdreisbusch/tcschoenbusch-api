
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  image: 'image',
  auth0Id: 'auth0Id',
  address: 'address',
  cityCode: 'cityCode',
  cityName: 'cityName',
  countryCode: 'countryCode',
  needsSetup: 'needsSetup',
  publicName: 'publicName',
  phoneNumber: 'phoneNumber'
};

exports.Prisma.VerificationTokenScalarFieldEnum = {
  identifier: 'identifier',
  token: 'token',
  expires: 'expires'
};

exports.Prisma.AreaScalarFieldEnum = {
  id: 'id',
  name: 'name',
  shortName: 'shortName',
  activeFrom: 'activeFrom',
  activeTo: 'activeTo',
  bookableFrom: 'bookableFrom',
  order: 'order'
};

exports.Prisma.CourtScalarFieldEnum = {
  id: 'id',
  name: 'name',
  shortName: 'shortName',
  description: 'description',
  order: 'order',
  active: 'active',
  activeFrom: 'activeFrom',
  activeTo: 'activeTo',
  areaId: 'areaId'
};

exports.Prisma.ReservationScalarFieldEnum = {
  id: 'id',
  title: 'title',
  start: 'start',
  end: 'end',
  courtId: 'courtId',
  status: 'status',
  type: 'type',
  paypalTransactionId: 'paypalTransactionId',
  price: 'price',
  taxRate: 'taxRate',
  light: 'light',
  radiator: 'radiator',
  abonnementId: 'abonnementId',
  ownerId: 'ownerId',
  createdAt: 'createdAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.ReservationRuleScalarFieldEnum = {
  id: 'id',
  name: 'name',
  errorDescription: 'errorDescription',
  checkOn: 'checkOn',
  ruleCheckPluginName: 'ruleCheckPluginName',
  value: 'value'
};

exports.Prisma.AbonnementScalarFieldEnum = {
  id: 'id',
  name: 'name',
  weekday: 'weekday',
  start: 'start',
  duration: 'duration',
  status: 'status',
  courtId: 'courtId',
  ownerId: 'ownerId'
};

exports.Prisma.UserRoleScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  isDefault: 'isDefault',
  priority: 'priority'
};

exports.Prisma.PermissionScalarFieldEnum = {
  router: 'router',
  action: 'action',
  userRoleId: 'userRoleId',
  allowed: 'allowed'
};

exports.Prisma.HallencardScalarFieldEnum = {
  code: 'code',
  pin: 'pin',
  value: 'value',
  printed: 'printed',
  transactionId: 'transactionId'
};

exports.Prisma.PriceScalarFieldEnum = {
  id: 'id',
  validFrom: 'validFrom',
  validTo: 'validTo',
  isDefault: 'isDefault',
  mon: 'mon',
  tue: 'tue',
  wed: 'wed',
  thu: 'thu',
  fri: 'fri',
  sat: 'sat',
  sun: 'sun',
  from: 'from',
  to: 'to',
  value: 'value',
  currency: 'currency',
  taxes: 'taxes'
};

exports.Prisma.TransactionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  value: 'value',
  currency: 'currency',
  reason: 'reason',
  paymentInformation: 'paymentInformation',
  reservationId: 'reservationId',
  abonnementId: 'abonnementId',
  createdAt: 'createdAt',
  deleted: 'deleted'
};

exports.Prisma.SeasonScalarFieldEnum = {
  id: 'id',
  name: 'name',
  shortName: 'shortName',
  starting: 'starting',
  ending: 'ending',
  current: 'current'
};

exports.Prisma.TeamScalarFieldEnum = {
  id: 'id',
  name: 'name',
  shortName: 'shortName',
  category: 'category',
  orderNumber: 'orderNumber'
};

exports.Prisma.TeamSeasonScalarFieldEnum = {
  teamId: 'teamId',
  seasonId: 'seasonId',
  teamLeaderId: 'teamLeaderId',
  nuGroupId: 'nuGroupId',
  nuTeamId: 'nuTeamId',
  leagueName: 'leagueName'
};

exports.Prisma.TeamMemberScalarFieldEnum = {
  userId: 'userId',
  teamId: 'teamId',
  seasonId: 'seasonId'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  title: 'title',
  message: 'message',
  severity: 'severity',
  showFrom: 'showFrom',
  showTo: 'showTo'
};

exports.Prisma.BenefitScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  image: 'image',
  cover: 'cover',
  link: 'link',
  activeFrom: 'activeFrom',
  activeTo: 'activeTo'
};

exports.Prisma.ControlInterfaceScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  preBooking: 'preBooking',
  postBooking: 'postBooking',
  connectByAnd: 'connectByAnd',
  connectByOr: 'connectByOr'
};

exports.Prisma.OrganisationScalarFieldEnum = {
  id: 'id',
  slug: 'slug',
  title: 'title'
};

exports.Prisma.OrganisationMemberScalarFieldEnum = {
  id: 'id',
  fullName: 'fullName',
  function: 'function',
  image: 'image',
  email: 'email',
  phone: 'phone',
  orderID: 'orderID',
  organisationId: 'organisationId',
  parentMemberId: 'parentMemberId'
};

exports.Prisma.EventCategoryScalarFieldEnum = {
  id: 'id',
  slug: 'slug',
  title: 'title'
};

exports.Prisma.EventScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  image: 'image',
  start: 'start',
  end: 'end',
  canceled: 'canceled',
  revised: 'revised',
  link: 'link',
  location: 'location',
  categoryId: 'categoryId'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.ReservationStatus = exports.$Enums.ReservationStatus = {
  REQUESTED: 'REQUESTED',
  BILLED: 'BILLED',
  APPROVED: 'APPROVED'
};

exports.ReservationType = exports.$Enums.ReservationType = {
  TOURNAMENT: 'TOURNAMENT',
  MAINTENANCE: 'MAINTENANCE',
  TEAM_PRACTICE: 'TEAM_PRACTICE',
  TEAM_COMPETITION: 'TEAM_COMPETITION'
};

exports.ReservationRuleCheckOn = exports.$Enums.ReservationRuleCheckOn = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE'
};

exports.AbonnementStatus = exports.$Enums.AbonnementStatus = {
  REQUESTED: 'REQUESTED',
  APPROVED: 'APPROVED',
  BILLED: 'BILLED',
  PAID: 'PAID',
  DELETED: 'DELETED'
};

exports.PermissionState = exports.$Enums.PermissionState = {
  NONE: 'NONE',
  OWN: 'OWN',
  ALL: 'ALL'
};

exports.TransactionReason = exports.$Enums.TransactionReason = {
  HALLENCARD_RECHARGE: 'HALLENCARD_RECHARGE',
  INVOICE: 'INVOICE',
  ONLINE_PAYMENT: 'ONLINE_PAYMENT',
  BANK_TRANSFER: 'BANK_TRANSFER',
  COURT_RESERVATION: 'COURT_RESERVATION',
  COURT_RESERVATION_STORNO: 'COURT_RESERVATION_STORNO',
  REFUND: 'REFUND',
  DONATION: 'DONATION'
};

exports.TeamCategory = exports.$Enums.TeamCategory = {
  Men: 'Men',
  Women: 'Women',
  Youth: 'Youth'
};

exports.NotificationSeverity = exports.$Enums.NotificationSeverity = {
  ERROR: 'ERROR',
  WARNING: 'WARNING',
  INFO: 'INFO',
  SUCCESS: 'SUCCESS'
};

exports.Prisma.ModelName = {
  User: 'User',
  VerificationToken: 'VerificationToken',
  Area: 'Area',
  Court: 'Court',
  Reservation: 'Reservation',
  ReservationRule: 'ReservationRule',
  Abonnement: 'Abonnement',
  UserRole: 'UserRole',
  Permission: 'Permission',
  Hallencard: 'Hallencard',
  Price: 'Price',
  Transaction: 'Transaction',
  Season: 'Season',
  Team: 'Team',
  TeamSeason: 'TeamSeason',
  TeamMember: 'TeamMember',
  Notification: 'Notification',
  Benefit: 'Benefit',
  ControlInterface: 'ControlInterface',
  Organisation: 'Organisation',
  OrganisationMember: 'OrganisationMember',
  EventCategory: 'EventCategory',
  Event: 'Event'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
