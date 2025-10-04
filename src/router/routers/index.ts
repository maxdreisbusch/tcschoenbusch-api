import { createTRPCRouter } from 'router';
import { areaRouter } from './area';
import { benefitRouter } from './benefit';
import { controlInterfaceRouter } from './controlInterfaces';
import { courtRouter } from './court';
import { dashboardRouter } from './dashboard';
import { eventCategoriesRouter } from './eventCategories';
import { eventsRouter } from './events';
import { hallencardRouter } from './hallencard';
import { notificationRouter } from './notification';
import { organisationMembersRouter } from './organisationMembers';
import { organisationsRouter } from './organisations';
import { permissionRouter } from './permission';
import { priceRouter } from './price';
import { reservationRouter } from './reservation';
import { reservationRuleRouter } from './reservationRule';
import { seasonRouter } from './season';
import { teamRouter } from './team';
import { teamSeasonRouter } from './teamSeason';
import { transactionRouter } from './transaction';
import { userRouter } from './user';
import { userRoleRouter } from './userRole';
import { membershipRouter } from './membership';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	area: areaRouter,
	benefit: benefitRouter,
	controlInterface: controlInterfaceRouter,
	court: courtRouter,
	dashboard: dashboardRouter,
	events: eventsRouter,
	eventCategories: eventCategoriesRouter,
	hallencard: hallencardRouter,
	membership: membershipRouter,
	notification: notificationRouter,
	organisations: organisationsRouter,
	organisationMembers: organisationMembersRouter,
	permission: permissionRouter,
	price: priceRouter,
	reservation: reservationRouter,
	reservationRule: reservationRuleRouter,
	season: seasonRouter,
	team: teamRouter,
	teamSeason: teamSeasonRouter,
	transaction: transactionRouter,
	user: userRouter,
	userRole: userRoleRouter,
});
