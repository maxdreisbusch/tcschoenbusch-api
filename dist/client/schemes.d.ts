import { z } from 'zod';
export { H as HallencardStatus, c as createHallencardSchema, a as createHallencardSchemaObject, b as useHallencardForAnotherPersonSchema, u as useHallencardSchema } from './hallencard-BBLfHFZf.js';
import { NotificationSeverity, ReservationType, ReservationRuleCheckOn, TeamCategory, TransactionReason } from './databaseTypes.js';

declare const benefitSchema: {
    title: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    image: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    cover: z.ZodOptional<z.ZodBoolean>;
    link: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    activeFrom: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
    activeTo: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
};
declare const benefitSchemaObject: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    image: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    cover: z.ZodOptional<z.ZodBoolean>;
    link: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    activeFrom: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
    activeTo: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
}, "strip", z.ZodTypeAny, {
    description: string | null;
    title: string;
    link?: string | null | undefined;
    activeFrom?: Date | null | undefined;
    activeTo?: Date | null | undefined;
    image?: string | null | undefined;
    cover?: boolean | undefined;
}, {
    description: string | null;
    title: string;
    link?: string | null | undefined;
    activeFrom?: Date | null | undefined;
    activeTo?: Date | null | undefined;
    image?: string | null | undefined;
    cover?: boolean | undefined;
}>;

declare const controlInterfaceSchema: {
    title: z.ZodString;
    description: z.ZodString;
    preBooking: z.ZodNumber;
    postBooking: z.ZodNumber;
    connectByAnd: z.ZodOptional<z.ZodBoolean>;
    connectByOr: z.ZodOptional<z.ZodBoolean>;
    affectedCourts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
};
declare const controlInterfaceSchemaObject: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    preBooking: z.ZodNumber;
    postBooking: z.ZodNumber;
    connectByAnd: z.ZodOptional<z.ZodBoolean>;
    connectByOr: z.ZodOptional<z.ZodBoolean>;
    affectedCourts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    description: string;
    title: string;
    preBooking: number;
    postBooking: number;
    connectByAnd?: boolean | undefined;
    connectByOr?: boolean | undefined;
    affectedCourts?: string[] | undefined;
}, {
    description: string;
    title: string;
    preBooking: number;
    postBooking: number;
    connectByAnd?: boolean | undefined;
    connectByOr?: boolean | undefined;
    affectedCourts?: string[] | undefined;
}>;

declare const courtSchema: {
    name: z.ZodString;
    shortName: z.ZodNullable<z.ZodString>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    active: z.ZodOptional<z.ZodBoolean>;
    activeFrom: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
    activeTo: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
    areaId: z.ZodNumber;
    order: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
};
declare const courtSchemaObject: z.ZodObject<{
    name: z.ZodString;
    shortName: z.ZodNullable<z.ZodString>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    active: z.ZodOptional<z.ZodBoolean>;
    activeFrom: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
    activeTo: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
    areaId: z.ZodNumber;
    order: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    areaId: number;
    shortName: string | null;
    description?: string | null | undefined;
    activeFrom?: Date | null | undefined;
    activeTo?: Date | null | undefined;
    order?: number | null | undefined;
    active?: boolean | undefined;
}, {
    name: string;
    areaId: number;
    shortName: string | null;
    description?: string | null | undefined;
    activeFrom?: Date | null | undefined;
    activeTo?: Date | null | undefined;
    order?: number | null | undefined;
    active?: boolean | undefined;
}>;

declare const eventSchema: {
    id: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    categoryId: z.ZodString;
    image: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    start: z.ZodDate;
    end: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
    canceled: z.ZodOptional<z.ZodBoolean>;
    revised: z.ZodOptional<z.ZodBoolean>;
    link: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    location: z.ZodOptional<z.ZodNullable<z.ZodString>>;
};
declare const eventSchemaObject: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    categoryId: z.ZodString;
    image: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    start: z.ZodDate;
    end: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
    canceled: z.ZodOptional<z.ZodBoolean>;
    revised: z.ZodOptional<z.ZodBoolean>;
    link: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    location: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    start: Date;
    categoryId: string;
    link?: string | null | undefined;
    description?: string | null | undefined;
    id?: string | undefined;
    image?: string | null | undefined;
    end?: Date | null | undefined;
    canceled?: boolean | undefined;
    revised?: boolean | undefined;
    location?: string | null | undefined;
}, {
    title: string;
    start: Date;
    categoryId: string;
    link?: string | null | undefined;
    description?: string | null | undefined;
    id?: string | undefined;
    image?: string | null | undefined;
    end?: Date | null | undefined;
    canceled?: boolean | undefined;
    revised?: boolean | undefined;
    location?: string | null | undefined;
}>;

