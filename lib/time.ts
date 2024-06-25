export const now = () => {
	return new Date().valueOf();
};

export const seconds = (milliseconds: number) => {
	return Math.floor(milliseconds / 1000);
};

export const daysBetween = (date1: Date, date2: Date) => {
	const diff = date2.getTime() - date1.getTime();
	return Math.floor(diff / (1000 * 60 * 60 * 24));
};
