import type { AmountWithCurrencyCode, PurchaseItem } from '@paypal/paypal-js';
import { AbonnementStatus, PermissionState, ReservationRuleCheckOn, ReservationStatus } from 'db/databaseTypes';
import { TransactionReason } from 'db/databaseTypes';
import { TRPCError } from '@trpc/server';
import { DateTime } from 'luxon';
import { z } from 'zod';

import { createReservationSchema, getPriceSchema } from 'schemes/reservation';
import { capturePayment, createOrder, createPurchaseItem } from '../../plugins/paypal';
import {
	addDays,
	endOfDay,
	formatDate,
	getZeroBasedWeekdayInteger,
	isAfter,
	isBefore,
	startOfDay,
	addMinutes,
	format,
	subMinutes,
	getCourtPrice,
} from 'utils/backend';

import { ruleCheckPlugins } from 'utils/ruleCheckPlugins';
import { prisma } from 'db';
import { createTRPCRouter, publicProcedure, roleCheckProcedure } from '..';

import { transactionRouter } from './transaction';
import { ReservationRawData } from 'utils/ruleCheckPlugins/type';

const normalizeTime = (date: Date) => DateTime.fromJSDate(date).set({ second: 0, millisecond: 0 }).toJSDate();
const isAvailable = async (start: Date, end: Date, courtId: string) =>
	(
		await prisma.reservation.findMany({
			where: {
				OR: getBookingWhereClause(start, end),
				courtId,
				deletedAt: null,
			},
		})
	).length === 0;

export const isCourtAvailable = isAvailable;

const getMaxDate = (maximumRepeatableTo?: Date | null, repeatUntil?: Date) => {
	if (maximumRepeatableTo && repeatUntil) {
		return isBefore(maximumRepeatableTo, repeatUntil) ? maximumRepeatableTo : repeatUntil;
	}
	return repeatUntil ?? maximumRepeatableTo;
};

