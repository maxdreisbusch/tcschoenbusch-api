import { PermissionState } from 'db/databaseTypes';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure, roleCheckProcedure } from '..';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { env } from 'utils/env';

const expo = new Expo({
	accessToken: env.EXPO_PUSHNOTIFICATIONS_PAT,
});

const PushNotificationSchema = z.object({
	title: z.string(),
	message: z.string(),
	channelId: z.string().cuid(),
});

const generateMessages = (title: string, body: string, tokens: string[]) => {
	const messages: ExpoPushMessage[] = [];
	const message: Partial<ExpoPushMessage> = {
		sound: 'default',
		title,
		body,
		// richContent: {
		// 	image: 'https://example.com/statics/some-image-here-if-you-want.jpg',
		// },
	};

	for (const token of tokens) messages.push({ ...message, to: token });

	return messages;
};

const sendNotifications = async (messages: ExpoPushMessage[]) => {
	const repushTokens: string[] = [];
	const deleteTokens: string[] = [];

	const tickets = [];
	const chunks = await expo.chunkPushNotifications(messages);

	for (const chunk of chunks) {
		try {
			const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
			tickets.push(...ticketChunk);
		} catch (error) {
			console.error(error);
		}
	}

	for (const ticket of tickets) {
		if (ticket.status === 'ok') return;
		if (ticket.details?.error === 'DeviceNotRegistered' && ticket.details.expoPushToken) deleteTokens.push(ticket.details.expoPushToken);
		else if ((ticket.details?.error === 'ExpoError' || ticket.details?.error === 'MessageRateExceeded') && ticket.details.expoPushToken)
			repushTokens.push(ticket.details.expoPushToken);
	}

	return { repushTokens, deleteTokens };
};

const routerName = 'pushNotificationRouter';
export const pushNotificationsRouter = createTRPCRouter({
	create: roleCheckProcedure(routerName, 'create')
		.input(PushNotificationSchema)
		.mutation(async ({ input, ctx }) => {
			const notification = await ctx.prisma.pushNotification.create({ data: input });

			const channelSubscribers = await ctx.prisma.expoPushTokens.findMany({ where: { channels: { some: { id: input.channelId } } } });
			const messages = generateMessages(
				notification.title,
				notification.message,
				channelSubscribers.map((s) => s.id)
			);
			const messageResults = await sendNotifications(messages);
			if (messageResults && messageResults.deleteTokens.length > 0)
				await ctx.prisma.expoPushTokens.deleteMany({ where: { id: { in: messageResults.deleteTokens } } });

			if (messageResults && messageResults.repushTokens.length > 0)
				await sendNotifications(generateMessages(notification.title, notification.message, messageResults.repushTokens));

			return notification;
		}),

	list: roleCheckProcedure(routerName, 'list')
		.input(z.string())
		.query(async ({ input, ctx }) => {
			if (ctx.permission === PermissionState.ALL)
				return await ctx.prisma.pushNotification.findMany({
					where: {
						channel: {
							subscribers: {
								some: { id: input },
							},
						},
					},
				});

			const grantedRoles = ctx.session.roles?.map((id) => ({ id }));
			const items = await ctx.prisma.pushNotification.findMany({
				where: {
					channel: {
						subscribers: {
							some: { id: input },
						},
						OR: [{ isPublic: true }, { grantedUserRoles: { some: { OR: grantedRoles } } }],
					},
				},
			});

			return items;
		}),

	listByChannelId: roleCheckProcedure(routerName, 'list')
		.input(z.string())
		.query(async ({ input, ctx }) => {
			if (ctx.permission === PermissionState.ALL) return await ctx.prisma.pushNotification.findMany({ where: { channel: { id: input } } });

			const grantedRoles = ctx.session.roles?.map((id) => ({ id }));
			const items = await ctx.prisma.pushNotification.findMany({
				where: {
					channel: {
						id: input,
						OR: [{ isPublic: true }, { grantedUserRoles: { some: { OR: grantedRoles } } }],
					},
				},
			});

			return items;
		}),

	listPublic: publicProcedure
		.input(z.string())
		.query(async ({ ctx }) => await ctx.prisma.pushNotificationChannel.findMany({ where: { isPublic: true } })),
});
