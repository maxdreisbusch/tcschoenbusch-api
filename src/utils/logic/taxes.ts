export const getNetFromGross = (grossPrice: number, taxRate = 19) => {
	const vat = taxRate / 100;

	//Net = Gross / (1 + Vat)
	return +(grossPrice / (1 + vat)).toFixed(2);
};

export const getTaxValueFromGross = (gross: number, taxRate = 19) => {
	const vat = taxRate / 100;

	//Tax = Gross * Vat / (1 + Vat)
	return +((gross * vat) / (1 + vat)).toFixed(2);
};