declare const eventCategoriesSchema: {
    id: z.ZodOptional<z.ZodString>;
    slug: z.ZodString;
    title: z.ZodString;
};
declare const eventCategoriesSchemaObject: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    slug: z.ZodString;
    title: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    slug: string;
    id?: string | undefined;
}, {
    title: string;
    slug: string;
    id?: string | undefined;
}>;

declare const notificationSchema: {
    title: z.ZodString;
    message: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    severity: z.ZodNativeEnum<typeof NotificationSeverity>;
    showFrom: z.ZodDate;
    showTo: z.ZodDate;
};
declare const notificationSchemaObject: z.ZodObject<{
    title: z.ZodString;
    message: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    severity: z.ZodNativeEnum<typeof NotificationSeverity>;
    showFrom: z.ZodDate;
    showTo: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    title: string;
    severity: NotificationSeverity;
    showFrom: Date;
    showTo: Date;
    message?: string | null | undefined;
}, {
    title: string;
    severity: NotificationSeverity;
    showFrom: Date;
    showTo: Date;
    message?: string | null | undefined;
}>;

declare const organisationSchema: {
    id: z.ZodOptional<z.ZodString>;
    slug: z.ZodString;
    title: z.ZodString;
};
declare const organisationSchemaObject: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    slug: z.ZodString;
    title: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    slug: string;
    id?: string | undefined;
}, {
    title: string;
    slug: string;
    id?: string | undefined;
}>;

declare const organisationMemberSchema: {
    id: z.ZodOptional<z.ZodString>;
    fullName: z.ZodString;
    function: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    image: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    phone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    orderID: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    organisationId: z.ZodString;
    parentMemberId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    childMembers: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
};
declare const organisationMemberSchemaObject: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    fullName: z.ZodString;
    function: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    image: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    phone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    orderID: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    organisationId: z.ZodString;
    parentMemberId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    childMembers: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    fullName: string;
    organisationId: string;
    function?: string | null | undefined;
    id?: string | undefined;
    image?: string | null | undefined;
    email?: string | null | undefined;
    orderID?: number | null | undefined;
    phone?: string | null | undefined;
    parentMemberId?: string | null | undefined;
    childMembers?: string[] | null | undefined;
}, {
    fullName: string;
    organisationId: string;
    function?: string | null | undefined;
    id?: string | undefined;
    image?: string | null | undefined;
    email?: string | null | undefined;
    orderID?: number | null | undefined;
    phone?: string | null | undefined;
    parentMemberId?: string | null | undefined;
    childMembers?: string[] | null | undefined;
}>;

declare const priceSchema: {
    validFrom: z.ZodOptional<z.ZodDate>;
    validTo: z.ZodOptional<z.ZodDate>;
    isDefault: z.ZodOptional<z.ZodBoolean>;
    mon: z.ZodOptional<z.ZodBoolean>;
    tue: z.ZodOptional<z.ZodBoolean>;
    wed: z.ZodOptional<z.ZodBoolean>;
    thu: z.ZodOptional<z.ZodBoolean>;
    fri: z.ZodOptional<z.ZodBoolean>;
    sat: z.ZodOptional<z.ZodBoolean>;
    sun: z.ZodOptional<z.ZodBoolean>;
    from: z.ZodString;
    to: z.ZodString;
    value: z.ZodNumber;
    taxes: z.ZodNumber;
    currency: z.ZodString;
    roles: z.ZodArray<z.ZodString, "many">;
    areas: z.ZodArray<z.ZodString, "many">;
};

