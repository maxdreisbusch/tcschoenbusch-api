import {
	AmountWithBreakdown,
	ApiError,
	CheckoutPaymentIntent,
	Client,
	Environment,
	Item,
	ItemCategory,
	LogLevel,
	OrderRequest,
	OrdersController,
} from '@paypal/paypal-server-sdk';
import { env } from 'utils/env';

import { getTaxValueFromGross } from 'utils/backend';

const { PAYPAL_ID, PAYPAL_SECRET, NODE_ENV } = env;

const client = new Client({
	clientCredentialsAuthCredentials: {
		oAuthClientId: PAYPAL_ID,
		oAuthClientSecret: PAYPAL_SECRET,
	},
	timeout: 0,
	environment: NODE_ENV === 'production' ? Environment.Production : Environment.Sandbox,
	logging: {
		logLevel: LogLevel.Info,
		logRequest: {
			logBody: true,
		},
		logResponse: {
			logHeaders: true,
		},
	},
});
const ordersController = new OrdersController(client);

export const createOrder = async (purchaseItems: Item[], currency_code = 'eur', discount = 0, returnUrl?: string, cancelUrl?: string) => {
	const experienceContext = returnUrl && cancelUrl ? { returnUrl, cancelUrl } : undefined;

	const collect: { body: OrderRequest; prefer: string } = {
		body: {
			intent: CheckoutPaymentIntent.Capture,
			purchaseUnits: [
				{
					description: 'Platzbuchung beim TC Schönbusch',
					items: purchaseItems,
					amount: createAmount(purchaseItems, currency_code, discount),
				},
			],
			paymentSource: {
				card: { experienceContext },
				paypal: { experienceContext },
				applePay: { experienceContext },
				googlePay: { experienceContext },
			},
		},
		prefer: 'return=minimal',
	};

	try {
		const { result } = await ordersController.createOrder(collect);

		return result;
	} catch (error) {
		if (error instanceof ApiError) {
			const errors = error.result;
			console.error(errors);
		}
		return undefined;
	}
};

export const capturePayment = (id: string) => ordersController.captureOrder({ id });

export const createPurchaseItem = (title: string, value: number, taxRate: number, currencyCode = 'eur', quantity = '1'): Item => {
	const taxValue = getTaxValueFromGross(value, taxRate);

	return {
		name: title,
		quantity: quantity,
		unitAmount: {
			currencyCode,
			value: (value - taxValue).toFixed(2).toString(),
		},
		tax: {
			currencyCode,
			value: taxValue.toFixed(2).toString(),
		},
		category: ItemCategory.DigitalGoods,
	};
};

const createAmount = (items: Array<Item>, currencyCode = 'eur', discount = 0): AmountWithBreakdown => {
	let netTotal = 0;
	let taxTotal = 0;

	for (const i of items) {
		netTotal += parseFloat(i.unitAmount.value) * parseFloat(i.quantity);
		taxTotal += i.tax ? parseFloat(i.tax.value) * parseFloat(i.quantity) : 0;
	}

	return {
		currencyCode,
		value: (netTotal + taxTotal - discount).toFixed(2),
		breakdown: {
			itemTotal: { currencyCode, value: netTotal.toFixed(2) },
			taxTotal: { currencyCode, value: taxTotal.toFixed(2) },
			discount: { currencyCode, value: discount.toFixed(2) },
		},
	};
};