const routerName = 'reservation';
export const reservationRouter = createTRPCRouter({
	getPrice: roleCheckProcedure(routerName, 'getPrice')
		.input(z.object(getPriceSchema))
		.query(async ({ input, ctx }) => getCourtPrice(normalizeTime(input.start), input.end, ctx.session?.roles ?? [], input.courtId)),

	getNextReservationStart: roleCheckProcedure(routerName, 'getNextReservationStart')
		.input(z.object({ courtId: z.string(), startTime: z.date() }))
		.query(async ({ input, ctx }) =>
			ctx.prisma.reservation.findFirst({
				where: { courtId: input.courtId, start: { gte: normalizeTime(input.startTime) }, deletedAt: null },
				orderBy: { start: 'asc' },
				select: { start: true },
			})
		),

	get: roleCheckProcedure(routerName, 'get')
		.input(z.string())
		.query(async ({ input, ctx }) => {
			const reservation = await ctx.prisma.reservation.findUnique({
				where: { id: input },
				include: {
					court: { select: { name: true, area: { select: { name: true } } } },
					fellows: { select: { name: true } },
				},
			});

			if (ctx.permission !== PermissionState.ALL && ctx.permission === PermissionState.OWN && reservation?.ownerId !== ctx.session.id)
				throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Du darfst diese Buchung nicht anschauen.' });

			return reservation;
		}),

	getReservationsByRessource: roleCheckProcedure(routerName, 'getReservationsByRessource')
		.input(z.object({ courtId: z.string(), date: z.date() }))
		.query(async ({ input, ctx }) => {
			const reservations = await ctx.prisma.reservation.findMany({
				where: {
					courtId: input.courtId,
					start: { gte: startOfDay(input.date), lte: endOfDay(input.date) },
					deletedAt: null,
				},
				orderBy: { start: 'asc' },
				select: {
					id: true,
					title: true,
					start: true,
					end: true,
					status: true,
					type: true,
					abonnementId: true,
					owner: { select: { id: true, publicName: true } },
				},
			});

			return reservations.map((i) => ({
				...i,
				owner: undefined,
				title:
					i.owner?.publicName || i.owner?.id === ctx.session.id || ctx.permission === PermissionState.ALL || i.type !== null ? i.title : 'gebucht',
			}));
		}),

	create: roleCheckProcedure(routerName, 'create')
		.input(z.object(createReservationSchema))
		.mutation(async ({ input, ctx }) => {
			const data = input;
			const start = normalizeTime(data.start);
			const duration = parseFloat(data.duration);
			const end = addMinutes(start, duration * 60);

			if (!(await isAvailable(start, end, data.courtId)))
				throw new TRPCError({
					code: 'CONFLICT',
					message: 'Während deiner Buchung findet bereits eine andere Reservierung statt.',
				});

			const ownerId = ctx.permission === PermissionState.ALL && data.ownerId ? data.ownerId : ctx.session!.id;
			const fellows = data.fellows?.map((i) => ({ id: i.id })) ?? [];

			const [courtSpecifications, price, bookingOwner] = await Promise.all([
				prisma.court.findUnique({
					where: { id: data.courtId },
					select: {
						activeFrom: true,
						activeTo: true,
						area: { select: { id: true, activeFrom: true, activeTo: true, bookableFrom: true } },
					},
				}),
				getCourtPrice(start, end, ctx.session?.roles ?? [], data.courtId),
				ctx.prisma.user.findUnique({ where: { id: ownerId }, select: { name: true } }),
			]);

			const reservationData: ReservationRawData = {
				title: data.title && data.title.trim().length > 0 ? data.title : bookingOwner?.name ?? '',
				start,
				end: addMinutes(start, parseFloat(data.duration) * 60),
				courtId: data.courtId,
				status: price.total === 0 ? ReservationStatus.APPROVED : ReservationStatus.REQUESTED,
				type: data.type,
				ownerId,
				light: true,
				radiator: true,
				fellows: fellows.length > 0 ? { connect: fellows } : undefined,
				price: price.total,
				taxRate: price.taxRate,
			};

			if (courtSpecifications) {
				checkReservation(reservationData, courtSpecifications);
				await checkReservationRules(ReservationRuleCheckOn.CREATE, reservationData, courtSpecifications, ctx.session?.roles);
			}

			if (data.courts && data.courts.length > 0) {
				if (price.total !== 0)
					throw new TRPCError({
						code: 'METHOD_NOT_SUPPORTED',
						message: 'Mehrere Plätze können nur gebucht werden, wenn keine Gebühr fällig ist.',
					});

				return ctx.prisma.reservation.createMany({
					data: await getMultiCourtReservations(reservationData, data.courts, start, end),
				});
			} else if (data.repeatInterval && data.repeatInterval > 0) {
				if (price.total !== 0)
					throw new TRPCError({
						code: 'METHOD_NOT_SUPPORTED',
						message: 'Abonnements können nur gebucht werden, wenn keine Gebühr fällig ist.',
					});

				const courtData = await ctx.prisma.court.findUnique({
					where: { id: data.courtId },
					select: { activeTo: true, area: { select: { activeTo: true } } },
				});
				const maximumRepeatableTo = courtData?.activeTo ?? courtData?.area.activeTo;
				const maxDate = getMaxDate(maximumRepeatableTo, data.repeatUntil);

				if (!maxDate)
					throw new TRPCError({
						code: 'METHOD_NOT_SUPPORTED',
						message: 'Es wurde kein maximales Buchungsdatum gefunden.',
					});

				const abo = await ctx.prisma.abonnement.create({
					data: {
						name: data.title ?? 'Abonnement',
						weekday: getZeroBasedWeekdayInteger(start),
						start: start,
						duration,
						status: data.repeatApproved ? AbonnementStatus.APPROVED : AbonnementStatus.REQUESTED,
						courtId: data.courtId,
						ownerId,
					},
				});

				const repeatReservationData = {
					...reservationData,
					status: data.repeatApproved ? ReservationStatus.APPROVED : ReservationStatus.REQUESTED,
					transactions: undefined,
					abonnementId: abo.id,
				};

				const reservations = [];
				for (let currentDate = start; isBefore(currentDate, maxDate); currentDate = addDays(currentDate, data.repeatInterval)) {
					const endDate = addMinutes(currentDate, parseFloat(data.duration) * 60);

					if (!reservationData.courtId || !(await isAvailable(currentDate, endDate, reservationData.courtId))) continue;
					reservations.push({
						...repeatReservationData,
						start: currentDate,
						end: endDate,
					});
				}

				return ctx.prisma.reservation.createMany({
					data: reservations,
				});
			} else {
				return await ctx.prisma.reservation.create({ data: reservationData });
			}
		}),

	payForReservation: roleCheckProcedure(routerName, 'payForReservation')
		.input(z.object({ reservationId: z.string(), useHallencard: z.boolean() }))
		.mutation(async ({ input, ctx }) => {
			const reservation = await ctx.prisma.reservation.findUnique({
				where: { id: input.reservationId },
				include: { court: { select: { name: true } } },
			});

			if (!reservation || !reservation.courtId)
				throw new TRPCError({
					code: 'METHOD_NOT_SUPPORTED',
					message: 'Die Reservierung ist bereits abgelaufen. Bitte versuchen Sie es erneut.',
				});

			if (!reservation.price || !reservation.taxRate) {
				void ctx.prisma.reservation.delete({ where: { id: reservation.id } });
				throw new TRPCError({
					code: 'METHOD_NOT_SUPPORTED',
					message: 'Die Transaktion konnte nicht durchgeführt werden. Bitte versuchen Sie es erneut.',
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
								status: ReservationStatus.APPROVED,
								transactions: {
									create: {
										userId: reservation.ownerId ?? ctx.session.id,
										value: reservation.price * -1,
										currency: 'EUR',
										reason: TransactionReason.COURT_RESERVATION,
									},
								},
							},
						}),
						paypalTransaction: undefined,
					};
				}
			}

			//Start paypal transaction process
			const currencyCode = 'EUR';
			const purchaseItems: Array<PurchaseItem> = [];
			purchaseItems.push(
				createPurchaseItem(
					`${reservation.court?.name ?? ''} am ${format(reservation.start, 'dd.MM.yyyy')} um ${format(reservation.start, 'HH:mm')} - ${format(
						reservation.end,
						'HH:mm'
					)}`,
					reservation.price,
					reservation.taxRate,
					currencyCode,
					'1'
				)
			);

			const paypalTransaction = await createOrder(purchaseItems, currencyCode, discount);
			await ctx.prisma.reservation.update({
				where: { id: reservation.id },
				data: {
					paypalTransactionId: paypalTransaction.id,
				},
			});

			return { reservation: undefined, paypalTransaction };
		}),

	checkPaymentStatus: roleCheckProcedure(routerName, 'checkPaymentStatus')
		.input(z.string())
		.mutation(async ({ input, ctx }) => {
			const reservation = (await ctx.prisma.reservation.findMany({ where: { paypalTransactionId: input } }))[0];

			if (!reservation)
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Ihre Reservierung konnte nicht gefunden werden',
				});

			try {
				const order = await capturePayment(input);

				if (order.status !== 'COMPLETED' || !order.purchase_units || order.purchase_units.length === 0 || order.purchase_units[0] == undefined)
					throw new Error();

				const captures = order.purchase_units[0].payments?.captures;
				if (!captures || captures[0]?.status !== 'COMPLETED') throw new Error();
				const amount = captures[0].amount as AmountWithCurrencyCode;

				await ctx.prisma.reservation.update({
					where: { id: reservation.id },
					data: {
						status: ReservationStatus.APPROVED,
						deletedAt: null,
						transactions: {
							create: [
								{
									userId: reservation.ownerId,
									value: (reservation.price ?? 0) * -1,
									currency: amount.currency_code,
									reason: TransactionReason.COURT_RESERVATION,
									createdAt: reservation.createdAt,
								},
								{
									userId: reservation.ownerId,
									value: parseFloat(amount.value),
									currency: amount.currency_code,
									reason: TransactionReason.ONLINE_PAYMENT,
									paymentInformation: `paypal:${input}`,
								},
							],
						},
					},
				});

				return {};
			} catch (e) {
				console.log(e);
				await invalidateReservation(reservation.id);

				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Die Transaktion wurde nicht erfolgreich abgeschlossen. Die Platzbuchung wird gelöscht.',
				});
			}
		}),

	paymentCanceled: roleCheckProcedure(routerName, 'checkPaymentStatus')
		.input(z.string())
		.mutation(async ({ input, ctx }) => {
			const reservation = (await ctx.prisma.reservation.findMany({ where: { paypalTransactionId: input } }))[0];
			if (!reservation)
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Ihre Reservierung konnte nicht gefunden werden',
				});

			await invalidateReservation(reservation.id);
		}),

	cancelReservation: roleCheckProcedure(routerName, 'cancelReservation')
		.input(z.string())
		.mutation(async ({ input, ctx }) => {
			const reservation = (await ctx.prisma.reservation.findMany({ where: { id: input } }))[0];
			if (!reservation)
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Ihre Reservierung konnte nicht gefunden werden',
				});

			if (ctx.permission !== PermissionState.ALL && ctx.session.id !== reservation.ownerId) throw new TRPCError({ code: 'UNAUTHORIZED' });

			await invalidateReservation(reservation.id);
		}),

	delete: roleCheckProcedure(routerName, 'delete')
		.input(z.string())
		.mutation(async ({ input, ctx }) => {
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
							activeTo: true,
						},
					},
					transactions: {
						select: {
							id: true,
							value: true,
							currency: true,
						},
						where: {
							reason: TransactionReason.COURT_RESERVATION,
						},
					},
				},
			});

			if (!reservationData || (ctx.permission !== PermissionState.ALL && ctx.session.id !== reservationData.ownerId))
				throw new TRPCError({ code: 'UNAUTHORIZED' });

			const courtSpecifications = reservationData.court;

			if (courtSpecifications)
				await checkReservationRules(
					ReservationRuleCheckOn.DELETE,
					reservationData as unknown as ReservationRawData,
					courtSpecifications,
					ctx.session?.roles
				);

			const courtReservationTransaction = reservationData.transactions[0];
			await ctx.prisma.reservation.update({
				where: { id: input },
				data: {
					deletedAt: new Date(),
					transactions: courtReservationTransaction
						? {
								create: {
									value: courtReservationTransaction.value * -1, //give back the money for the whole reservation
									currency: courtReservationTransaction.currency,
									reason: TransactionReason.COURT_RESERVATION_STORNO,
								},
						  }
						: undefined,
				},
			});

			return {};
		}),

	deleteAbo: roleCheckProcedure(routerName, 'deleteAbo')
		.input(z.string())
		.mutation(async ({ input, ctx }) => {
			const abonnementData = await ctx.prisma.abonnement.findUnique({
				where: { id: input },
				select: {
					id: true,
					ownerId: true,
				},
			});

			if (!abonnementData || (ctx.permission !== PermissionState.ALL && ctx.session.id !== abonnementData.ownerId))
				throw new TRPCError({ code: 'UNAUTHORIZED' });

			await Promise.all([
				ctx.prisma.abonnement.update({
					where: { id: input },
					data: {
						status: AbonnementStatus.DELETED,
					},
				}),
				ctx.prisma.reservation.updateMany({
					where: { abonnementId: input, start: { gt: new Date() } },
					data: { deletedAt: new Date() },
				}),
			]);

			return {};
		}),

	deleteUnapproved: publicProcedure.query(async ({ ctx }) => {
		await ctx.prisma.reservation.updateMany({
			where: { createdAt: { lt: subMinutes(new Date(), 15) }, status: ReservationStatus.REQUESTED, abonnementId: null },
			data: { deletedAt: new Date() },
		});

		return true;
	}),

	getEmptyCourts: roleCheckProcedure(routerName, 'get')
		.input(z.object({ areaId: z.number(), start: z.date().min(new Date()), end: z.date().min(new Date()) }))
		.query(async ({ input, ctx }) => {
			const { areaId, start, end } = input;

			const availableCourts = await ctx.prisma.court.findMany({
				where: {
					//court needs to be active
					active: true,
					OR: [
						{ activeFrom: { lt: start }, activeTo: { gt: start } },
						{ activeFrom: null, activeTo: null },
					],
					//and also area needs to be active
					area: {
						id: areaId,
						OR: [
							{ activeFrom: { lt: start }, activeTo: { gt: start } },
							{ activeFrom: null, activeTo: null },
						],
					},

					reservations: {
						none: { OR: getBookingWhereClause(start, end) },
					},
				},
			});

			return availableCourts;
		}),
});

