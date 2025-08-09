import type { PurchaseItem, CreateOrderRequestBody, OrderResponseBody, AmountWithBreakdown } from '@paypal/paypal-js/types';
import axios from 'axios';
import { env } from '../utils/env';
import { getTaxValueFromGross } from 'utils/backend';

const { PAYPAL_URL, PAYPAL_ID, PAYPAL_SECRET } = env;

const paypalClient = axios.create({ baseURL: PAYPAL_URL });

const generatePaypalToken = async () => {
	const auth = Buffer.from(`${PAYPAL_ID}:${PAYPAL_SECRET}`).toString('base64');

	const res = await paypalClient.post<{ access_token: string }>('/v1/oauth2/token', 'grant_type=client_credentials', {
		headers: { Authorization: `Basic ${auth}` },
	});

	return res.data.access_token;
};

export const createPurchaseItem = (title: string, value: number, taxRate: number, currency_code = 'eur', quantity = '1'): PurchaseItem => {
	const taxValue = getTaxValueFromGross(value, taxRate);

	return {
		name: title,
		quantity: quantity,
		unit_amount: {
			currency_code,
			value: (value - taxValue).toFixed(2).toString(),
		},
		tax: {
			currency_code,
			value: taxValue.toFixed(2).toString(),
		},
		category: 'DIGITAL_GOODS',
	};
};

export const createAmount = (items: Array<PurchaseItem>, currency_code = 'eur', discount = 0): AmountWithBreakdown => {
	let netTotal = 0;
	let taxTotal = 0;

	for (const i of items) {
		netTotal += parseFloat(i.unit_amount.value) * parseFloat(i.quantity);
		taxTotal += i.tax ? parseFloat(i.tax.value) * parseFloat(i.quantity) : 0;
	}

	return {
		currency_code,
		value: (netTotal + taxTotal - discount).toFixed(2),
		breakdown: {
			item_total: { currency_code, value: netTotal.toFixed(2) },
			tax_total: { currency_code, value: taxTotal.toFixed(2) },
			discount: { currency_code, value: discount.toFixed(2) },
		},
	};
};

export const createOrder = async (purchaseItems: Array<PurchaseItem>, currency_code = 'eur', discount = 0): Promise<OrderResponseBody> => {
	console.log('I am here 1');
	const token = await generatePaypalToken();
	console.log('I am here 2');
	const body: CreateOrderRequestBody = {
		intent: 'CAPTURE',
		purchase_units: [
			{
				description: 'Platzbuchung beim TC Schönbusch',
				items: purchaseItems,
				amount: createAmount(purchaseItems, currency_code, discount),
			},
		],
	};
	console.log('I am here 100');
	const res = await paypalClient.post<OrderResponseBody>('/v2/checkout/orders', body, {
		headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
	});

	return res.data;
};

export const capturePayment = async (orderId: string) => {
	const accessToken = await generatePaypalToken();

	const res = await paypalClient.post<OrderResponseBody>(`/v2/checkout/orders/${orderId}/capture`, undefined, {
		headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
	});

	return res.data;
};
