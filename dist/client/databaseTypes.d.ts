declare enum ReservationType {
    TOURNAMENT = "TOURNAMENT",
    MAINTENANCE = "MAINTENANCE",
    TEAM_PRACTICE = "TEAM_PRACTICE",
    TEAM_COMPETITION = "TEAM_COMPETITION"
}
declare enum ReservationStatus {
    REQUESTED = "REQUESTED",
    BILLED = "BILLED",
    APPROVED = "APPROVED"
}
declare enum ReservationRuleCheckOn {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE"
}
declare enum AbonnementStatus {
    REQUESTED = "REQUESTED",
    APPROVED = "APPROVED",
    BILLED = "BILLED",
    PAID = "PAID",
    DELETED = "DELETED"
}
declare enum PermissionState {
    NONE = "NONE",
    OWN = "OWN",
    ALL = "ALL"
}
declare enum TransactionReason {
    HALLENCARD_RECHARGE = "HALLENCARD_RECHARGE",
    INVOICE = "INVOICE",
    ONLINE_PAYMENT = "ONLINE_PAYMENT",
    BANK_TRANSFER = "BANK_TRANSFER",
    COURT_RESERVATION = "COURT_RESERVATION",
    COURT_RESERVATION_STORNO = "COURT_RESERVATION_STORNO",
    REFUND = "REFUND",
    DONATION = "DONATION"
}
declare enum TeamCategory {
    Men = "Men",
    Women = "Women",
    Youth = "Youth"
}
declare enum NotificationSeverity {
    ERROR = "ERROR",
    WARNING = "WARNING",
    INFO = "INFO",
    SUCCESS = "SUCCESS"
}
interface User {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    auth0Id: string;
    address: string | null;
    cityCode: string | null;
    cityName: string | null;
    countryCode: string | null;
    needsSetup: boolean;
    publicName: boolean;
    phoneNumber: string | null;
    abonnements?: Abonnement[];
    ownedReservations?: Reservation[];
    fellowedReservations?: Reservation[];
    transactions?: Transaction[];
    teams?: TeamMember[];
    leadTeams?: TeamSeason[];
    roles?: UserRole[];
    likedEvents?: Event[];
}
interface VerificationToken {
    identifier: string;
    token: string;
    expires: Date;
}
interface Area {
    id: number;
    name: string;
    shortName: string;
    activeFrom: Date | null;
    activeTo: Date | null;
    bookableFrom: Date | null;
    order: number | null;
    courts?: Court[];
    reservationRules?: ReservationRule[];
    prices?: Price[];
}
interface Court {
    id: string;
    name: string;
    shortName: string | null;
    description: string | null;
    order: number | null;
    active: boolean;
    activeFrom: Date | null;
    activeTo: Date | null;
    area?: Area;
    areaId: number;
    abonnements?: Abonnement[];
    reservations?: Reservation[];
    reservationRules?: ReservationRule[];
    controlInterfaces?: ControlInterface[];
}
interface Reservation {
    id: string;
    title: string;
    start: Date;
    end: Date;
    court?: Court | null;
    courtId: string | null;
    status: ReservationStatus;
    type: ReservationType | null;
    paypalTransactionId: string | null;
    price: number | null;
    taxRate: number | null;
    light: boolean;
    radiator: boolean;
    abo?: Abonnement | null;
    abonnementId: string | null;
    owner?: User | null;
    ownerId: string | null;
    fellows?: User[];
    transactions?: Transaction[];
    createdAt: Date;
    deletedAt: Date | null;
}
interface ReservationRule {
    id: string;
    name: string;
    errorDescription: string | null;
    validFor?: UserRole[];
    affectedAreas?: Area[];
    affectedCourts?: Court[];
    checkOn: ReservationRuleCheckOn;
    ruleCheckPluginName: string | null;
    value: string;
}
interface Abonnement {
    id: string;
    name: string;
    weekday: number;
    start: Date;
    duration: number;
    status: AbonnementStatus;
    court?: Court | null;
    courtId: string | null;
    owner?: User | null;
    ownerId: string | null;
    transactions?: Transaction[];
    reservations?: Reservation[];
}
interface UserRole {
    id: number;
    title: string;
    description: string | null;
    isDefault: boolean;
    permissions?: Permission[];
    users?: User[];
    prices?: Price[];
    reservationRules?: ReservationRule[];
    priority: number;
}
interface Permission {
    router: string;
    action: string;
    userRole?: UserRole;
    userRoleId: number;
    allowed: PermissionState;
}
interface Hallencard {
    code: string;
    pin: string;
    value: number;
    printed: boolean;
    transaction?: Transaction | null;
    transactionId: string | null;
}
interface Price {
    id: string;
    validFrom: Date | null;
    validTo: Date | null;
    isDefault: boolean;
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
    sun: boolean;
    from: number;
    to: number;
    value: number;
    currency: string;
    taxes: number;
    roles?: UserRole[];
    areas?: Area[];
}
interface Transaction {
    id: string;
    user?: User | null;
    userId: string | null;
    value: number;
    currency: string;
    reason: TransactionReason;
    paymentInformation: string | null;
    hallencard?: Hallencard | null;
    reservation?: Reservation | null;
    reservationId: string | null;
    abonnement?: Abonnement | null;
    abonnementId: string | null;
    createdAt: Date;
    deleted: boolean;
}
interface Season {
    id: number;
    name: string;
    shortName: string;
    starting: Date;
    ending: Date;
    current: boolean;
    teams?: TeamSeason[];
    players?: TeamMember[];
}
interface Team {
    id: number;
    name: string;
    shortName: string;
    category: TeamCategory;
    orderNumber: number;
    teamSeasons?: TeamSeason[];
    members?: TeamMember[];
}
interface TeamSeason {
    team?: Team;
    teamId: number;
    season?: Season;
    seasonId: number;
    teamLeader?: User | null;
    teamLeaderId: string | null;
    nuGroupId: string;
    nuTeamId: string;
    leagueName: string;
}
interface TeamMember {
    user?: User;
    userId: string;
    team?: Team;
    teamId: number;
    season?: Season;
    seasonId: number;
}
interface Notification {
    id: string;
    title: string;
    message: string | null;
    severity: NotificationSeverity;
    showFrom: Date;
    showTo: Date;
}
interface Benefit {
    id: string;
    title: string;
    description: string | null;
    image: string | null;
    cover: boolean;
    link: string | null;
    activeFrom: Date | null;
    activeTo: Date | null;
}
interface ControlInterface {
    id: string;
    title: string;
    description: string;
    preBooking: number;
    postBooking: number;
    connectByAnd: boolean;
    connectByOr: boolean;
    affectedCourts?: Court[];
}
interface Organisation {
    id: string;
    slug: string;
    title: string;
    members?: OrganisationMember[];
}
interface OrganisationMember {
    id: string;
    fullName: string;
    function: string | null;
    image: string | null;
    email: string | null;
    phone: string | null;
    orderID: number | null;
    organisation?: Organisation;
    organisationId: string;
    parentMember?: OrganisationMember | null;
    parentMemberId: string | null;
    childMembers?: OrganisationMember[];
}
interface EventCategory {
    id: string;
    slug: string;
    title: string;
    events?: Event[];
}
interface Event {
    id: string;
    title: string;
    description: string | null;
    image: string | null;
    start: Date;
    end: Date | null;
    canceled: boolean;
    revised: boolean;
    link: string | null;
    location: string | null;
    category?: EventCategory;
    categoryId: string;
    likedByUsers?: User[];
}

export { type Abonnement, AbonnementStatus, type Area, type Benefit, type ControlInterface, type Court, type Event, type EventCategory, type Hallencard, type Notification, NotificationSeverity, type Organisation, type OrganisationMember, type Permission, PermissionState, type Price, type Reservation, type ReservationRule, ReservationRuleCheckOn, ReservationStatus, ReservationType, type Season, type Team, TeamCategory, type TeamMember, type TeamSeason, type Transaction, TransactionReason, type User, type UserRole, type VerificationToken };
