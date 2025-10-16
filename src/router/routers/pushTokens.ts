import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '..';
import Expo from 'expo-server-sdk';
import { TRPCError } from '@trpc/server';

const SubscribeChannelRequestSchema = z.object({ expoPushToken: z.string(), channelId: z.string() });

export const pushTokenRouter = createTRPCRouter({
	create: publicProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
		if (!Expo.isExpoPushToken(input)) throw new TRPCError({ code: 'BAD_REQUEST', message: `Push token ${input} is not a valid Expo push token` });

		return await ctx.prisma.expoPushTokens.create({
			data: { id: input, userId: ctx.session?.id },
		});
	}),

	subscribeChannel: publicProcedure.input(SubscribeChannelRequestSchema).mutation(async ({ input, ctx }) => {
		if (!Expo.isExpoPushToken(input.expoPushToken))
			throw new TRPCError({ code: 'BAD_REQUEST', message: `Push token ${input} is not a valid Expo push token` });

		return await ctx.prisma.expoPushTokens.update({
			where: { id: input.expoPushToken },
			data: { channels: { connect: { id: input.channelId } } },
		});
	}),

	unsubscribeChannel: publicProcedure.input(SubscribeChannelRequestSchema).mutation(async ({ input, ctx }) => {
		if (!Expo.isExpoPushToken(input)) throw new TRPCError({ code: 'BAD_REQUEST', message: `Push token ${input} is not a valid Expo push token` });

		return await ctx.prisma.expoPushTokens.update({
			where: { id: input.expoPushToken },
			data: { channels: { disconnect: { id: input.channelId } } },
		});
	}),
});