declare const createReservationSchema: {
    title: z.ZodOptional<z.ZodString>;
    start: z.ZodDate;
    duration: z.ZodString;
    courtId: z.ZodString;
    type: z.ZodOptional<z.ZodNativeEnum<typeof ReservationType>>;
    ownerId: z.ZodOptional<z.ZodString>;
    fellows: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
    }, {
        name: string;
        id: string;
    }>, "many">>;
    courts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    repeatInterval: z.ZodOptional<z.ZodNumber>;
    repeatUntil: z.ZodOptional<z.ZodDate>;
    repeatApproved: z.ZodOptional<z.ZodBoolean>;
};
declare const createReservationSchemaObject: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    start: z.ZodDate;
    duration: z.ZodString;
    courtId: z.ZodString;
    type: z.ZodOptional<z.ZodNativeEnum<typeof ReservationType>>;
    ownerId: z.ZodOptional<z.ZodString>;
    fellows: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
    }, {
        name: string;
        id: string;
    }>, "many">>;
    courts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    repeatInterval: z.ZodOptional<z.ZodNumber>;
    repeatUntil: z.ZodOptional<z.ZodDate>;
    repeatApproved: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    start: Date;
    courtId: string;
    duration: string;
    type?: ReservationType | undefined;
    courts?: string[] | undefined;
    title?: string | undefined;
    ownerId?: string | undefined;
    fellows?: {
        name: string;
        id: string;
    }[] | undefined;
    repeatInterval?: number | undefined;
    repeatUntil?: Date | undefined;
    repeatApproved?: boolean | undefined;
}, {
    start: Date;
    courtId: string;
    duration: string;
    type?: ReservationType | undefined;
    courts?: string[] | undefined;
    title?: string | undefined;
    ownerId?: string | undefined;
    fellows?: {
        name: string;
        id: string;
    }[] | undefined;
    repeatInterval?: number | undefined;
    repeatUntil?: Date | undefined;
    repeatApproved?: boolean | undefined;
}>;
type CreateReservationSchemaType = z.infer<typeof createReservationSchemaObject>;
declare const getPriceSchema: {
    start: z.ZodDate;
    end: z.ZodDate;
    courtId: z.ZodString;
};
declare const updateReservationSchema: {
    id: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    start: z.ZodOptional<z.ZodDate>;
    end: z.ZodOptional<z.ZodDate>;
    courtId: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodNativeEnum<typeof ReservationType>>;
    ownerId: z.ZodOptional<z.ZodString>;
    fellows: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    light: z.ZodOptional<z.ZodBoolean>;
    radiator: z.ZodOptional<z.ZodBoolean>;
};

declare const reservationRuleSchema: {
    name: z.ZodString;
    errorDescription: z.ZodOptional<z.ZodString>;
    validFor: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    affectedAreas: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    affectedCourts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    checkOn: z.ZodNativeEnum<typeof ReservationRuleCheckOn>;
    ruleCheckPluginName: z.ZodOptional<z.ZodString>;
    value: z.ZodString;
};

declare const seasonSchema: {
    id: z.ZodOptional<z.ZodNumber>;
    name: z.ZodString;
    shortName: z.ZodString;
    starting: z.ZodDate;
    ending: z.ZodDate;
};
declare const seasonSchemaObject: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    name: z.ZodString;
    shortName: z.ZodString;
    starting: z.ZodDate;
    ending: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    name: string;
    shortName: string;
    starting: Date;
    ending: Date;
    id?: number | undefined;
}, {
    name: string;
    shortName: string;
    starting: Date;
    ending: Date;
    id?: number | undefined;
}>;
type SeasonSchemaType = z.infer<typeof seasonSchemaObject>;

declare const teamSchema: {
    id: z.ZodOptional<z.ZodNumber>;
    name: z.ZodString;
    shortName: z.ZodString;
    category: z.ZodNativeEnum<typeof TeamCategory>;
    orderNumber: z.ZodNumber;
};
declare const teamSchemaObject: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    name: z.ZodString;
    shortName: z.ZodString;
    category: z.ZodNativeEnum<typeof TeamCategory>;
    orderNumber: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    name: string;
    shortName: string;
    category: TeamCategory;
    orderNumber: number;
    id?: number | undefined;
}, {
    name: string;
    shortName: string;
    category: TeamCategory;
    orderNumber: number;
    id?: number | undefined;
}>;
type TeamSchemaType = z.infer<typeof teamSchemaObject>;

