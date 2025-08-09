import { z } from 'zod';

declare const createHallencardSchema: {
    value: z.ZodNumber;
};
declare const createHallencardSchemaObject: z.ZodObject<{
    value: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    value: number;
}, {
    value: number;
}>;
declare const useHallencardSchema: {
    code: z.ZodString;
    pin: z.ZodString;
};
declare const useHallencardForAnotherPersonSchema: {
    code: z.ZodString;
    userId: z.ZodString;
};
declare enum HallencardStatus {
    CREATED = "CREATED",
    PRINTED = "PRINTED",
    USED = "USED"
}

export { HallencardStatus as H, createHallencardSchemaObject as a, useHallencardForAnotherPersonSchema as b, createHallencardSchema as c, useHallencardSchema as u };
