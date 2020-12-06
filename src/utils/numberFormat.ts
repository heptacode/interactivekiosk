const numberFormat = (number: number): string => {
	return new Intl.NumberFormat().format(number);
};

export default numberFormat;
