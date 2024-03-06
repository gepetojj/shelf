export const now = () => {
	return new Date().valueOf();
};

export const seconds = (val: number) => {
	return Math.floor(val / 1000);
};
