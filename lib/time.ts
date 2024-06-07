export const now = () => {
	return new Date().valueOf();
};

export const seconds = (milliseconds: number) => {
	return Math.floor(milliseconds / 1000);
};
