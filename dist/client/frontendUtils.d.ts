import { Permission } from '@prisma/client';
import { Interval } from 'luxon';
export { A as ApplicationDialogPermission } from './applicationDialogPermissions-DEOexf28.js';
import { ReservationStatus, ReservationType } from './databaseTypes.js';

declare const addDays: (date: Date, amount: number) => Date;
declare const subDays: (date: Date, amount: number) => Date;
declare const addHours: (date: Date, amount: number) => Date;
declare const subHours: (date: Date, amount: number) => Date;
declare const addMinutes: (date: Date, amount: number) => Date;
declare const subMinutes: (date: Date, amount: number) => Date;
declare const differenceInMinutes: (end: Date, start: Date) => number;
declare const format: (date: Date, format: string) => string;
declare const formatDate: (date: Date) => string;
declare const formatTime: (date: Date) => string;
declare const getHours: (date: Date) => string;
declare const isActivePeriod: (date: Date, data?: {
    activeFrom?: Date | null;
    activeTo?: Date | null;
} | null) => boolean;
declare const getIntervalFromJsDate: (firstDate: Date, secondDate: Date) => Interval<true> | Interval<false>;
declare const isBefore: (firstDate: Date, secondDate: Date) => boolean;
declare const isAfter: (firstDate: Date, secondDate: Date) => boolean;
declare const compareAsc: (firstDate: Date, secondDate: Date) => 0 | 1 | -1;
declare const startOfDay: (date: Date) => Date;
declare const endOfDay: (date: Date) => Date;
declare const getZeroBasedWeekdayInteger: (date: Date) => number;

declare const getHighestPermissionState: (states: Array<Permission>) => "NONE" | "OWN" | "ALL";

declare const getNetFromGross: (grossPrice: number, taxRate?: number) => number;
declare const getTaxValueFromGross: (gross: number, taxRate?: number) => number;

declare const getAvailableTimeSlots: (startTime: Date, maxEndTime: Date, nextBookingStart?: Date) => {
    label: string;
    value: string;
}[];

interface ReservationRawData {
    title: string;
    start: Date;
    end: Date;
    courtId: string | null;
    status: ReservationStatus;
    type?: ReservationType;
    ownerId: string;
    light: boolean;
    radiator: boolean;
    fellows: {
        connect: {
            id: string;
        }[];
    } | undefined;
    price: number;
    taxRate: number;
}
declare enum AvailableRuleCheckPlugins {
    maxTimeBefore = "maxTimeBefore",
    minTimeBefore = "minTimeBefore",
    minDuration = "minDuration",
    maxDuration = "maxDuration",
    maxBookingsAtSameTime = "maxBookingsAtSameTime"
}
interface RuleCheckPlugins {
    [key: string]: (reservation: ReservationRawData, value: string) => Promise<boolean> | boolean;
}

declare const currencyFormatter: Intl.NumberFormat;

export { AvailableRuleCheckPlugins, type ReservationRawData, type RuleCheckPlugins, addDays, addHours, addMinutes, compareAsc, currencyFormatter, differenceInMinutes, endOfDay, format, formatDate, formatTime, getAvailableTimeSlots, getHighestPermissionState, getHours, getIntervalFromJsDate, getNetFromGross, getTaxValueFromGross, getZeroBasedWeekdayInteger, isActivePeriod, isAfter, isBefore, startOfDay, subDays, subHours, subMinutes };
