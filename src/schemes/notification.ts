import { NotificationSeverity } from 'db/databaseTypes';
import { z } from 'zod';

export const notificationSchema = {
	title: z.string(),
	message: z.string().nullable().optional(),
	severity: z.nativeEnum(NotificationSeverity),
	showFrom: z.date(),
	showTo: z.date(),
};

export const notificationSchemaObject = z.object(notificationSchema);
