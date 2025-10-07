import * as _trpc_server from '@trpc/server';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import * as _paypal_paypal_js from '@paypal/paypal-js';
import { A as ApplicationDialogPermission } from './applicationDialogPermissions-DEOexf28.js';
import { NotificationSeverity, PermissionState, ReservationType, ReservationRuleCheckOn, TeamCategory, TransactionReason } from './databaseTypes.js';
import { H as HallencardStatus } from './hallencard-BBLfHFZf.js';
import * as _prisma_client from '.prisma/client';
import * as _prisma_client_runtime_library from '@prisma/client/runtime/library';
import 'zod';

type AppSessionUser = {
    id: string;
    name: string | null;
    email: string | null;
    roles: Array<number> | null;
};

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
declare const appRouter: _trpc_server.TRPCBuiltRouter<{
    ctx: {
        session: AppSessionUser | null;
        prisma: _prisma_client.PrismaClient<{
            log: ("query" | "warn" | "error")[];
        }, never, _prisma_client_runtime_library.DefaultArgs>;
    };
    meta: object;
    errorShape: _trpc_server.TRPCDefaultErrorShape;
    transformer: true;
}, _trpc_server.TRPCDecorateCreateRouterOptions<{
    area: _trpc_server.TRPCBuiltRouter<{
        ctx: {
            session: AppSessionUser | null;
            prisma: _prisma_client.PrismaClient<{
                log: ("query" | "warn" | "error")[];
            }, never, _prisma_client_runtime_library.DefaultArgs>;
        };
        meta: object;
        errorShape: _trpc_server.TRPCDefaultErrorShape;
        transformer: true;
    }, _trpc_server.TRPCDecorateCreateRouterOptions<{
        list: _trpc_server.TRPCQueryProcedure<{
            input: void;
            output: {
                name: string;
                id: number;
                shortName: string;
                _count: {
                    courts: number;
                    reservationRules: number;
                    prices: number;
                };
            }[];
            meta: object;
        }>;
        listActive: _trpc_server.TRPCQueryProcedure<{
            input: void;
            output: {
                name: string;
                id: number;
                shortName: string;
                _count: {
                    courts: number;
                    reservationRules: number;
                    prices: number;
                };
            }[];
            meta: object;
        }>;
        get: _trpc_server.TRPCQueryProcedure<{
            input: number;
            output: {
                name: string;
                id: number;
                shortName: string;
                activeFrom: Date | null;
                activeTo: Date | null;
                bookableFrom: Date | null;
                order: number | null;
            } | null;
            meta: object;
        }>;
        getWithAllCourts: _trpc_server.TRPCQueryProcedure<{
            input: number;
            output: {
                name: string;
                id: number;
                shortName: string;
                activeFrom: Date | null;
                activeTo: Date | null;
                order: number | null;
                courts: {
                    name: string;
                    description: string | null;
                    id: string;
                    shortName: string | null;
                    activeFrom: Date | null;
                    activeTo: Date | null;
                    order: number | null;
                    _count: {
                        area: number;
                        abonnements: number;
                        reservations: number;
                        reservationRules: number;
                        controlInterfaces: number;
                    };
                    active: boolean;
                }[];
            } | null;
            meta: object;
        }>;
        getWithActiveCourts: _trpc_server.TRPCQueryProcedure<{
            input: {
                date: Date;
                areaId?: number | undefined;
            };
            output: {
                name: string;
                id: number;
                courts: {
                    name: string;
                    description: string | null;
                    id: string;
                }[];
            } | null;
            meta: object;
        }>;
        upsert: _trpc_server.TRPCMutationProcedure<{
            input: {
                name: string;
                shortName: string;
                id?: number | undefined;
                activeFrom?: Date | null | undefined;
                activeTo?: Date | null | undefined;
                bookableFrom?: Date | null | undefined;
                order?: number | null | undefined;
            };
            output: {
                name: string;
                id: number;
                shortName: string;
                activeFrom: Date | null;
                activeTo: Date | null;
                bookableFrom: Date | null;
                order: number | null;
            };
            meta: object;
        }>;
        delete: _trpc_server.TRPCMutationProcedure<{
            input: number;
            output: {
                name: string;
                id: number;
                shortName: string;
                activeFrom: Date | null;
                activeTo: Date | null;
                bookableFrom: Date | null;
                order: number | null;
            };
            meta: object;
        }>;
    }>>;
    benefit: _trpc_server.TRPCBuiltRouter<{
        ctx: {
            session: AppSessionUser | null;
            prisma: _prisma_client.PrismaClient<{
                log: ("query" | "warn" | "error")[];
            }, never, _prisma_client_runtime_library.DefaultArgs>;
        };
        meta: object;
        errorShape: _trpc_server.TRPCDefaultErrorShape;
        transformer: true;
    }, _trpc_server.TRPCDecorateCreateRouterOptions<{
        create: _trpc_server.TRPCMutationProcedure<{
            input: {
                description: string | null;
                title: string;
                link?: string | null | undefined;
                activeFrom?: Date | null | undefined;
                activeTo?: Date | null | undefined;
                image?: string | null | undefined;
                cover?: boolean | undefined;
            };
            output: {
                link: string | null;
                description: string | null;
                id: string;
                activeFrom: Date | null;
                activeTo: Date | null;
                title: string;
                image: string | null;
                cover: boolean;
            };
            meta: object;
        }>;
        get: _trpc_server.TRPCQueryProcedure<{
            input: string;
            output: {
                link: string | null;
                description: string | null;
                id: string;
                activeFrom: Date | null;
                activeTo: Date | null;
                title: string;
                image: string | null;
                cover: boolean;
            } | null;
            meta: object;
        }>;
        list: _trpc_server.TRPCQueryProcedure<{
            input: void;
            output: {
                link: string | null;
                description: string | null;
                id: string;
                activeFrom: Date | null;
                activeTo: Date | null;
                title: string;
                image: string | null;
                cover: boolean;
            }[];
            meta: object;
        }>;
        update: _trpc_server.TRPCMutationProcedure<{
            input: {
                description: string | null;
                title: string;
                link?: string | null | undefined;
                id?: string | undefined;
                activeFrom?: Date | null | undefined;
                activeTo?: Date | null | undefined;
                image?: string | null | undefined;
                cover?: boolean | undefined;
            };
            output: {
                link: string | null;
                description: string | null;
                id: string;
                activeFrom: Date | null;
                activeTo: Date | null;
                title: string;
                image: string | null;
                cover: boolean;
            };
            meta: object;
        }>;
        delete: _trpc_server.TRPCMutationProcedure<{
            input: string;
            output: {
                link: string | null;
                description: string | null;
                id: string;
                activeFrom: Date | null;
                activeTo: Date | null;
                title: string;
                image: string | null;
                cover: boolean;
            };
            meta: object;
        }>;
    }>>;
    controlInterface: _trpc_server.TRPCBuiltRouter<{
        ctx: {
            session: AppSessionUser | null;
            prisma: _prisma_client.PrismaClient<{
                log: ("query" | "warn" | "error")[];
            }, never, _prisma_client_runtime_library.DefaultArgs>;
        };
        meta: object;
        errorShape: _trpc_server.TRPCDefaultErrorShape;
        transformer: true;
    }, _trpc_server.TRPCDecorateCreateRouterOptions<{
        create: _trpc_server.TRPCMutationProcedure<{
            input: {
                description: string;
                title: string;
                preBooking: number;
                postBooking: number;
                connectByAnd?: boolean | undefined;
                connectByOr?: boolean | undefined;
                affectedCourts?: string[] | undefined;
            };
            output: {
                description: string;
                id: string;
                title: string;
                preBooking: number;
                postBooking: number;
                connectByAnd: boolean;
                connectByOr: boolean;
            };
            meta: object;
        }>;
        get: _trpc_server.TRPCQueryProcedure<{
            input: string;
            output: ({
                affectedCourts: {
                    id: string;
                }[];
            } & {
                description: string;
                id: string;
                title: string;
                preBooking: number;
                postBooking: number;
                connectByAnd: boolean;
                connectByOr: boolean;
            }) | null;
            meta: object;
        }>;
        list: _trpc_server.TRPCQueryProcedure<{
            input: void;
            output: {
                description: string;
                id: string;
                title: string;
                preBooking: number;
                postBooking: number;
                connectByAnd: boolean;
                connectByOr: boolean;
            }[];
            meta: object;
        }>;
        update: _trpc_server.TRPCMutationProcedure<{
            input: {
                description: string;
                id: string;
                title: string;
                preBooking: number;
                postBooking: number;
                connectByAnd?: boolean | undefined;
                connectByOr?: boolean | undefined;
                affectedCourts?: string[] | undefined;
            };
            output: {
                description: string;
                id: string;
                title: string;
                preBooking: number;
                postBooking: number;
                connectByAnd: boolean;
                connectByOr: boolean;
            };
            meta: object;
        }>;
        delete: _trpc_server.TRPCMutationProcedure<{
            input: string;
            output: {
                description: string;
                id: string;
                title: string;
                preBooking: number;
                postBooking: number;
                connectByAnd: boolean;
                connectByOr: boolean;
            };
            meta: object;
        }>;
        execute: _trpc_server.TRPCQueryProcedure<{
            input: string;
            output: boolean | boolean[] | null;
            meta: object;
        }>;
    }>>;
    court: _trpc_server.TRPCBuiltRouter<{
        ctx: {
            session: AppSessionUser | null;
            prisma: _prisma_client.PrismaClient<{
                log: ("query" | "warn" | "error")[];
            }, never, _prisma_client_runtime_library.DefaultArgs>;
        };
        meta: object;
        errorShape: _trpc_server.TRPCDefaultErrorShape;
        transformer: true;
    }, _trpc_server.TRPCDecorateCreateRouterOptions<{
        create: _trpc_server.TRPCMutationProcedure<{
            input: {
                name: string;
                areaId: number;
                shortName: string | null;
                description?: string | null | undefined;
                activeFrom?: Date | null | undefined;
                activeTo?: Date | null | undefined;
                order?: number | null | undefined;
                active?: boolean | undefined;
            };
            output: {
                name: string;
                description: string | null;
                areaId: number;
                id: string;
                shortName: string | null;
                activeFrom: Date | null;
                activeTo: Date | null;
                order: number | null;
                active: boolean;
            };
            meta: object;
        }>;
        list: _trpc_server.TRPCQueryProcedure<{
            input: void;
            output: {
                area: {
                    id: number;
                    shortName: string;
                };
                name: string;
                id: string;
                shortName: string | null;
                activeFrom: Date | null;
                activeTo: Date | null;
                order: number | null;
                _count: {
                    area: number;
                    abonnements: number;
                    reservations: number;
                    reservationRules: number;
                    controlInterfaces: number;
                };
                active: boolean;
            }[];
            meta: object;
        }>;
        get: _trpc_server.TRPCQueryProcedure<{
            input: string;
            output: {
                name: string;
                description: string | null;
                areaId: number;
                id: string;
                shortName: string | null;
                activeFrom: Date | null;
                activeTo: Date | null;
                order: number | null;
                active: boolean;
            } | null;
            meta: object;
        }>;
        update: _trpc_server.TRPCMutationProcedure<{
            input: {
                name: string;
                areaId: number;
                id: string;
                shortName: string | null;
                description?: string | null | undefined;
                activeFrom?: Date | null | undefined;
                activeTo?: Date | null | undefined;
                order?: number | null | undefined;
                active?: boolean | undefined;
            };
            output: {
                name: string;
                description: string | null;
                areaId: number;
                id: string;
                shortName: string | null;
                activeFrom: Date | null;
                activeTo: Date | null;
                order: number | null;
                active: boolean;
            };
            meta: object;
        }>;
        delete: _trpc_server.TRPCMutationProcedure<{
            input: string;
            output: {
                name: string;
                description: string | null;
                areaId: number;
                id: string;
                shortName: string | null;
                activeFrom: Date | null;
                activeTo: Date | null;
                order: number | null;
                active: boolean;
            };
            meta: object;
        }>;
    }>>;
    dashboard: _trpc_server.TRPCBuiltRouter<{
        ctx: {
            session: AppSessionUser | null;
            prisma: _prisma_client.PrismaClient<{
                log: ("query" | "warn" | "error")[];
            }, never, _prisma_client_runtime_library.DefaultArgs>;
        };
        meta: object;
        errorShape: _trpc_server.TRPCDefaultErrorShape;
        transformer: true;
    }, _trpc_server.TRPCDecorateCreateRouterOptions<{
        getMyNextReservations: _trpc_server.TRPCQueryProcedure<{
            input: void;
            output: {
                court: {
                    name: string;
                } | null;
                id: string;
                title: string;
                start: Date;
                end: Date;
                abonnementId: string | null;
                fellows: {
                    name: string | null;
                }[];
            }[];
            meta: object;
        }>;
        needsSetup: _trpc_server.TRPCQueryProcedure<{
            input: void;
            output: {
                needsSetup: boolean;
            } | null;
            meta: object;
        }>;
    }>>;
    events: _trpc_server.TRPCBuiltRouter<{
        ctx: {
            session: AppSessionUser | null;
            prisma: _prisma_client.PrismaClient<{
                log: ("query" | "warn" | "error")[];
            }, never, _prisma_client_runtime_library.DefaultArgs>;
        };
        meta: object;
        errorShape: _trpc_server.TRPCDefaultErrorShape;
        transformer: true;
    }, _trpc_server.TRPCDecorateCreateRouterOptions<{
        upsert: _trpc_server.TRPCMutationProcedure<{
            input: {
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
            };
            output: {
                link: string | null;
                description: string | null;
                id: string;
                title: string;
                image: string | null;
                start: Date;
                end: Date | null;
                categoryId: string;
                canceled: boolean;
                revised: boolean;
                location: string | null;
            };
            meta: object;
        }>;
        list: _trpc_server.TRPCQueryProcedure<{
            input: {
                cursor?: string | null | undefined;
                limit?: number | null | undefined;
                filterByCategory?: string | undefined;
            };
            output: {
                items: ({
                    _count: {
                        category: number;
                        likedByUsers: number;
                    };
                    category: {
                        title: string;
                    };
                } & {
                    link: string | null;
                    description: string | null;
                    id: string;
                    title: string;
                    image: string | null;
                    start: Date;
                    end: Date | null;
                    categoryId: string;
                    canceled: boolean;
                    revised: boolean;
                    location: string | null;
                })[];
                nextCursor: string | null;
            };
            meta: object;
        }>;
        listUpcoming: _trpc_server.TRPCQueryProcedure<{
            input: {
                cursor?: string | null | undefined;
                limit?: number | null | undefined;
                filterByCategorySlug?: string | undefined;
            };
            output: {
                items: ({
                    _count: {
                        category: number;
                        likedByUsers: number;
                    };
                    category: {
                        title: string;
                    };
                } & {
                    link: string | null;
                    description: string | null;
                    id: string;
                    title: string;
                    image: string | null;
                    start: Date;
                    end: Date | null;
                    categoryId: string;
                    canceled: boolean;
                    revised: boolean;
                    location: string | null;
                })[];
                nextCursor: string | null;
            };
            meta: object;
        }>;
        get: _trpc_server.TRPCQueryProcedure<{
            input: string;
            output: ({
                _count: {
                    category: number;
                    likedByUsers: number;
                };
                category: {
                    title: string;
                };
            } & {
                link: string | null;
                description: string | null;
                id: string;
                title: string;
                image: string | null;
                start: Date;
                end: Date | null;
                categoryId: string;
                canceled: boolean;
                revised: boolean;
                location: string | null;
            }) | null;
            meta: object;
        }>;
        delete: _trpc_server.TRPCMutationProcedure<{
            input: string;
            output: {
                link: string | null;
                description: string | null;
                id: string;
                title: string;
                image: string | null;
                start: Date;
                end: Date | null;
                categoryId: string;
                canceled: boolean;
                revised: boolean;
                location: string | null;
            };
            meta: object;
        }>;
        listEventLocations: _trpc_server.TRPCQueryProcedure<{
            input: void;
            output: string[];
            meta: object;
        }>;
    }>>;
    eventCategories: _trpc_server.TRPCBuiltRouter<{
        ctx: {
            session: AppSessionUser | null;
            prisma: _prisma_client.PrismaClient<{
                log: ("query" | "warn" | "error")[];
            }, never, _prisma_client_runtime_library.DefaultArgs>;
        };
        meta: object;
        errorShape: _trpc_server.TRPCDefaultErrorShape;
        transformer: true;
    }, _trpc_server.TRPCDecorateCreateRouterOptions<{
        upsert: _trpc_server.TRPCMutationProcedure<{
            input: {
                title: string;
                slug: string;
                id?: string | undefined;
            };
            output: {
                id: string;
                title: string;
                slug: string;
            };
            meta: object;
        }>;
        list: _trpc_server.TRPCQueryProcedure<{
            input: void;
            output: ({
                _count: {
                    events: number;
                };
            } & {
                id: string;
                title: string;
                slug: string;
            })[];
            meta: object;
        }>;
        get: _trpc_server.TRPCQueryProcedure<{
            input: string;
            output: ({
                _count: {
                    events: number;
                };
            } & {
                id: string;
                title: string;
                slug: string;
            }) | null;
            meta: object;
        }>;
        delete: _trpc_server.TRPCMutationProcedure<{
            input: string;
            output: {
                id: string;
                title: string;
                slug: string;
            };
            meta: object;
        }>;
    }>>;
    hallencard: _trpc_server.TRPCBuiltRouter<{
        ctx: {
            session: AppSessionUser | null;
            prisma: _prisma_client.PrismaClient<{
                log: ("query" | "warn" | "error")[];
            }, never, _prisma_client_runtime_library.DefaultArgs>;
        };
        meta: object;
        errorShape: _trpc_server.TRPCDefaultErrorShape;
        transformer: true;
    }, _trpc_server.TRPCDecorateCreateRouterOptions<{
        create: _trpc_server.TRPCMutationProcedure<{
            input: {
                value: number;
            };
            output: {
                value: number;
                code: string;
                pin: string;
                printed: boolean;
                transactionId: string | null;
            };
            meta: object;
        }>;
        list: _trpc_server.TRPCQueryProcedure<{
            input: {
                status?: HallencardStatus | null | undefined;
                cursor?: string | null | undefined;
                limit?: number | null | undefined;
            };
            output: {
                items: {
                    value: number;
                    code: string;
                    transaction: {
                        user: {
                            name: string | null;
                            image: string | null;
                        } | null;
                    } | null;
                    printed: boolean;
                }[];
                nextCursor: string | null;
            };
            meta: object;
        }>;
        print: _trpc_server.TRPCQueryProcedure<{
            input: string;
            output: {
                value: number;
                code: string;
                pin: string;
                printed: boolean;
                transactionId: string | null;
            };
            meta: object;
        }>;
        overview: _trpc_server.TRPCQueryProcedure<{
            input: void;
            output: {
                myHallencards: {
                    value: number;
                    code: string;
                    transaction: {
                        createdAt: Date;
                    } | null;
                }[];
                myCurrentValue: (_prisma_client.Prisma.PickEnumerable<_prisma_client.Prisma.TransactionGroupByOutputType, "userId"[]> & {
                    _sum: {
                        value: number | null;
                    };
                })[];
            };
            meta: object;
        }>;
        use: _trpc_server.TRPCMutationProcedure<{
            input: {
                code: string;
                pin: string;
            };
            output: {
                value: number;
                id: string;
                abonnementId: string | null;
                createdAt: Date;
                userId: string | null;
                currency: string;
                reason: _prisma_client.$Enums.TransactionReason;
                paymentInformation: string | null;
                reservationId: string | null;
                deleted: boolean;
            };
            meta: object;
        }>;
        useForAnotherPerson: _trpc_server.TRPCMutationProcedure<{
            input: {
                code: string;
                userId: string;
            };
            output: {
                value: number;
                id: string;
                abonnementId: string | null;
                createdAt: Date;
                userId: string | null;
                currency: string;
                reason: _prisma_client.$Enums.TransactionReason;
                paymentInformation: string | null;
                reservationId: string | null;
                deleted: boolean;
            };
            meta: object;
        }>;
    }>>;
    membership: _trpc_server.TRPCBuiltRouter<{
        ctx: {
            session: AppSessionUser | null;
            prisma: _prisma_client.PrismaClient<{
                log: ("query" | "warn" | "error")[];
            }, never, _prisma_client_runtime_library.DefaultArgs>;
        };
        meta: object;
        errorShape: _trpc_server.TRPCDefaultErrorShape;
        transformer: true;
    }, _trpc_server.TRPCDecorateCreateRouterOptions<{
        getMembershipCardData: _trpc_server.TRPCQueryProcedure<{
            input: void;
            output: {
                id: string;
                name: string | null;
                email: string | null;
                membershipToken: string;
            } | undefined;
            meta: object;
        }>;
    }>>;
    notification: _trpc_server.TRPCBuiltRouter<{
        ctx: {
            session: AppSessionUser | null;
            prisma: _prisma_client.PrismaClient<{
                log: ("query" | "warn" | "error")[];
            }, never, _prisma_client_runtime_library.DefaultArgs>;
        };
        meta: object;
        errorShape: _trpc_server.TRPCDefaultErrorShape;
        transformer: true;
    }, _trpc_server.TRPCDecorateCreateRouterOptions<{
        create: _trpc_server.TRPCMutationProcedure<{
            input: {
                title: string;
                severity: NotificationSeverity;
                showFrom: Date;
                showTo: Date;
                message?: string | null | undefined;
            };
            output: {
                message: string | null;
                id: string;
                title: string;
                severity: _prisma_client.$Enums.NotificationSeverity;
                showFrom: Date;
                showTo: Date;
            };
            meta: object;
        }>;
        get: _trpc_server.TRPCQueryProcedure<{
            input: string;
            output: {
                message: string | null;
                id: string;
                title: string;
                severity: _prisma_client.$Enums.NotificationSeverity;
                showFrom: Date;
                showTo: Date;
            } | null;
            meta: object;
        }>;
        list: _trpc_server.TRPCQueryProcedure<{
            input: {
                cursor?: string | null | undefined;
                limit?: number | null | undefined;
                all?: boolean | undefined;
            };
            output: {
                items: {
                    message: string | null;
                    id: string;
                    title: string;
                    severity: _prisma_client.$Enums.NotificationSeverity;
                    showFrom: Date;
                    showTo: Date;
                }[];
                nextCursor: string | null | undefined;
            };
            meta: object;
        }>;
        update: _trpc_server.TRPCMutationProcedure<{
            input: {
                id: string;
                title: string;
                severity: NotificationSeverity;
                showFrom: Date;
                showTo: Date;
                message?: string | null | undefined;
            };
            output: {
                message: string | null;
                id: string;
                title: string;
                severity: _prisma_client.$Enums.NotificationSeverity;
                showFrom: Date;
                showTo: Date;
            };
            meta: object;
        }>;
        delete: _trpc_server.TRPCMutationProcedure<{
            input: string;
            output: {
                message: string | null;
                id: string;
                title: string;
                severity: _prisma_client.$Enums.NotificationSeverity;
                showFrom: Date;
                showTo: Date;
            };
            meta: object;
        }>;
    }>>;
    organisations: _trpc_server.TRPCBuiltRouter<{
        ctx: {
            session: AppSessionUser | null;
            prisma: _prisma_client.PrismaClient<{
                log: ("query" | "warn" | "error")[];
            }, never, _prisma_client_runtime_library.DefaultArgs>;
        };
        meta: object;
        errorShape: _trpc_server.TRPCDefaultErrorShape;
        transformer: true;
    }, _trpc_server.TRPCDecorateCreateRouterOptions<{
        upsert: _trpc_server.TRPCMutationProcedure<{
            input: {
                title: string;
                slug: string;
                id?: string | undefined;
            };
            output: {
                id: string;
                title: string;
                slug: string;
            };
            meta: object;
        }>;
        list: _trpc_server.TRPCQueryProcedure<{
            input: {
                cursor?: string | null | undefined;
                limit?: number | null | undefined;
            };
            output: {
                items: ({
                    _count: {
                        members: number;
                    };
                } & {
                    id: string;
                    title: string;
                    slug: string;
                })[];
                nextCursor: string | null;
            };
            meta: object;
        }>;
        get: _trpc_server.TRPCQueryProcedure<{
            input: string | undefined;
            output: ({
                members: {
                    function: string | null;
                    id: string;
                    image: string | null;
                    email: string | null;
                    orderID: number | null;
                    fullName: string;
                    phone: string | null;
                    organisationId: string;
                    parentMemberId: string | null;
                }[];
            } & {
                id: string;
                title: string;
                slug: string;
            }) | null;
            meta: object;
        }>;
        delete: _trpc_server.TRPCMutationProcedure<{
            input: string;
            output: {
                id: string;
                title: string;
                slug: string;
            };
            meta: object;
        }>;
    }>>;
    organisationMembers: _trpc_server.TRPCBuiltRouter<{
        ctx: {
            session: AppSessionUser | null;
            prisma: _prisma_client.PrismaClient<{
                log: ("query" | "warn" | "error")[];
            }, never, _prisma_client_runtime_library.DefaultArgs>;
        };
        meta: object;
        errorShape: _trpc_server.TRPCDefaultErrorShape;
        transformer: true;
    }, _trpc_server.TRPCDecorateCreateRouterOptions<{
        upsert: _trpc_server.TRPCMutationProcedure<{
            input: {
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
            };
            output: {
                function: string | null;
                id: string;
                image: string | null;
                email: string | null;
                orderID: number | null;
                fullName: string;
                phone: string | null;
                organisationId: string;
                parentMemberId: string | null;
            };
            meta: object;
        }>;
        list: _trpc_server.TRPCQueryProcedure<{
            input: {
                organisation: string;
                cursor?: string | null | undefined;
                limit?: number | null | undefined;
            };
            output: {
                items: {
                    function: string | null;
                    id: string;
                    image: string | null;
                    email: string | null;
                    orderID: number | null;
                    fullName: string;
                    phone: string | null;
                    organisationId: string;
                    parentMemberId: string | null;
                }[];
                nextCursor: string | null;
            };
            meta: object;
        }>;
        get: _trpc_server.TRPCQueryProcedure<{
            input: string;
            output: ({
                childMembers: {
                    id: string;
                }[];
            } & {
                function: string | null;
                id: string;
                image: string | null;
                email: string | null;
                orderID: number | null;
                fullName: string;
                phone: string | null;
                organisationId: string;
                parentMemberId: string | null;
            }) | null;
            meta: object;
        }>;
        delete: _trpc_server.TRPCMutationProcedure<{
            input: string;
            output: {
                function: string | null;
                id: string;
                image: string | null;
                email: string | null;
                orderID: number | null;
                fullName: string;
                phone: string | null;
                organisationId: string;
                parentMemberId: string | null;
            };
            meta: object;
        }>;
    }>>;
    permission: _trpc_server.TRPCBuiltRouter<{
        ctx: {
            session: AppSessionUser | null;
            prisma: _prisma_client.PrismaClient<{
                log: ("query" | "warn" | "error")[];
            }, never, _prisma_client_runtime_library.DefaultArgs>;
        };
        meta: object;
        errorShape: _trpc_server.TRPCDefaultErrorShape;
        transformer: true;
    }, _trpc_server.TRPCDecorateCreateRouterOptions<{
        create: _trpc_server.TRPCMutationProcedure<{
            input: {
                router: string;
                action: string;
                userRoleId: number;
                allowed: PermissionState;
            };
            output: {
                router: string;
                action: string;
                userRoleId: number;
                allowed: _prisma_client.$Enums.PermissionState;
            };
            meta: object;
        }>;
        createMany: _trpc_server.TRPCMutationProcedure<{
            input: {
                router: string;
                userRoleId: number;
                allowed: PermissionState;
                actions: string[];
            };
            output: _prisma_client.Prisma.BatchPayload;
            meta: object;
        }>;
        list: _trpc_server.TRPCQueryProcedure<{
            input: {
                cursor?: {
                    router: string;
                    action: string;
                    userRoleId: number;
                } | null | undefined;
                limit?: number | null | undefined;
                filterByRoleId?: number | undefined;
            };
            output: {
                items: {
                    router: string;
                    action: string;
                    userRoleId: number;
                    allowed: _prisma_client.$Enums.PermissionState;
                }[];
                nextCursor: {
                    router: string;
                    action: string;
                    userRoleId: number;
                } | null;
            };
            meta: object;
        }>;
        getByRouterAndRoleId: _trpc_server.TRPCQueryProcedure<{
            input: {
                router: string;
                userRoleId: number;
            };
            output: string[];
            meta: object;
        }>;
        getApplicationDialogPermission: _trpc_server.TRPCQueryProcedure<{
            input: ApplicationDialogPermission;
            output: PermissionState;
            meta: object;
        }>;
        getMenuPermissions: _trpc_server.TRPCQueryProcedure<{
            input: void;
            output: string[] | undefined;
            meta: object;
        }>;
        update: _trpc_server.TRPCMutationProcedure<{
            input: {
                router: string;
                action: string;
                userRoleId: number;
                allowed: PermissionState;
            };
            output: {
                router: string;
                action: string;
                userRoleId: number;
                allowed: _prisma_client.$Enums.PermissionState;
            };
            meta: object;
        }>;
        delete: _trpc_server.TRPCMutationProcedure<{
            input: {
                router: string;
                action: string;
                userRoleId: number;
            };
            output: {
                router: string;
                action: string;
                userRoleId: number;
                allowed: _prisma_client.$Enums.PermissionState;
            };
            meta: object;
        }>;
    }>>;
    price: _trpc_server.TRPCBuiltRouter<{
        ctx: {
            session: AppSessionUser | null;
            prisma: _prisma_client.PrismaClient<{
                log: ("query" | "warn" | "error")[];
            }, never, _prisma_client_runtime_library.DefaultArgs>;
        };
        meta: object;
        errorShape: _trpc_server.TRPCDefaultErrorShape;
        transformer: true;
    }, _trpc_server.TRPCDecorateCreateRouterOptions<{
        create: _trpc_server.TRPCMutationProcedure<{
            input: {
                value: number;
                roles: string[];
                currency: string;
                from: string;
                to: string;
                taxes: number;
                areas: string[];
                validFrom?: Date | undefined;
                validTo?: Date | undefined;
                isDefault?: boolean | undefined;
                mon?: boolean | undefined;
                tue?: boolean | undefined;
                wed?: boolean | undefined;
                thu?: boolean | undefined;
                fri?: boolean | undefined;
                sat?: boolean | undefined;
                sun?: boolean | undefined;
            };
            output: {
                value: number;
                id: string;
                currency: string;
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
                taxes: number;
            };
            meta: object;
        }>;
        get: _trpc_server.TRPCQueryProcedure<{
            input: string;
            output: {
                value: number;
                id: string;
                roles: {
                    id: number;
                    title: string;
                }[];
                currency: string;
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
                taxes: number;
                areas: {
                    name: string;
                    id: number;
                }[];
            } | null;
            meta: object;
        }>;
        list: _trpc_server.TRPCQueryProcedure<{
            input: {
                cursor?: string | null | undefined;
                limit?: number | null | undefined;
                filterByRoleId?: number | undefined;
            };
            output: {
                items: {
                    value: number;
                    id: string;
                    currency: string;
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
                    taxes: number;
                }[];
                nextCursor: string | null | undefined;
            };
            meta: object;
        }>;
        update: _trpc_server.TRPCMutationProcedure<{
            input: {
                value: number;
                id: string;
                roles: string[];
                currency: string;
                from: string;
                to: string;
                taxes: number;
                areas: string[];
                validFrom?: Date | undefined;
                validTo?: Date | undefined;
                isDefault?: boolean | undefined;
                mon?: boolean | undefined;
                tue?: boolean | undefined;
                wed?: boolean | undefined;
                thu?: boolean | undefined;
                fri?: boolean | undefined;
                sat?: boolean | undefined;
                sun?: boolean | undefined;
            };
            output: {
                value: number;
                id: string;
                currency: string;
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
                taxes: number;
            };
            meta: object;
        }>;
        delete: _trpc_server.TRPCMutationProcedure<{
            input: string;
            output: {
                value: number;
                id: string;
                currency: string;
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
                taxes: number;
            };
            meta: object;
        }>;
    }>>;
    reservation: _trpc_server.TRPCBuiltRouter<{
        ctx: {
            session: AppSessionUser | null;
            prisma: _prisma_client.PrismaClient<{
                log: ("query" | "warn" | "error")[];
            }, never, _prisma_client_runtime_library.DefaultArgs>;
        };
        meta: object;
        errorShape: _trpc_server.TRPCDefaultErrorShape;
        transformer: true;
    }, _trpc_server.TRPCDecorateCreateRouterOptions<{
        getPrice: _trpc_server.TRPCQueryProcedure<{
            input: {
                start: Date;
                end: Date;
                courtId: string;
            };
            output: {
                total: number;
                taxRate: number;
            };
            meta: object;
        }>;
        getNextReservationStart: _trpc_server.TRPCQueryProcedure<{
            input: {
                courtId: string;
                startTime: Date;
            };
            output: {
                start: Date;
            } | null;
            meta: object;
        }>;
        get: _trpc_server.TRPCQueryProcedure<{
            input: string;
            output: ({
                court: {
                    area: {
                        name: string;
                    };
                    name: string;
                } | null;
                fellows: {
                    name: string | null;
                }[];
            } & {
                type: _prisma_client.$Enums.ReservationType | null;
                status: _prisma_client.$Enums.ReservationStatus;
                price: number | null;
                id: string;
                title: string;
                start: Date;
                end: Date;
                courtId: string | null;
                paypalTransactionId: string | null;
                taxRate: number | null;
                light: boolean;
                radiator: boolean;
                abonnementId: string | null;
                ownerId: string | null;
                createdAt: Date;
                deletedAt: Date | null;
            }) | null;
            meta: object;
        }>;
        getReservationsByRessource: _trpc_server.TRPCQueryProcedure<{
            input: {
                date: Date;
                courtId: string;
            };
            output: {
                owner: undefined;
                title: string;
                type: _prisma_client.$Enums.ReservationType | null;
                status: _prisma_client.$Enums.ReservationStatus;
                id: string;
                start: Date;
                end: Date;
                abonnementId: string | null;
            }[];
            meta: object;
        }>;
        create: _trpc_server.TRPCMutationProcedure<{
            input: {
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
            };
            output: _prisma_client.Prisma.BatchPayload | {
                type: _prisma_client.$Enums.ReservationType | null;
                status: _prisma_client.$Enums.ReservationStatus;
                price: number | null;
                id: string;
                title: string;
                start: Date;
                end: Date;
                courtId: string | null;
                paypalTransactionId: string | null;
                taxRate: number | null;
                light: boolean;
                radiator: boolean;
                abonnementId: string | null;
                ownerId: string | null;
                createdAt: Date;
                deletedAt: Date | null;
            };
            meta: object;
        }>;
        payForReservation: _trpc_server.TRPCMutationProcedure<{
            input: {
                reservationId: string;
                useHallencard: boolean;
            };
            output: {
                reservation: {
                    type: _prisma_client.$Enums.ReservationType | null;
                    status: _prisma_client.$Enums.ReservationStatus;
                    price: number | null;
                    id: string;
                    title: string;
                    start: Date;
                    end: Date;
                    courtId: string | null;
                    paypalTransactionId: string | null;
                    taxRate: number | null;
                    light: boolean;
                    radiator: boolean;
                    abonnementId: string | null;
                    ownerId: string | null;
                    createdAt: Date;
                    deletedAt: Date | null;
                };
                paypalTransaction: undefined;
            } | {
                reservation: undefined;
                paypalTransaction: _paypal_paypal_js.OrderResponseBody;
            };
            meta: object;
        }>;
        checkPaymentStatus: _trpc_server.TRPCMutationProcedure<{
            input: string;
            output: {};
            meta: object;
        }>;
        paymentCanceled: _trpc_server.TRPCMutationProcedure<{
            input: string;
            output: void;
            meta: object;
        }>;
        cancelReservation: _trpc_server.TRPCMutationProcedure<{
            input: string;
            output: void;
            meta: object;
        }>;
        delete: _trpc_server.TRPCMutationProcedure<{
            input: string;
            output: {};
            meta: object;
        }>;
        deleteAbo: _trpc_server.TRPCMutationProcedure<{
            input: string;
            output: {};
            meta: object;
        }>;
        deleteUnapproved: _trpc_server.TRPCQueryProcedure<{
            input: void;
            output: boolean;
            meta: object;
        }>;
        getEmptyCourts: _trpc_server.TRPCQueryProcedure<{
            input: {
                areaId: number;
                start: Date;
                end: Date;
            };
            output: {
                name: string;
                description: string | null;
                areaId: number;
                id: string;
                shortName: string | null;
                activeFrom: Date | null;
                activeTo: Date | null;
                order: number | null;
                active: boolean;
            }[];
            meta: object;
        }>;
    }>>;
    reservationRule: _trpc_server.TRPCBuiltRouter<{
        ctx: {
            session: AppSessionUser | null;
            prisma: _prisma_client.PrismaClient<{
                log: ("query" | "warn" | "error")[];
            }, never, _prisma_client_runtime_library.DefaultArgs>;
        };
        meta: object;
        errorShape: _trpc_server.TRPCDefaultErrorShape;
        transformer: true;
    }, _trpc_server.TRPCDecorateCreateRouterOptions<{
        create: _trpc_server.TRPCMutationProcedure<{
            input: {
                value: string;
                name: string;
                checkOn: ReservationRuleCheckOn;
                affectedCourts?: string[] | undefined;
                errorDescription?: string | undefined;
                validFor?: string[] | undefined;
                affectedAreas?: string[] | undefined;
                ruleCheckPluginName?: string | undefined;
            };
            output: {
                value: string;
                name: string;
                id: string;
                errorDescription: string | null;
                checkOn: _prisma_client.$Enums.ReservationRuleCheckOn;
                ruleCheckPluginName: string | null;
            };
            meta: object;
        }>;
        list: _trpc_server.TRPCQueryProcedure<{
            input: void;
            output: {
                name: string;
                id: string;
                affectedCourts: {
                    name: string;
                }[];
                validFor: {
                    title: string;
                }[];
                affectedAreas: {
                    name: string;
                }[];
                checkOn: _prisma_client.$Enums.ReservationRuleCheckOn;
            }[];
            meta: object;
        }>;
        get: _trpc_server.TRPCQueryProcedure<{
            input: string;
            output: {
                value: string;
                name: string;
                id: string;
                affectedCourts: {
                    name: string;
                    id: string;
                }[];
                errorDescription: string | null;
                validFor: {
                    id: number;
                    title: string;
                }[];
                affectedAreas: {
                    name: string;
                    id: number;
                }[];
                checkOn: _prisma_client.$Enums.ReservationRuleCheckOn;
                ruleCheckPluginName: string | null;
            } | null;
            meta: object;
        }>;
        update: _trpc_server.TRPCMutationProcedure<{
            input: {
                value: string;
                name: string;
                id: string;
                checkOn: ReservationRuleCheckOn;
                affectedCourts?: string[] | undefined;
                errorDescription?: string | undefined;
                validFor?: string[] | undefined;
                affectedAreas?: string[] | undefined;
                ruleCheckPluginName?: string | undefined;
            };
            output: {
                value: string;
                name: string;
                id: string;
                errorDescription: string | null;
                checkOn: _prisma_client.$Enums.ReservationRuleCheckOn;
                ruleCheckPluginName: string | null;
            };
            meta: object;
        }>;
        delete: _trpc_server.TRPCMutationProcedure<{
            input: string;
            output: {
                value: string;
                name: string;
                id: string;
                errorDescription: string | null;
                checkOn: _prisma_client.$Enums.ReservationRuleCheckOn;
                ruleCheckPluginName: string | null;
            };
            meta: object;
        }>;
    }>>;
    season: _trpc_server.TRPCBuiltRouter<{
        ctx: {
            session: AppSessionUser | null;
            prisma: _prisma_client.PrismaClient<{
                log: ("query" | "warn" | "error")[];
            }, never, _prisma_client_runtime_library.DefaultArgs>;
        };
        meta: object;
        errorShape: _trpc_server.TRPCDefaultErrorShape;
        transformer: true;
    }, _trpc_server.TRPCDecorateCreateRouterOptions<{
        upsert: _trpc_server.TRPCMutationProcedure<{
            input: {
                name: string;
                shortName: string;
                starting: Date;
                ending: Date;
                id?: number | undefined;
            };
            output: {
                name: string;
                id: number;
                shortName: string;
                starting: Date;
                ending: Date;
                current: boolean;
            };
            meta: object;
        }>;
        list: _trpc_server.TRPCQueryProcedure<{
            input: void;
            output: ({
                _count: {
                    teams: number;
                    players: number;
                };
            } & {
                name: string;
                id: number;
                shortName: string;
                starting: Date;
                ending: Date;
                current: boolean;
            })[];
            meta: object;
        }>;
        get: _trpc_server.TRPCQueryProcedure<{
            input: number;
            output: ({
                _count: {
                    teams: number;
                    players: number;
                };
            } & {
                name: string;
                id: number;
                shortName: string;
                starting: Date;
                ending: Date;
                current: boolean;
            }) | null;
            meta: object;
        }>;
        getCurrentSeason: _trpc_server.TRPCQueryProcedure<{
            input: void;
            output: {
                name: string;
                id: number;
                shortName: string;
                starting: Date;
                ending: Date;
                current: boolean;
            } | null;
            meta: object;
        }>;
        setCurrentSeason: _trpc_server.TRPCMutationProcedure<{
            input: number;
            output: [{
                name: string;
                id: number;
                shortName: string;
                starting: Date;
                ending: Date;
                current: boolean;
            }, _prisma_client.Prisma.BatchPayload];
            meta: object;
        }>;
        listActiveAndFuture: _trpc_server.TRPCQueryProcedure<{
            input: {
                teamFilter?: number | undefined;
                invertTeamFilter?: boolean | undefined;
            };
            output: {
                name: string;
                id: number;
                shortName: string;
                starting: Date;
                ending: Date;
                current: boolean;
            }[];
            meta: object;
        }>;
        delete: _trpc_server.TRPCMutationProcedure<{
            input: number;
            output: {
                name: string;
                id: number;
                shortName: string;
                starting: Date;
                ending: Date;
                current: boolean;
            };
            meta: object;
        }>;
    }>>;
    team: _trpc_server.TRPCBuiltRouter<{
        ctx: {
            session: AppSessionUser | null;
            prisma: _prisma_client.PrismaClient<{
                log: ("query" | "warn" | "error")[];
            }, never, _prisma_client_runtime_library.DefaultArgs>;
        };
        meta: object;
        errorShape: _trpc_server.TRPCDefaultErrorShape;
        transformer: true;
    }, _trpc_server.TRPCDecorateCreateRouterOptions<{
        upsert: _trpc_server.TRPCMutationProcedure<{
            input: {
                name: string;
                shortName: string;
                category: TeamCategory;
                orderNumber: number;
                id?: number | undefined;
            };
            output: {
                name: string;
                id: number;
                shortName: string;
                category: _prisma_client.$Enums.TeamCategory;
                orderNumber: number;
            };
            meta: object;
        }>;
        list: _trpc_server.TRPCQueryProcedure<{
            input: void;
            output: {
                name: string;
                id: number;
                shortName: string;
                category: _prisma_client.$Enums.TeamCategory;
                orderNumber: number;
            }[];
            meta: object;
        }>;
        get: _trpc_server.TRPCQueryProcedure<{
            input: number | undefined;
            output: {} | null;
            meta: object;
        }>;
        delete: _trpc_server.TRPCMutationProcedure<{
            input: number;
            output: {
                name: string;
                id: number;
                shortName: string;
                category: _prisma_client.$Enums.TeamCategory;
                orderNumber: number;
            };
            meta: object;
        }>;
    }>>;
    teamSeason: _trpc_server.TRPCBuiltRouter<{
        ctx: {
            session: AppSessionUser | null;
            prisma: _prisma_client.PrismaClient<{
                log: ("query" | "warn" | "error")[];
            }, never, _prisma_client_runtime_library.DefaultArgs>;
        };
        meta: object;
        errorShape: _trpc_server.TRPCDefaultErrorShape;
        transformer: true;
    }, _trpc_server.TRPCDecorateCreateRouterOptions<{
        get: _trpc_server.TRPCQueryProcedure<{
            input: {
                teamId: number;
                seasonId: number;
            };
            output: {
                teamId: number;
                seasonId: number;
                teamLeaderId: string | null;
                nuGroupId: string;
                nuTeamId: string;
                leagueName: string;
            } | null;
            meta: object;
        }>;
        upsert: _trpc_server.TRPCMutationProcedure<{
            input: {
                teamId: number;
                seasonId: number;
                nuGroupId: string;
                nuTeamId: string;
                leagueName: string;
                teamLeaderId?: string | null | undefined;
            };
            output: {
                teamId: number;
                seasonId: number;
                teamLeaderId: string | null;
                nuGroupId: string;
                nuTeamId: string;
                leagueName: string;
            };
            meta: object;
        }>;
        listBySeasonId: _trpc_server.TRPCQueryProcedure<{
            input: number;
            output: ({
                team: {
                    name: string;
                };
            } & {
                teamId: number;
                seasonId: number;
                teamLeaderId: string | null;
                nuGroupId: string;
                nuTeamId: string;
                leagueName: string;
            })[];
            meta: object;
        }>;
        listByTeamId: _trpc_server.TRPCQueryProcedure<{
            input: number;
            output: ({
                season: {
                    name: string;
                };
            } & {
                teamId: number;
                seasonId: number;
                teamLeaderId: string | null;
                nuGroupId: string;
                nuTeamId: string;
                leagueName: string;
            })[];
            meta: object;
        }>;
        listByCategory: _trpc_server.TRPCQueryProcedure<{
            input: {
                category: TeamCategory;
                season?: number | undefined;
            };
            output: {
                team: {
                    name: string;
                };
                nuGroupId: string;
                nuTeamId: string;
                leagueName: string;
            }[];
            meta: object;
        }>;
        listLeagueNames: _trpc_server.TRPCQueryProcedure<{
            input: void;
            output: string[];
            meta: object;
        }>;
        delete: _trpc_server.TRPCMutationProcedure<{
            input: {
                teamId: number;
                seasonId: number;
            };
            output: {
                teamId: number;
                seasonId: number;
                teamLeaderId: string | null;
                nuGroupId: string;
                nuTeamId: string;
                leagueName: string;
            };
            meta: object;
        }>;
    }>>;
    transaction: _trpc_server.TRPCBuiltRouter<{
        ctx: {
            session: AppSessionUser | null;
            prisma: _prisma_client.PrismaClient<{
                log: ("query" | "warn" | "error")[];
            }, never, _prisma_client_runtime_library.DefaultArgs>;
        };
        meta: object;
        errorShape: _trpc_server.TRPCDefaultErrorShape;
        transformer: true;
    }, _trpc_server.TRPCDecorateCreateRouterOptions<{
        create: _trpc_server.TRPCMutationProcedure<{
            input: {
                value: number;
                userId: string;
                currency: string;
                reason: TransactionReason;
                reservationId?: string | null | undefined;
            };
            output: {
                value: number;
                id: string;
                abonnementId: string | null;
                createdAt: Date;
                userId: string | null;
                currency: string;
                reason: _prisma_client.$Enums.TransactionReason;
                paymentInformation: string | null;
                reservationId: string | null;
                deleted: boolean;
            };
            meta: object;
        }>;
        balance: _trpc_server.TRPCQueryProcedure<{
            input: string | undefined;
            output: (_prisma_client.Prisma.PickEnumerable<_prisma_client.Prisma.TransactionGroupByOutputType, "userId"[]> & {
                _sum: {
                    value: number | null;
                };
            })[];
            meta: object;
        }>;
        list: _trpc_server.TRPCQueryProcedure<{
            input: string | undefined;
            output: {
                value: number;
                id: string;
                abonnementId: string | null;
                createdAt: Date;
                userId: string | null;
                currency: string;
                reason: _prisma_client.$Enums.TransactionReason;
                paymentInformation: string | null;
                reservationId: string | null;
                deleted: boolean;
            }[];
            meta: object;
        }>;
        refund: _trpc_server.TRPCMutationProcedure<{
            input: string;
            output: {
                value: number;
                id: string;
                abonnementId: string | null;
                createdAt: Date;
                userId: string | null;
                currency: string;
                reason: _prisma_client.$Enums.TransactionReason;
                paymentInformation: string | null;
                reservationId: string | null;
                deleted: boolean;
            };
            meta: object;
        }>;
    }>>;
    user: _trpc_server.TRPCBuiltRouter<{
        ctx: {
            session: AppSessionUser | null;
            prisma: _prisma_client.PrismaClient<{
                log: ("query" | "warn" | "error")[];
            }, never, _prisma_client_runtime_library.DefaultArgs>;
        };
        meta: object;
        errorShape: _trpc_server.TRPCDefaultErrorShape;
        transformer: true;
    }, _trpc_server.TRPCDecorateCreateRouterOptions<{
        get: _trpc_server.TRPCQueryProcedure<{
            input: string | undefined;
            output: {
                name: string | null;
                id: string;
                image: string | null;
                email: string | null;
                address: string | null;
                cityCode: string | null;
                cityName: string | null;
                countryCode: string | null;
                publicName: boolean;
                phoneNumber: string | null;
                roles: {
                    description: string | null;
                    id: number;
                    title: string;
                }[];
            } | null;
            meta: object;
        }>;
        update: _trpc_server.TRPCMutationProcedure<{
            input: {
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
            };
            output: {
                name: string | null;
                id: string;
                image: string | null;
                needsSetup: boolean;
                email: string | null;
                auth0Id: string;
                address: string | null;
                cityCode: string | null;
                cityName: string | null;
                countryCode: string | null;
                publicName: boolean;
                phoneNumber: string | null;
            };
            meta: object;
        }>;
        updateRoles: _trpc_server.TRPCMutationProcedure<{
            input: {
                id: string;
                roles: string[];
            };
            output: {
                name: string | null;
                id: string;
                image: string | null;
                needsSetup: boolean;
                email: string | null;
                auth0Id: string;
                address: string | null;
                cityCode: string | null;
                cityName: string | null;
                countryCode: string | null;
                publicName: boolean;
                phoneNumber: string | null;
            };
            meta: object;
        }>;
        delete: _trpc_server.TRPCQueryProcedure<{
            input: string;
            output: {
                name: string | null;
                id: string;
                image: string | null;
                needsSetup: boolean;
                email: string | null;
                auth0Id: string;
                address: string | null;
                cityCode: string | null;
                cityName: string | null;
                countryCode: string | null;
                publicName: boolean;
                phoneNumber: string | null;
            };
            meta: object;
        }>;
        getAutosuggestOptions: _trpc_server.TRPCQueryProcedure<{
            input: string;
            output: {
                name: string | null;
                id: string;
                image: string | null;
                email: string | null;
            }[];
            meta: object;
        }>;
    }>>;
    userRole: _trpc_server.TRPCBuiltRouter<{
        ctx: {
            session: AppSessionUser | null;
            prisma: _prisma_client.PrismaClient<{
                log: ("query" | "warn" | "error")[];
            }, never, _prisma_client_runtime_library.DefaultArgs>;
        };
        meta: object;
        errorShape: _trpc_server.TRPCDefaultErrorShape;
        transformer: true;
    }, _trpc_server.TRPCDecorateCreateRouterOptions<{
        create: _trpc_server.TRPCMutationProcedure<{
            input: {
                title: string;
                isDefault: boolean;
                priority: number;
                description?: string | null | undefined;
            };
            output: {
                description: string | null;
                id: number;
                title: string;
                isDefault: boolean;
                priority: number;
            };
            meta: object;
        }>;
        list: _trpc_server.TRPCQueryProcedure<{
            input: void;
            output: {
                description: string | null;
                id: number;
                _count: {
                    permissions: number;
                    users: number;
                    prices: number;
                    reservationRules: number;
                };
                title: string;
            }[];
            meta: object;
        }>;
        get: _trpc_server.TRPCQueryProcedure<{
            input: number;
            output: {
                description: string | null;
                id: number;
                _count: {
                    permissions: number;
                    users: number;
                    prices: number;
                    reservationRules: number;
                };
                title: string;
                isDefault: boolean;
            };
            meta: object;
        }>;
        getUsersByRole: _trpc_server.TRPCQueryProcedure<{
            input: number;
            output: {
                name: string | null;
                id: string;
                image: string | null;
                email: string | null;
            }[];
            meta: object;
        }>;
        getAddableUsers: _trpc_server.TRPCQueryProcedure<{
            input: number;
            output: {
                name: string | null;
                id: string;
                image: string | null;
                email: string | null;
            }[];
            meta: object;
        }>;
        update: _trpc_server.TRPCMutationProcedure<{
            input: {
                id: number;
                title: string;
                isDefault: boolean;
                priority: number;
                description?: string | null | undefined;
            };
            output: {
                description: string | null;
                id: number;
                title: string;
                isDefault: boolean;
                priority: number;
            };
            meta: object;
        }>;
        delete: _trpc_server.TRPCMutationProcedure<{
            input: number;
            output: {
                description: string | null;
                id: number;
                title: string;
                isDefault: boolean;
                priority: number;
            };
            meta: object;
        }>;
        removeUserFromRole: _trpc_server.TRPCMutationProcedure<{
            input: {
                userId: string;
                roleId: number;
            };
            output: {
                description: string | null;
                id: number;
                title: string;
                isDefault: boolean;
                priority: number;
            };
            meta: object;
        }>;
        addUsersToRole: _trpc_server.TRPCMutationProcedure<{
            input: {
                roleId: number;
                userIds: string[];
            };
            output: {
                description: string | null;
                id: number;
                title: string;
                isDefault: boolean;
                priority: number;
            };
            meta: object;
        }>;
    }>>;
}>>;

type AppRouter = typeof appRouter;
type RouterInputs = inferRouterInputs<AppRouter>;
type RouterOutputs = inferRouterOutputs<AppRouter>;

export type { AppRouter, RouterInputs, RouterOutputs };