const getBookingWhereClause = (startTime: Date, endTime: Date) => [
	{
		//Fall 1 + 2
		// neue Buchung beginnt vor alter Buchung, endet währenddessen oder gleichzeitig
		start: { gte: startTime, lt: endTime },
		end: { gte: endTime },
	},
	{
		//Fall 3 + 4
		// Buchung beginnt während alter Buchung und Endet danach
		start: { lte: startTime },
		end: { gt: startTime, lte: endTime },
	},
	{
		//Fall 5
		// Buchung beginnt und endet während alter
		start: { equals: startTime },
		end: { equals: endTime },
	},
	{
		//Fall 6
		// Buchung beginnt nach oder während alter und endet vor alter
		start: { lte: startTime },
		end: { gt: endTime },
	},
	{
		//Fall 7
		// Buchung beginnt vor alter und endet nach alter
		start: { gt: startTime },
		end: { lt: endTime },
	},
];

const getMultiCourtReservations = async (reservationData: ReservationRawData, courts: Array<string>, start: Date, end: Date) => {
	const reservations = [];
	for (const court of courts) {
		if (!(await isAvailable(start, end, court))) continue;
		reservations.push({
			...reservationData,
			courtId: court,
		});
	}

	return reservations;
};

const getReservationNotPossibleMessage = (checkBookable: CourtSpecifications) => {
	return `Es sind noch keine Buchungen möglich. ${
		checkBookable.area.bookableFrom
			? `Buchungen können erst ab dem ${formatDate(checkBookable.area.bookableFrom)} erstellt werden.`
			: checkBookable.activeFrom && checkBookable.activeTo
			? `Buchungen können vom ${formatDate(checkBookable.activeFrom)} - ${formatDate(checkBookable.activeTo)} erstellt werden.`
			: checkBookable.area.activeFrom && checkBookable.area.activeTo
			? `Buchungen können vom ${formatDate(checkBookable.area.activeFrom)} - ${formatDate(checkBookable.area.activeTo)} erstellt werden.`
			: 'Es können aktuell keine Buchungen getätigt werden.'
	}`;
};