declare const teamSeasonSchema: {
    teamId: z.ZodNumber;
    seasonId: z.ZodNumber;
    teamLeaderId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    nuGroupId: z.ZodString;
    nuTeamId: z.ZodString;
    leagueName: z.ZodString;
};
declare const teamSeasonSchemaObject: z.ZodObject<{
    teamId: z.ZodNumber;
    seasonId: z.ZodNumber;
    teamLeaderId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    nuGroupId: z.ZodString;
    nuTeamId: z.ZodString;
    leagueName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    teamId: number;
    seasonId: number;
    nuGroupId: string;
    nuTeamId: string;
    leagueName: string;
    teamLeaderId?: string | null | undefined;
}, {
    teamId: number;
    seasonId: number;
    nuGroupId: string;
    nuTeamId: string;
    leagueName: string;
    teamLeaderId?: string | null | undefined;
}>;
type TeamSeasonSchemaType = z.infer<typeof teamSeasonSchemaObject>;

declare const transactionSchema: {
    userId: z.ZodString;
    reason: z.ZodNativeEnum<typeof TransactionReason>;
    value: z.ZodNumber;
    currency: z.ZodString;
    reservationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
};
declare const transactionSchemaObject: z.ZodObject<{
    userId: z.ZodString;
    reason: z.ZodNativeEnum<typeof TransactionReason>;
    value: z.ZodNumber;
    currency: z.ZodString;
    reservationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    value: number;
    userId: string;
    currency: string;
    reason: TransactionReason;
    reservationId?: string | null | undefined;
}, {
    value: number;
    userId: string;
    currency: string;
    reason: TransactionReason;
    reservationId?: string | null | undefined;
}>;

declare const userSchema: {
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    password: z.ZodOptional<z.ZodString>;
    image: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    phoneNumber: z.ZodString;
    address: z.ZodString;
    cityCode: z.ZodString;
    cityName: z.ZodString;
    countryCode: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    roles: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    publicName: z.ZodOptional<z.ZodBoolean>;
};
declare const userSchemaObject: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    password: z.ZodOptional<z.ZodString>;
    image: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    phoneNumber: z.ZodString;
    address: z.ZodString;
    cityCode: z.ZodString;
    cityName: z.ZodString;
    countryCode: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    roles: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    publicName: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    address: string;
    cityCode: string;
    cityName: string;
    phoneNumber: string;
    id?: string | undefined;
    image?: string | null | undefined;
    email?: string | null | undefined;
    countryCode?: string | null | undefined;
    publicName?: boolean | undefined;
    roles?: string[] | undefined;
    password?: string | undefined;
}, {
    name: string;
    address: string;
    cityCode: string;
    cityName: string;
    phoneNumber: string;
    id?: string | undefined;
    image?: string | null | undefined;
    email?: string | null | undefined;
    countryCode?: string | null | undefined;
    publicName?: boolean | undefined;
    roles?: string[] | undefined;
    password?: string | undefined;
}>;

declare const userRoleSchema: {
    title: z.ZodString;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    priority: z.ZodNumber;
    isDefault: z.ZodBoolean;
};
declare const userRoleSchemaObject: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    priority: z.ZodNumber;
    isDefault: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    title: string;
    isDefault: boolean;
    priority: number;
    description?: string | null | undefined;
}, {
    title: string;
    isDefault: boolean;
    priority: number;
    description?: string | null | undefined;
}>;

export { type CreateReservationSchemaType, type SeasonSchemaType, type TeamSchemaType, type TeamSeasonSchemaType, benefitSchema, benefitSchemaObject, controlInterfaceSchema, controlInterfaceSchemaObject, courtSchema, courtSchemaObject, createReservationSchema, createReservationSchemaObject, eventCategoriesSchema, eventCategoriesSchemaObject, eventSchema, eventSchemaObject, getPriceSchema, notificationSchema, notificationSchemaObject, organisationMemberSchema, organisationMemberSchemaObject, organisationSchema, organisationSchemaObject, priceSchema, reservationRuleSchema, seasonSchema, seasonSchemaObject, teamSchema, teamSchemaObject, teamSeasonSchema, teamSeasonSchemaObject, transactionSchema, transactionSchemaObject, updateReservationSchema, userRoleSchema, userRoleSchemaObject, userSchema, userSchemaObject };
