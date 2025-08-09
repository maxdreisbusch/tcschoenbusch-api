import { TransactionReason } from 'db/databaseTypes';
import { z } from 'zod';

export const transactionSchema = {
	userId: z.string(),
	reason: z.nativeEnum(TransactionReason),
	value: z.number(),
	currency: z.string(),
	reservationId: z.string().nullable().optional(),
};

export const transactionSchemaObject = z.object(transactionSchema);