export const checkReservation = (reservationData: ReservationRawData, courtSpecifications: CourtSpecifications) => {
	const { start } = reservationData;

	if (
		(start &&
			((courtSpecifications.activeFrom && isBefore(start, courtSpecifications.activeFrom)) ||
				(courtSpecifications.activeTo && isAfter(start, courtSpecifications.activeTo)) ||
				(courtSpecifications.area.activeFrom && isBefore(start, courtSpecifications.area.activeFrom)) ||
				(courtSpecifications.area.activeTo && isAfter(start, courtSpecifications.area.activeTo)))) ||
		(courtSpecifications.area.bookableFrom && isBefore(new Date(), courtSpecifications.area.bookableFrom))
	) {
		throw new TRPCError({
			code: 'CONFLICT',
			message: getReservationNotPossibleMessage(courtSpecifications),
		});
	}
};

const checkReservationRules = async (
	action: ReservationRuleCheckOn,
	reservationData: ReservationRawData,
	courtSpecifications: CourtSpecifications,
	roles?: Array<number> | null
) => {
	const { courtId } = reservationData;
	const reservationRules = await prisma.reservationRule.findMany({
		where: {
			checkOn: action,
			OR: [{ affectedCourts: courtId ? { some: { id: courtId } } : undefined }, { affectedAreas: { some: { id: courtSpecifications.area.id } } }],
			validFor: roles
				? {
						some: {
							id: roles[0],
						},
				  }
				: undefined,
		},
	});

	for (const reservationRule of reservationRules) {
		let canBook = true;
		//eslint-disable-next-line no-prototype-builtins
		if (reservationRule.ruleCheckPluginName && ruleCheckPlugins.hasOwnProperty(reservationRule.ruleCheckPluginName)) {
			const res = ruleCheckPlugins[reservationRule.ruleCheckPluginName](reservationData, reservationRule.value);

			if (typeof res === 'boolean') canBook = res;
			else canBook = await res;

			if (!canBook)
				throw new TRPCError({
					code: 'CONFLICT',
					message: reservationRule.errorDescription ?? 'Eine Buchungsregel verhindert deine Buchung.',
				});
		}
	}
};

const invalidateReservation = (reservationId: string) =>
	prisma.reservation.update({
		where: { id: reservationId },
		data: {
			deletedAt: new Date(),
		},
	});

type CourtSpecifications = {
	area: {
		id: number;
		activeFrom: Date | null;
		activeTo: Date | null;
		bookableFrom: Date | null;
	};
	activeFrom: Date | null;
	activeTo: Date | null;
};
